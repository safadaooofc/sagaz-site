import { auth } from "@/auth";
import { AnalyticsClient } from "./AnalyticsClient";
import { redirect } from "next/navigation";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return <AnalyticsClient />;
}
