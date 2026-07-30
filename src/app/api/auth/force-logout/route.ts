import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  // Clear the NextAuth JWT cookies
  // NextAuth default cookie names
  cookies().delete("authjs.session-token");
  cookies().delete("__Secure-authjs.session-token");
  cookies().delete("next-auth.session-token");
  cookies().delete("__Secure-next-auth.session-token");
  
  return redirect("/login");
}
