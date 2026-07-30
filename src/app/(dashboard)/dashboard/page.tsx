import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardDataTable, TransactionData } from "@/components/dashboard/DashboardDataTable";

function SectionCards({
  balance = 0,
  totalPurchases = 0,
  totalSpent = 0,
  averageValue = 0,
}: {
  balance?: number;
  totalPurchases?: number;
  totalSpent?: number;
  averageValue?: number;
}) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const stats = [
    {
      label: "Saldo",
      value: formatCurrency(balance),
      description: "Disponível para compras",
    },
    {
      label: "Compras",
      value: String(totalPurchases),
      description: "Cartões adquiridos",
    },
    {
      label: "Total gasto",
      value: formatCurrency(totalSpent),
      description: "Desde o cadastro",
    },
    {
      label: "Ticket médio",
      value: formatCurrency(averageValue),
      description: "Por compra",
    },
  ];

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 gap-4 sm:auto-rows-fr sm:grid-cols-2 sm:grid-rows-2 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl flex min-h-0 min-w-[180px] flex-col justify-center space-y-1 p-5 sm:h-full sm:min-h-[88px]"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#9ca3af]">
            {stat.label}
          </p>
          <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-xs text-[#9ca3af]">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  let formattedTxs: TransactionData[] = [];
  let balance = 0;
  let totalPurchases = 0;
  let totalSpent = 0;
  let averageValue = 0;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });
    balance = user?.balance || 0;

    const txs = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      include: {
        product: { select: { name: true } },
        stockItems: true,
      },
    });

    totalPurchases = txs.reduce((acc, tx) => acc + tx.quantity, 0);
    totalSpent = txs.reduce((acc, tx) => acc + tx.total, 0);
    averageValue = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

    formattedTxs = txs.map((tx) => {
      const parsedCards: any[] = [];
      let parsedLogin: any = undefined;
      let type: "card" | "login" = "card";

      for (const item of tx.stockItems) {
        if (item.content.includes("|")) {
          const parts = item.content.split("|");
          // Heuristic: If it has only 2 parts and an @, it's a login
          if (parts.length === 2 && parts[0].includes("@")) {
            type = "login";
            parsedLogin = { email: parts[0], password: parts[1] };
          } else {
            type = "card";
            parsedCards.push({
              number: parts[0] || "",
              cvv: parts[1] || "",
              expiry: parts[2] || "",
              name: parts[3] || "",
              bank: parts[4] || "",
              brand: parts[5] || "",
              level: parts[6] || "",
              type: parts[7] || "",
              country: parts[8] || "",
              bin: parts[9] || "",
              cpf: parts[10] || "",
            });
          }
        }
      }

      const isLoginProduct = tx.product?.name.toLowerCase().includes("login");
      if (isLoginProduct && !parsedLogin) type = "login";

      return {
        id: tx.id,
        type: type,
        cardName: type === "card" ? tx.product?.name || "Produto Removido" : undefined,
        loginName: type === "login" ? tx.product?.name || "Produto Removido" : undefined,
        quantity: tx.quantity,
        totalPrice: tx.total,
        purchaseDate: tx.date,
        status: tx.status,
        purchasedCards: type === "card" ? parsedCards : undefined,
        loginData: type === "login" ? parsedLogin : undefined,
      };
    });
  }

  return (
    <div className="max-w-[1200px] mx-auto h-full flex flex-col font-sans px-4 sm:px-0 pt-4">
      <SectionCards
        balance={balance}
        totalPurchases={totalPurchases}
        totalSpent={totalSpent}
        averageValue={averageValue}
      />
      <div className="flex-1 mt-2">
        <DashboardDataTable transactions={formattedTxs} />
      </div>
    </div>
  );
}
