import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function StatsGrid() {
  const session = await auth();
  const userId = session?.user?.id;

  let balance = 0;
  let totalSpent = 0;
  let txCount = 0;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true } });
    balance = user?.balance || 0;

    const txs = await prisma.transaction.findMany({
      where: { userId, status: "COMPLETED" },
      select: { total: true }
    });

    txCount = txs.length;
    totalSpent = txs.reduce((acc, tx) => acc + tx.total, 0);
  }

  const avgTicket = txCount > 0 ? totalSpent / txCount : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 font-sans h-full">
      <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6 flex flex-col justify-center min-h-[140px]">
        <p className="text-[11px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest">Saldo</p>
        <h3 className="text-3xl font-bold text-white mb-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
        </h3>
        <p className="text-[11px] text-[#6b7280]">Disponível para compras</p>
      </div>

      <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6 flex flex-col justify-center min-h-[140px]">
        <p className="text-[11px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest">Compras</p>
        <h3 className="text-3xl font-bold text-white mb-1">{txCount}</h3>
        <p className="text-[11px] text-[#6b7280]">Cartões adquiridos</p>
      </div>

      <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6 flex flex-col justify-center min-h-[140px]">
        <p className="text-[11px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest">Total Gasto</p>
        <h3 className="text-3xl font-bold text-white mb-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
        </h3>
        <p className="text-[11px] text-[#6b7280]">Desde o cadastro</p>
      </div>

      <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6 flex flex-col justify-center min-h-[140px]">
        <p className="text-[11px] font-bold text-[#4b5563] mb-3 uppercase tracking-widest">Ticket Médio</p>
        <h3 className="text-3xl font-bold text-white mb-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(avgTicket)}
        </h3>
        <p className="text-[11px] text-[#6b7280]">Por compra</p>
      </div>
    </div>
  );
}
