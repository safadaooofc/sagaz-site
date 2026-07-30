import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LoginsClient } from "./LoginsClient";

export default async function BuyLoginsPage() {
  const session = await auth();
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  }) : null;

  // Busca produtos da categoria 'logins-nfa'
  let logins = await prisma.product.findMany({
    where: {
      category: { slug: { contains: "login" } }
    },
    orderBy: { price: 'desc' }
  });

  // Fallback caso não haja categorias configuradas: puxar todos os produtos 
  // que o nome contenha 'login' ou 'nfa'
  if (logins.length === 0) {
    logins = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "login", mode: "insensitive" } },
          { name: { contains: "nfa", mode: "insensitive" } }
        ]
      },
      orderBy: { price: 'desc' }
    });
  }

  // Fallback 2: Se ainda assim estiver vazio, retorna todos os produtos
  // apenas para não deixar a página vazia num ambiente de teste inicial
  if (logins.length === 0) {
    logins = await prisma.product.findMany({
      orderBy: { price: 'desc' }
    });
  }

  const formattedLogins = logins.map(l => ({
    id: l.id,
    name: l.name,
    price: l.price,
    stock: l.stock
  }));

  return (
    <LoginsClient logins={formattedLogins} balance={user?.balance || 0} />
  );
}
