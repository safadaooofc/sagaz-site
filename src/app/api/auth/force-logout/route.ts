import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  // Clear the NextAuth JWT cookies
  // NextAuth default cookie names
  const cookieStore = await cookies();
  cookieStore.delete("authjs.session-token");
  cookieStore.delete("__Secure-authjs.session-token");
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  
  return redirect("/login");
}
