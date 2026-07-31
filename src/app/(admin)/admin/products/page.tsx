import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, _count: { select: { stockItems: { where: { isDelivered: false } } } } },
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const transactions = await prisma.transaction.findMany({
    where: { status: 'COMPLETED' },
    select: { productId: true, quantity: true, total: true, date: true }
  });

  // Calculate stats
  const productStats = products.map(p => {
    const pTrans = transactions.filter(t => t.productId === p.id);
    const soldCount = pTrans.reduce((acc, t) => acc + t.quantity, 0);
    const revenue = pTrans.reduce((acc, t) => acc + t.total, 0);
    return { ...p, soldCount, revenue };
  });

  return <ProductsClient products={productStats} categories={categories} transactions={transactions} />;
}
