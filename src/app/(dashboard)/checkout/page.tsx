import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  });

  const productId = searchParams.loginId || searchParams.cardId || searchParams.productId;
  const quantity = parseInt(searchParams.quantity as string) || 1;
  const type = searchParams.type as string;

  if (!productId || typeof productId !== 'string') {
    redirect("/dashboard");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      stockItems: {
        where: { isDelivered: false },
        select: { id: true }
      }
    }
  });

  if (!product) {
    redirect("/dashboard");
  }

  return <CheckoutClient product={product} quantity={quantity} type={type} balance={user?.balance || 0} />;
}
