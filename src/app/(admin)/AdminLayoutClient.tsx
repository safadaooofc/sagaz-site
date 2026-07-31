"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Bomb, Users, RefreshCw, Package, LogIn, ShoppingCart, 
  Repeat, ShieldCheck, BarChart, Ticket, Gift, MessageSquare, ArrowDownToLine, 
  Headphones, Menu, X, PanelLeftClose, PanelLeftOpen, Settings, ChevronDown, ChevronRight, LineChart
} from "lucide-react";

const sidebarGroups = [
  {
    title: "Visão Geral",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard, requiresAdmin: true },
    ]
  },
  {
    title: "Produtos & Ofertas",
    items: [
      { title: "Estoque e Produtos", href: "/admin/products", icon: Package, requiresAdmin: true },
      { title: "Cupons de Desconto", href: "/admin/coupons", icon: Ticket, requiresAdmin: true },
      { title: "Gift Cards", href: "/admin/gifts", icon: Gift, requiresAdmin: true },
    ]
  },
  {
    title: "Vendas & Finanças",
    items: [
      { title: "Recargas (Finanças)", href: "/admin/finance", icon: RefreshCw, requiresAdmin: true },
      { title: "Compras", href: "/admin/purchases", icon: ShoppingCart, requiresAdmin: true },
      { title: "Trocas", href: "/admin/exchanges", icon: Repeat, requiresAdmin: true },
      { title: "Saques", href: "/admin/saques", icon: ArrowDownToLine, requiresAdmin: true },
    ]
  },
  {
    title: "ANALYTICS & INTELIGÊNCIA",
    items: [
      { title: "Dashboard Geral", href: "/admin/analytics", icon: LineChart, requiresAdmin: false },
    ]
  },
  {
    title: "Marketing & Engajamento",
    items: [
      { title: "Mines", href: "/admin/mines", icon: Bomb, requiresAdmin: true },
      { title: "Drops", href: "/admin/marketing", icon: Gift, requiresAdmin: false },
    ]
  },
  {
    title: "Sistema & Atendimento",
    items: [
      { title: "Usuários", href: "/admin/users", icon: Users, requiresAdmin: true },
      { title: "Logins", href: "/admin/logins", icon: LogIn, requiresAdmin: true },
      { title: "Avaliações", href: "/admin/reviews", icon: MessageSquare, requiresAdmin: false },
      { title: "Suporte", href: "/admin/suporte", icon: Headphones, requiresAdmin: false },
      { title: "Segurança", href: "/admin/security", icon: ShieldCheck, requiresAdmin: true },
      { title: "Configurações", href: "/admin/settings", icon: Settings, requiresAdmin: true },
    ]
  }
];

export function AdminLayoutClient({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
    
    // Auto-open group that contains active link
    const currentGroup = sidebarGroups.find(g => g.items.some(i => i.href === pathname));
    if (currentGroup) {
      setOpenGroups(prev => ({ ...prev, [currentGroup.title]: true }));
    }
  }, [pathname]);

  const toggleCollapse = () => {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newVal));
  };

  const toggleGroup = (title: string) => {
    if (isCollapsed) setIsCollapsed(false); // uncollapse if clicking group header while collapsed
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isSupportOnly = user?.isSupporter && !user?.isAdmin;
  
  // Filter groups based on permissions
  const filteredGroups = sidebarGroups.map(group => ({
    ...group,
    items: group.items.filter(l => !(isSupportOnly && l.requiresAdmin))
  })).filter(group => group.items.length > 0);

  const isSupportRoute = pathname === "/admin/suporte";

  // Flat list of links for finding active link title
  const allFilteredLinks = filteredGroups.flatMap(g => g.items);

  const renderNavItems = () => {
    return filteredGroups.map((group, idx) => {
      const isOpen = openGroups[group.title] || false;
      const isFirst = idx === 0;

      return (
        <div key={group.title} className={!isFirst ? "mt-4" : ""}>
          {!isCollapsed ? (
            <button 
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <span>{group.title}</span>
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center border-b border-border mb-2 pb-1">
              {group.title.substring(0, 3)}
            </div>
          )}
          
          {(isOpen || isCollapsed) && (
            <div className="mt-1 space-y-1">
              {group.items.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    title={isCollapsed ? link.title : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center ${isCollapsed ? "justify-center px-0" : "px-3"} py-2 rounded-lg text-sm font-medium transition-colors ${
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
            </div>
          )}
        </div>
      );
    });
  };

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
          
          <div className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
            {renderNavItems()}
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
              <div className="flex-1 overflow-y-auto py-4 px-3">
                {renderNavItems()}
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
              {allFilteredLinks.find(l => l.href === pathname)?.title || "Admin"}
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
