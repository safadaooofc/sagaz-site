"use client";

import { ShoppingCart, Shield, Search, ChevronDown, Calendar, CreditCard, Building2, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";
import { getAvailableCards, buyCard } from "./actions";

import { toast } from "sonner";

function normalizeBrandKey(e: string) {
  return (e || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "");
}

function resolveBrandAsset(e: string) {
  const t = normalizeBrandKey(e);
  if (t.includes("visa")) return { src: "/brands/visa.svg", monochromeOnDark: true };
  if (t.includes("master") || t.includes("maestro")) return { src: "/brands/mastercard.svg" };
  if (t.includes("amex") || t.includes("american")) return { src: "/brands/amex.svg", monochromeOnDark: true };
  if (t.includes("elo")) return { src: "/brands/elo.svg" };
  if (t.includes("hiper")) return { src: "/brands/hipercard.svg" };
  return null;
}

function CardBrandLogo({ brand, className }: { brand: string, className?: string }) {
  const asset = resolveBrandAsset(brand);
  const title = (brand || "").trim() || "Bandeira";
  
  if (asset) {
    return (
      <span className={`inline-flex h-9 max-h-9 min-w-[3.25rem] shrink-0 items-center justify-center rounded-md bg-transparent px-2 py-1 ${className}`} title={title}>
        <Image 
          src={asset.src} 
          alt={title} 
          width={72} 
          height={36} 
          className={`max-h-7 w-auto max-w-[4.5rem] object-contain object-center ${asset.monochromeOnDark ? "brightness-0 invert opacity-90" : ""}`} 
          unoptimized
        />
        <span className="sr-only">{title}</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-md border border-[#333845] bg-[#1f2229] px-2 text-white font-bold text-xs ${className}`} title={title}>
      {brand}
    </span>
  );
}

const normalizeText = (e: string) => (e || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const normalizedLevel = (e: string) => (e || "Indefinido").toLowerCase();
const normalizedModality = (e: string) => {
  const t = (e || "").toLowerCase();
  return t.includes("credito") ? "crédito" : (t.includes("debito") || t.includes("debit") ? "débito" : e || "modalidade indefinida");
};
const displayModalityShort = (e: any) => {
  const t = (e.modality || "").toUpperCase();
  if (t.includes("CREDIT") || t.includes("CRÉDITO") || normalizedModality(e.modality).includes("créd")) return "CREDIT";
  if (t.includes("DEBIT") || t.includes("DÉBITO") || normalizedModality(e.modality).includes("déb")) return "DEBIT";
  return normalizedModality(e.modality).toUpperCase().slice(0, 10);
};

function formatBinMarciaStyle(e: string) {
  const t = (e || "").replace(/\D/g, "").padEnd(6, "•").slice(0, 6);
  const r = t.slice(0, 4).split("").join(" ");
  const a = t.slice(4, 6).split("").join(" ");
  return `${r}   ${a}   • • • •   • • • •`;
}

function ConfirmDialogContent({ children, isOpen, onClose }: { children: React.ReactNode, isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-[#333845] bg-[#0f1115] text-white shadow-lg p-6 animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
}

export default function BuyCardsClient() {
  const [cards, setCards] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [levelFilter, setLevelFilter] = useState("all");
  const [modalityFilter, setModalityFilter] = useState("all");
  
  const [levels, setLevels] = useState<string[]>([]);
  const [modalities, setModalities] = useState<string[]>([]);
  
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isModalityOpen, setIsModalityOpen] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  
  const [successOpen, setSuccessOpen] = useState(false);
  const [verificationState, setVerificationState] = useState<"idle" | "verifying" | "success">("idle");
  const [purchasedCard, setPurchasedCard] = useState<any>(null);
  
  const verificationTimer = useRef<number | null>(null);

  function resetVerificationState() {
    if (verificationTimer.current) {
      window.clearTimeout(verificationTimer.current);
      verificationTimer.current = null;
    }
    setVerificationState("idle");
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getAvailableCards();
      if (res.success) {
        setCards(res.data);
        setBalance(res.balance || 0);
        
        const lvls = new Set<string>();
        const mods = new Set<string>();
        res.data.forEach(c => {
          lvls.add(normalizedLevel(c.level));
          mods.add(normalizedModality(c.modality));
        });
        setLevels(Array.from(lvls).sort());
        setModalities(Array.from(mods).sort());
      }
      setLoading(false);
    }
    loadData();
    return () => resetVerificationState();
  }, []);



  const startVerificationDelay = () => {
    if (verificationTimer.current) window.clearTimeout(verificationTimer.current);
    verificationTimer.current = window.setTimeout(() => {
      setVerificationState("success");
      verificationTimer.current = null;
    }, 1000 * (Math.floor(21 * Math.random()) + 10)); // 10 to 30 seconds
  };

  const handleBuyCard = (card: any) => {
    setSelectedCard(card);
    setConfirmOpen(true);
  };

  const executePurchase = async (card: any) => {
    setPurchasingId(card.id);
    
    const res = await buyCard(card.cardId, 1, undefined, card.id);
    
    if (!res.success) {
      toast.error((res as any).message || "Tente novamente.");
      setPurchasingId(null);
      setConfirmOpen(false);
      setSelectedCard(null);
      return;
    }
    
    setCards(prev => prev.filter(c => c.id !== card.id));
    setBalance(prev => Math.max(0, prev - card.price));
    
    setVerificationState("verifying");
    setSuccessOpen(true);
    startVerificationDelay();
    setPurchasedCard(card);
    
    setPurchasingId(null);
    setConfirmOpen(false);
    setSelectedCard(null);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const levelOptions = [{ value: "all", label: "Todos os níveis" }, ...levels.map(l => ({ value: l, label: l }))];
  const modalityOptions = [{ value: "all", label: "Todas modalidades" }, ...modalities.map(m => ({ value: m, label: m }))];

  const currentLevelLabel = levelOptions.find(o => o.value === levelFilter)?.label || "Todos os níveis";
  const currentModalityLabel = modalityOptions.find(o => o.value === modalityFilter)?.label || "Todas modalidades";

  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      const search = normalizeText(searchTerm);
      const matchesSearch = normalizeText(c.bank).includes(search) || 
                            normalizeText(c.level).includes(search) || 
                            normalizeText(c.numberPrefix).includes(search) || 
                            normalizeText(c.brand || "").includes(search);
      
      const matchesLevel = levelFilter === "all" || normalizeText(normalizedLevel(c.level)) === normalizeText(levelFilter);
      const matchesModality = modalityFilter === "all" || normalizeText(normalizedModality(c.modality)) === normalizeText(modalityFilter);
      
      return matchesSearch && matchesLevel && matchesModality;
    });
  }, [cards, searchTerm, levelFilter, modalityFilter]);

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Saldo disponível</p>
            <span className="text-[#9ca3af] font-black">$</span>
          </div>
          <div className="font-display text-2xl font-bold text-white">
            {loading ? <div className="h-8 w-28 bg-[#1f2229] animate-pulse rounded-md"></div> : formatCurrency(balance)}
          </div>
          <p className="text-xs text-[#9ca3af]">Atualizado em tempo real após cada compra</p>
        </div>

        <div className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Cartões disponíveis</p>
            <ShoppingCart size={16} className="text-[#9ca3af]" />
          </div>
          <div className="font-display text-2xl font-bold text-white">
            {loading ? <div className="h-8 w-16 bg-[#1f2229] animate-pulse rounded-md"></div> : cards.length}
          </div>
          <p className="text-xs text-[#9ca3af]">Reservamos cada cartão exclusivamente para você</p>
        </div>

        <div className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl p-5 space-y-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Segurança reforçada</p>
            <Shield size={16} className="text-[#9ca3af]" />
          </div>
          <p className="text-xs leading-relaxed text-[#9ca3af]">
            Exibimos apenas informações essenciais: bin, prévia da validade, nível e banco emissor. Os dados completos ficam disponíveis imediatamente após a compra.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por banco, nível, BIN..."
            className="w-full rounded-lg border border-[#333845] bg-[#1f2229] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#eab308]"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1 sm:flex-none">
            <button 
              type="button" 
              onClick={() => { setIsLevelOpen(!isLevelOpen); setIsModalityOpen(false); }}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#333845] bg-[#1f2229] px-4 py-2.5 text-sm text-white transition-colors hover:border-[#9ca3af] sm:min-w-[160px]"
            >
              <span className="truncate">{currentLevelLabel}</span>
              <ChevronDown size={14} className="flex-shrink-0 text-[#9ca3af]" />
            </button>
            {isLevelOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#333845] bg-[#0f1115] shadow-lg">
                {levelOptions.map(o => (
                  <button 
                    key={o.value} 
                    type="button"
                    onClick={() => { setLevelFilter(o.value); setIsLevelOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#1f2229] ${levelFilter === o.value ? "font-medium text-[#eab308]" : "text-white"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative flex-1 sm:flex-none">
            <button 
              type="button" 
              onClick={() => { setIsModalityOpen(!isModalityOpen); setIsLevelOpen(false); }}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#333845] bg-[#1f2229] px-4 py-2.5 text-sm text-white transition-colors hover:border-[#9ca3af] sm:min-w-[180px]"
            >
              <span className="truncate">{currentModalityLabel}</span>
              <ChevronDown size={14} className="flex-shrink-0 text-[#9ca3af]" />
            </button>
            {isModalityOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#333845] bg-[#0f1115] shadow-lg">
                {modalityOptions.map(o => (
                  <button 
                    key={o.value} 
                    type="button"
                    onClick={() => { setModalityFilter(o.value); setIsModalityOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#1f2229] ${modalityFilter === o.value ? "font-medium text-[#eab308]" : "text-white"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Cartões disponíveis</h2>
          <p className="text-sm text-[#9ca3af]">Cada compra entrega um cartão único.</p>
        </div>
        {!loading && (
          <span className="text-xs font-medium text-[#eab308]">
            {filteredCards.length} Cartões Listados • {cards.length} No Total
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl space-y-4 p-5 animate-pulse">
              <div className="h-12 w-full bg-[#1f2229] rounded"></div>
              <div className="h-16 w-full bg-[#1f2229] rounded"></div>
              <div className="h-10 w-full bg-[#1f2229] rounded"></div>
            </div>
          ))
        ) : filteredCards.length === 0 ? (
          <div className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl col-span-full p-8 text-center">
            <h3 className="text-lg font-semibold text-white">Nenhum cartão encontrado</h3>
            <p className="text-sm text-[#9ca3af]">Ajuste os filtros ou tente novamente mais tarde para ver novos cartões.</p>
          </div>
        ) : (
          filteredCards.map(c => {
            const insufficientBalance = balance < c.price;
            const isPurchasingThis = purchasingId === c.id;
            
            return (
              <div key={c.id} className="bg-[#181a20]/80 backdrop-blur-md border border-[#1f2229] rounded-xl space-y-4 p-5 hover:border-[#333845] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af]">BIN</p>
                    <p className="mt-0.5 font-mono text-sm font-bold tracking-widest text-white">
                      {formatBinMarciaStyle(c.numberPrefix || "")}
                    </p>
                  </div>
                  <CardBrandLogo brand={c.brand || ""} className="shrink-0" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                    <Calendar size={12} />
                    <span>Validade</span>
                    <span className="font-medium text-white">{c.expiryPreview}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                    <CreditCard size={12} />
                    <span className="font-medium capitalize text-white">{normalizedLevel(c.level)}</span>
                    <span>•</span>
                    <span>{displayModalityShort(c)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                    <Building2 size={12} />
                    <span className="truncate capitalize">{(c.bank?.toLowerCase()) || "Banco não informado"}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-[#1f2229] pt-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#9ca3af]">Valor</p>
                    <p className="font-display text-lg font-bold text-white">{formatCurrency(c.price)}</p>
                  </div>
                  
                  <button 
                    type="button" 
                    disabled={insufficientBalance || isPurchasingThis}
                    onClick={() => handleBuyCard(c)}
                    className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${insufficientBalance || isPurchasingThis ? 'border-[#333845] bg-[#1f2229] text-[#9ca3af] cursor-not-allowed opacity-50' : 'border-[#333845] bg-[#1f2229] text-white hover:border-[#eab308] hover:text-[#eab308]'}`}
                  >
                    {isPurchasingThis ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                    {isPurchasingThis ? "Processando..." : insufficientBalance ? "Saldo insuficiente" : "Comprar"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialogContent isOpen={confirmOpen} onClose={() => { if (!purchasingId) setConfirmOpen(false); }}>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Confirmar compra</h2>
          <p className="text-sm text-[#9ca3af] mt-2">
            {selectedCard ? `Você está prestes a comprar o cartão ${selectedCard.numberPrefix}•••• com nível ${normalizedLevel(selectedCard.level)} por ${formatCurrency(selectedCard.price)}. Ao confirmar, exibiremos todos os dados completos do cartão — eles ficarão disponíveis imediatamente na página principal.` : "Tem certeza que deseja continuar com esta compra?"}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-[#333845] bg-transparent hover:bg-[#1f2229] text-white h-10 py-2 px-4"
            onClick={() => setConfirmOpen(false)}
          >
            Cancelar
          </button>
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-[#eab308] text-[#0f1115] hover:bg-[#eab308]/90 h-10 py-2 px-4"
            onClick={() => selectedCard && executePurchase(selectedCard)}
            disabled={purchasingId === selectedCard?.id}
          >
            {purchasingId === selectedCard?.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</> : "Confirmar compra"}
          </button>
        </div>
      </ConfirmDialogContent>

      <ConfirmDialogContent isOpen={successOpen} onClose={() => { if (verificationState === "success") { setSuccessOpen(false); resetVerificationState(); }}}>
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {verificationState === "success" ? "Compra concluída!" : "Realizando verificações de segurança"}
          </h2>
          <p className="text-sm text-[#9ca3af] mt-2">
            {verificationState === "success" 
              ? (purchasedCard ? `Seu cartão ${purchasedCard.numberPrefix}•••• no nível ${normalizedLevel(purchasedCard.level)} foi comprado com sucesso. Você pode acessar todos os dados completos agora mesmo na página principal.` : "Compra finalizada com sucesso. Acesse seus dados completos na página principal.") 
              : "Estamos validando os dados diretamente com nossos provedores para garantir que tudo esteja perfeito antes de liberar o cartão. Esse processo costuma levar alguns instantes."}
          </p>
        </div>
        
        {verificationState === "verifying" && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#1f2229] border border-[#333845]">
              <ShieldCheck className="h-8 w-8 text-[#eab308] animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#eab308] border-r-[#eab308] animate-spin opacity-80" />
            </div>
            <p className="text-sm font-medium text-white">Validando dados do cartão...</p>
          </div>
        )}
        
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-4">
          {verificationState === "success" ? (
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-[#eab308] text-[#0f1115] hover:bg-[#eab308]/90 h-10 py-2 px-4 w-full sm:w-auto"
              onClick={() => { setSuccessOpen(false); resetVerificationState(); window.location.href = "/dashboard"; }}
            >
              Ir para o Dashboard
            </button>
          ) : (
            <div className="h-10 w-full" />
          )}
        </div>
      </ConfirmDialogContent>
    </div>
  );
}
