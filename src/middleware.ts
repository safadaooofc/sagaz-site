import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role || "USER";
  const { pathname } = req.nextUrl;

  // Define as rotas públicas que não precisam de login
  const publicRoutes = ["/", "/login", "/register", "/faq"];
  
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");
  const isAdminRoute = pathname.startsWith("/admin");

  // Se não estiver logado e não for uma rota pública, manda pro /login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  // Se tentar acessar o painel admin sem ser ADMIN ou MODERATOR, volta pro dashboard
  if (isAdminRoute && userRole !== "ADMIN" && userRole !== "SUPERADMIN" && userRole !== "MODERATOR") {
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(dashboardUrl);
  }
})

// O matcher define em quais rotas esse middleware vai rodar (exclui estáticos e imagens)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
