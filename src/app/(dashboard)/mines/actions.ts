"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Helpers
function generateBombs(bombsCount: number): number[] {
  const bombs = new Set<number>();
  while (bombs.size < bombsCount) {
    bombs.add(Math.floor(Math.random() * 25));
  }
  return Array.from(bombs);
}

function calculateMultiplier(bombsCount: number, hits: number, baseMult: number) {
  // Simple risk formula: 
  // Base * (1 + (bombs/25) * hits * 0.5)
  // Ensures riskier games pay more.
  const riskFactor = (bombsCount / 25) * 2; // e.g. 5 bombs = 0.4
  return 1 + (hits * baseMult * riskFactor);
}

export async function startGame(betAmount: number, bombsCount: number) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não logado" };

  if (betAmount <= 0) return { success: false, error: "Aposta inválida" };
  if (bombsCount < 1 || bombsCount > 24) return { success: false, error: "Bombas inválidas" };

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get configs
      const configs = await tx.systemConfig.findMany({
        where: { key: { in: ["mines_active", "mines_multiplier", "mines_max_bet"] } }
      });
      const map = configs.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {} as any);
      
      if (map.mines_active !== "true") throw new Error("Evento desativado");
      const maxBet = parseFloat(map.mines_max_bet || "100");
      if (betAmount > maxBet) throw new Error(`Aposta máxima é R$${maxBet}`);

      const user = await tx.user.findUnique({ where: { id: session!.user!.id } });
      if (!user) throw new Error("Usuário não encontrado");
      if (user.balance < betAmount) throw new Error("Saldo insuficiente");

      // 2. Deduct balance
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: betAmount } }
      });
      await tx.balanceMovement.create({
        data: { userId: user.id, amount: -betAmount, type: "MINES_BET", description: `Aposta de R$${betAmount} no Mines` }
      });

      // 3. Create game
      const bombs = generateBombs(bombsCount);
      const game = await (tx as any).minesGame.create({
        data: {
          userId: user.id,
          betAmount,
          bombsCount,
          multiplier: parseFloat(map.mines_multiplier || "1.5"),
          boardData: JSON.stringify({ bombs, clicked: [] }),
          status: "PLAYING"
        }
      });

      return { success: true, gameId: game.id, newBalance: user.balance - betAmount };
    });
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function revealCell(gameId: string, cellIndex: number) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não logado" };

  try {
    return await prisma.$transaction(async (tx) => {
      const game = await (tx as any).minesGame.findUnique({ where: { id: gameId, userId: session!.user!.id } });
      if (!game || game.status !== "PLAYING") throw new Error("Jogo inválido ou já finalizado");

      const board = JSON.parse(game.boardData);
      if (board.clicked.includes(cellIndex)) return { success: true, status: "PLAYING" }; // already clicked

      board.clicked.push(cellIndex);
      const isBomb = board.bombs.includes(cellIndex);

      if (isBomb) {
        // BUST!
        await (tx as any).minesGame.update({
          where: { id: game.id },
          data: { status: "BUST", boardData: JSON.stringify(board), profit: -game.betAmount }
        });
        return { success: true, status: "BUST", board: board.bombs };
      }

      // Safe
      const nextMult = calculateMultiplier(game.bombsCount, board.clicked.length, game.multiplier);
      
      await (tx as any).minesGame.update({
        where: { id: game.id },
        data: { boardData: JSON.stringify(board) }
      });

      return { success: true, status: "PLAYING", currentMultiplier: nextMult };
    });
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function cashOut(gameId: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Não logado" };

  try {
    return await prisma.$transaction(async (tx) => {
      const game = await (tx as any).minesGame.findUnique({ where: { id: gameId, userId: session!.user!.id } });
      if (!game || game.status !== "PLAYING") throw new Error("Jogo inválido ou já finalizado");

      const board = JSON.parse(game.boardData);
      if (board.clicked.length === 0) throw new Error("Você precisa revelar pelo menos 1 casa.");

      const mult = calculateMultiplier(game.bombsCount, board.clicked.length, game.multiplier);
      const profit = game.betAmount * mult;

      // Credit balance
      await tx.user.update({
        where: { id: session!.user!.id },
        data: { balance: { increment: profit } }
      });
      await tx.balanceMovement.create({
        data: { userId: session!.user!.id as string, amount: profit, type: "MINES_WIN", description: `Lucro de R$${profit.toFixed(2)} no Mines` }
      });

      await (tx as any).minesGame.update({
        where: { id: game.id },
        data: { status: "CASHOUT", profit: profit - game.betAmount }
      });

      revalidatePath("/dashboard");
      return { success: true, profit, bombs: board.bombs };
    });
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
