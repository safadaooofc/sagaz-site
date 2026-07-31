"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Bomb, Users, RefreshCw, Package, LogIn, ShoppingCart, 
  Repeat, ShieldCheck, BarChart, Ticket, Gift, MessageSquare, ArrowDownToLine, 
  Headphones, Menu, X, PanelLeftClose, PanelLeftOpen 
} from "lucide-react";

const sidebarLinks = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, requiresAdmin: true },
  { title: "Produtos e Estoque", href: "/admin/products", icon: Package, requiresAdmin: true },
  { title: "Usuários e Cargos", href: "/admin/users", icon: Users, requiresAdmin: true },
  { title: "Finanças e Extrato", href: "/admin/finance", icon: BarChart, requiresAdmin: true },
  { title: "Cupons de Desconto", href: "/admin/coupons", icon: Ticket, requiresAdmin: true },
  { title: "Gift Cards", href: "/admin/gifts", icon: Gift, requiresAdmin: true },
  { title: "Avaliações", href: "/admin/reviews", icon: MessageSquare, requiresAdmin: true },
  { title: "Marketing e Drops", href: "/admin/marketing", icon: Bomb, requiresAdmin: true },
  { title: "Segurança", href: "/admin/security", icon: ShieldCheck, requiresAdmin: true },
  { title: "Configurações", href: "/admin/settings", icon: Settings, requiresAdmin: true },
];

export function AdminLayoutClient({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newVal));
  };

  const isSupportOnly = user?.isSupporter && !user?.isAdmin;
  const filteredLinks = sidebarLinks.filter(l => {
    if (isSupportOnly && l.requiresAdmin) return false;
    return true;
  });

  const isSupportRoute = pathname === "/admin/suporte";

  return (
    <div className={`flex flex-col font-sans bg-background text-foreground ${isSupportRoute ? "h-screen" : "min-h-screen"}`}>
      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            {!isCollapsed && <span className="font-bold text-lg text-primary truncate">Admin Panel</span>}
            <button onClick={toggleCollapse} className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors mx-auto">
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <nav className="space-y-1 px-2">
              {filteredLinks.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    title={isCollapsed ? link.title : undefined}
                    className={`flex items-center ${isCollapsed ? "justify-center px-0" : "px-3"} py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon size={18} className={!isCollapsed ? "mr-3" : ""} />
                    {!isCollapsed && <span>{link.title}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Overlay & Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="relative w-64 max-w-[80%] bg-card border-r border-border shadow-xl flex flex-col h-full animate-in slide-in-from-left-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-bold text-lg text-primary">Menu Admin</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-destructive">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                  {filteredLinks.map(link => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon size={18} className="mr-3" />
                        {link.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 flex flex-col bg-background ${!isSupportRoute ? "overflow-y-auto" : ""}`}>
          <div className="md:hidden p-4 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Menu size={20} /> <span className="font-medium text-sm">Menu</span>
            </button>
            <div className="font-semibold text-sm text-foreground">
              {filteredLinks.find(l => l.href === pathname)?.title || "Admin"}
            </div>
          </div>
          
          <div className={`${isSupportRoute ? "flex-1 overflow-hidden flex flex-col" : "p-6"}`}>
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
