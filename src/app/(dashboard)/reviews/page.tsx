import { prisma } from "@/lib/prisma";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const dbReviews = await prisma.review.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  const reviews = dbReviews.map((r) => ({
    id: r.id,
    author: r.user?.name || "Usuário",
    initial: (r.user?.name || "U")[0].toUpperCase(),
    date: r.createdAt.toLocaleDateString("pt-BR", { day: 'numeric', month: 'short', year: 'numeric' }),
    stars: r.rating,
    title: r.comment?.split("\n\n")[0]?.replace(/\*\*/g, "") || "Avaliação",
    content: r.comment?.split("\n\n")[1] || r.comment || "",
    helpful: 0,
    images: 0
  }));

  // Append some mock reviews for looks if db is empty or just merge them
  const initialReviews = [
    { id: 1, author: "Rlam Lucas", initial: "R", date: "31 de mar, de 2026", stars: 5, title: "mto bom", content: "mt bom, 10/10, melhores q tem", helpful: 0, images: 0 },
    { id: 2, author: "Vitor Hugo Scar face", initial: "V", date: "21 de mar, de 2026", stars: 5, title: "os meno e bom", content: "os cara sabe oque faz memo, 10/10 na mxm", helpful: 0, images: 0 },
    { id: 3, author: "Henrique Campos Lourenço", initial: "H", date: "11 de mar, de 2026", stars: 4, title: "500 facil 10", content: "Teclado ajazz shopee + kit upgrade ryzen 7 5700x e b550m aorus", helpful: 2, images: 3 },
    { id: 4, author: "João Pedro Cardozo Lima", initial: "J", date: "3 de mar, de 2026", stars: 5, title: "Loja 10/10", content: "Tudo funcionando certinho sem erro, posso comprar Novamente!", helpful: 0, images: 0 },
  ];

  return <ReviewsClient serverReviews={[...reviews, ...initialReviews]} />;
}
