import { auth } from "@/auth";
import { MinesClient } from "./MinesClient";
import { redirect } from "next/navigation";

export default async function AdminMinesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return <MinesClient />;
}
