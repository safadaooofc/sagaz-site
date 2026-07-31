import { auth } from "@/auth";
import { MinesClient } from "./MinesClient";
import { redirect } from "next/navigation";
import { getMinesConfig } from "./actions";

export default async function AdminMinesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const initialConfig = await getMinesConfig();

  return <MinesClient initialConfig={initialConfig} />;
}
