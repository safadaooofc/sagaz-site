import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function StatsGrid() {
  const session = await auth();
  const userId = session?.user?.id;

  let balance = 0;
  let purchasesCount = 0;
  let totalSpent = 0;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { balance: true } });
    balance = user?.balance || 0;

    const txs = await prisma.transaction.findMany({
      where: { userId, status: "COMPLETED" },
      select: { total: true }
    });

    purchasesCount = txs.length;
    totalSpent = txs.reduce((acc, tx) => acc + tx.total, 0);
  }

  const avgTicket = purchasesCount > 0 ? totalSpent / purchasesCount : 0;

  const stats = [
    { label: "SALDO", value: `R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, sub: "Disponível para compras" },
    { label: "COMPRAS", value: purchasesCount.toString(), sub: "Produtos adquiridos" },
    { label: "TOTAL GASTO", value: `R$ ${totalSpent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, sub: "Desde o cadastro" },
    { label: "TICKET MÉDIO", value: `R$ ${avgTicket.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, sub: "Por compra" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#181a20] border border-[#262933] p-6 rounded-lg flex flex-col justify-center">
          <p className="text-[11px] font-bold text-[#9ca3af] mb-1">{stat.label}</p>
          <h3 className="text-3xl font-bold text-white leading-none mb-1">{stat.value}</h3>
          <p className="text-xs text-[#6b7280]">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
