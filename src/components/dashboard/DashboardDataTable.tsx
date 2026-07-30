"use client";

import { Search, Eye, ChevronLeft, ChevronRight, Copy, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

type PurchasedCard = {
  number?: string;
  cvv?: string;
  expiry?: string;
  name?: string;
  bank?: string;
  brand?: string;
  level?: string;
  type?: string;
  country?: string;
  bin?: string;
  cpf?: string;
};

type LoginData = {
  email?: string;
  password?: string;
};

export type TransactionData = {
  id: string;
  type: "card" | "login";
  cardName?: string;
  loginName?: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: Date;
  status: string;
  purchasedCards?: PurchasedCard[];
  loginData?: LoginData;
};

function PurchaseStatusBadge({ status }: { status: string }) {
  const label = status === "completed" || status === "COMPLETED" ? "Concluído" : status === "pending" || status === "PENDING" ? "Pendente" : "Cancelado";
  
  if (status === "completed" || status === "COMPLETED") {
    return <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium text-green-500">{label}</span>;
  }
  if (status === "pending" || status === "PENDING") {
    return <span className="inline-flex items-center rounded-full border border-[#333845] bg-[#1f2229] px-2.5 py-0.5 text-[10px] font-medium text-[#9ca3af]">{label}</span>;
  }
  return <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-medium text-red-500">{label}</span>;
}

const formatCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
const formatDate = (date: Date) => new Date(date).toLocaleDateString("pt-BR");

export function DashboardDataTable({ transactions }: { transactions: TransactionData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const name = t.cardName || t.loginName || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
  }, [transactions, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const PurchaseDetailsModal = ({ purchase }: { purchase: TransactionData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [cardIndex, setCardIndex] = useState(0);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const cards = purchase.purchasedCards || [];
    const currentCard = cards[cardIndex] || null;

    const handleFieldClick = async (val: string | undefined, fieldName: string) => {
      try {
        const text = val || "Não informado";
        await navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 1500);
      } catch (e) {
        console.error("Erro ao copiar", e);
      }
    };

    const handleAction = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const action = e.target.value;
      if (!action) return;
      e.target.value = ""; 

      let rawText = "";
      let jsonData = {};

      if (purchase.type === "card" && currentCard) {
        const { number, cvv, expiry, name, bank, brand, level, type, country, bin, cpf } = currentCard;
        rawText = `${number || "Não informado"}|${cvv || "Não informado"}|${expiry || "Não informado"}|${name || "Não informado"}|${bank || "Não informado"}|${brand || "Não informado"}|${level || "Não informado"}|${type || "Não informado"}|${country || "Não informado"}|${bin || "Não informado"}|${cpf || "Não informado"}`;
        jsonData = { numero: number, cvv, expiracao: expiry, nome: name, banco: bank, bandeira: brand, nivel: level, tipo: type, pais: country, bin, cpf, cartao: purchase.cardName, data: purchase.purchaseDate, quantidade: purchase.quantity, total: purchase.totalPrice };
      } else if (purchase.type === "login" && purchase.loginData) {
        rawText = `${purchase.loginData.email}|${purchase.loginData.password}`;
        jsonData = { email: purchase.loginData.email, senha: purchase.loginData.password, login: purchase.loginName, data: purchase.purchaseDate, quantidade: purchase.quantity, total: purchase.totalPrice };
      }

      if (action === "copy") {
        await navigator.clipboard.writeText(rawText);
        alert("Copiado para a área de transferência!");
      } else if (action === "download-txt") {
        let content = "";
        if (purchase.type === "card") {
          content = `=== DADOS DO CARTÃO ===\nCartão: ${purchase.cardName}\nNúmero: ${currentCard?.number}\nCVV: ${currentCard?.cvv}\nValidade: ${currentCard?.expiry}\nNome: ${currentCard?.name}\nBanco: ${currentCard?.bank}\nBandeira: ${currentCard?.brand}\nNível: ${currentCard?.level}\nTipo: ${currentCard?.type}\nPaís: ${currentCard?.country}\nBIN: ${currentCard?.bin}\nCPF: ${currentCard?.cpf}\nData da Compra: ${formatDate(purchase.purchaseDate)}\nQuantidade: ${purchase.quantity}\nTotal: ${formatCurrency(purchase.totalPrice)}\n\nFormato para cópia: ${rawText}`;
          downloadFile(content, `${(purchase.cardName || "cartao").replace(/\s+/g, "_")}.txt`, "text/plain");
        } else {
          content = `=== DADOS DO LOGIN ===\nLogin: ${purchase.loginName}\nEmail: ${purchase.loginData?.email}\nSenha: ${purchase.loginData?.password}\nData da Compra: ${formatDate(purchase.purchaseDate)}\nQuantidade: ${purchase.quantity}\nTotal: ${formatCurrency(purchase.totalPrice)}\n\nFormato para cópia: ${rawText}`;
          downloadFile(content, `${(purchase.loginName || "login").replace(/\s+/g, "_")}.txt`, "text/plain");
        }
      } else if (action === "download-json") {
        downloadFile(JSON.stringify(jsonData, null, 2), `${(purchase.type === "card" ? purchase.cardName : purchase.loginName)?.replace(/\s+/g, "_")}.json`, "application/json");
      }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <>
        <button onClick={() => setIsOpen(true)} className="text-[#9ca3af] hover:text-white transition-colors" aria-label="Ver detalhes da compra">
          <Eye size={16} />
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1115] border border-[#1f2229] rounded-lg max-w-[500px] w-full max-h-[85vh] overflow-y-auto shadow-xl p-6 relative">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-[#9ca3af] hover:text-white">
                <X size={16} />
              </button>
              
              <div className="mb-4 pr-6">
                <h2 className="text-lg font-bold text-white mb-1">{purchase.type === "login" ? "Detalhes do Login" : "Detalhes do Cartão"}</h2>
                <p className="text-sm text-[#9ca3af]">
                  {purchase.type === "login" ? `Informações completas do login: ${purchase.loginName}` : `Informações completas do cartão: ${purchase.cardName}`}
                </p>
                {purchase.type === "card" && cards.length > 1 && (
                  <span className="block text-sm text-[#9ca3af] mt-1">Cartão {cardIndex + 1} de {cards.length}</span>
                )}
              </div>

              {purchase.type === "card" && cards.length > 1 && (
                <div className="flex items-center justify-center gap-2 py-2 border-b border-[#1f2229] mb-4">
                  <button disabled={cardIndex === 0} onClick={() => setCardIndex(i => Math.max(0, i - 1))} className="text-xs px-3 py-1.5 border border-[#1f2229] rounded hover:bg-[#181a20] disabled:opacity-50">Anterior</button>
                  <span className="text-sm text-[#9ca3af] px-2">{cardIndex + 1} / {cards.length}</span>
                  <button disabled={cardIndex === cards.length - 1} onClick={() => setCardIndex(i => Math.min(cards.length - 1, i + 1))} className="text-xs px-3 py-1.5 border border-[#1f2229] rounded hover:bg-[#181a20] disabled:opacity-50">Próximo</button>
                </div>
              )}

              {purchase.type === "card" && currentCard && (
                <div className="grid gap-3 py-4">
                  {[
                    { label: "Nome", value: currentCard.name, key: "nome" },
                    { label: "CPF", value: currentCard.cpf, key: "cpf" },
                    { label: "Número", value: currentCard.number, key: "numero" },
                    { label: "Validade", value: currentCard.expiry, key: "validade" },
                    { label: "CVV", value: currentCard.cvv, key: "cvv" },
                    { label: "Banco", value: currentCard.bank, key: "banco" },
                    { label: "Bandeira", value: currentCard.brand, key: "bandeira" },
                    { label: "Nível", value: currentCard.level, key: "nivel" },
                    { label: "Tipo", value: currentCard.type, key: "tipo" },
                    { label: "País", value: currentCard.country, key: "pais" },
                    { label: "BIN", value: currentCard.bin, key: "bin" },
                  ].map((field) => (
                    <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium text-[#9ca3af]">{field.label}</label>
                      <div 
                        className="col-span-3 font-mono text-sm bg-[#181a20] border border-[#1f2229] p-2 rounded cursor-pointer hover:bg-[#1f2229] transition-colors relative group"
                        onClick={() => handleFieldClick(field.value, field.key)}
                        title="Clique para copiar"
                      >
                        {field.value || "Não informado"}
                        {copiedField === field.key && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">Copiado!</div>
                        )}
                        <Copy size={12} className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {purchase.type === "login" && purchase.loginData && (
                <div className="grid gap-3 py-4">
                  {[
                    { label: "Email", value: purchase.loginData.email, key: "email" },
                    { label: "Senha", value: purchase.loginData.password, key: "senha" }
                  ].map((field) => (
                    <div key={field.key} className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm font-medium text-[#9ca3af]">{field.label}</label>
                      <div 
                        className="col-span-3 font-mono text-sm bg-[#181a20] border border-[#1f2229] p-2 rounded cursor-pointer hover:bg-[#1f2229] transition-colors relative group"
                        onClick={() => handleFieldClick(field.value, field.key)}
                        title="Clique para copiar"
                      >
                        {field.value || "Não informado"}
                        {copiedField === field.key && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">Copiado!</div>
                        )}
                        <Copy size={12} className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {((purchase.type === "card" && currentCard) || (purchase.type === "login" && purchase.loginData)) && (
                <div className="pt-2 border-t border-[#1f2229] mt-2">
                  <div className="flex items-center gap-2">
                    <select onChange={handleAction} className="w-full bg-[#181a20] border border-[#1f2229] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#eab308]">
                      <option value="">Exportar dados...</option>
                      <option value="copy">Copiar para Clipboard</option>
                      <option value="download-txt">Baixar TXT</option>
                      <option value="download-json">Baixar JSON</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const MobileCard = ({ purchase }: { purchase: TransactionData }) => (
    <div className="border-b border-[#1f2229]/50 px-4 py-4 last:border-0">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-medium text-white">{purchase.type === "login" ? purchase.loginName : purchase.cardName}</h3>
        <PurchaseDetailsModal purchase={purchase} />
      </div>
      <div className="space-y-2 text-xs text-[#9ca3af]">
        <div className="flex justify-between">
          <span>Data</span>
          <span>{formatDate(purchase.purchaseDate)}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantidade</span>
          <span>{purchase.quantity}</span>
        </div>
        <div className="flex justify-between font-medium text-white">
          <span>Total</span>
          <span>{formatCurrency(purchase.totalPrice)}</span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-[#1f2229]/50">
          <span>Status</span>
          <PurchaseStatusBadge status={purchase.status} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#181a20] border border-[#1f2229] rounded-lg h-full flex flex-col font-sans overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#1f2229]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input 
            type="text" 
            placeholder="Buscar compras..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-sm bg-[#0f1115] border border-[#1f2229] rounded-md pl-10 pr-4 py-2 text-sm text-white placeholder-[#4b5563] focus:border-[#eab308] focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isMobile ? (
          <div className="flex flex-col">
            {paginatedData.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#4b5563]">Nenhuma compra encontrada</div>
            ) : (
              paginatedData.map((tx) => <MobileCard key={tx.id} purchase={tx} />)
            )}
          </div>
        ) : (
          <table className="w-full text-left text-[13px] text-[#9ca3af]">
            <thead>
              <tr className="border-b border-[#1f2229] bg-[#181a20]">
                <th className="font-medium py-3 px-4">Item</th>
                <th className="font-medium py-3 px-4">Data</th>
                <th className="font-medium py-3 px-4 text-center">Quantidade</th>
                <th className="font-medium py-3 px-4 text-right">Total</th>
                <th className="font-medium py-3 px-4 text-center">Status</th>
                <th className="font-medium py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#4b5563]">Nenhuma compra encontrada</td>
                </tr>
              ) : (
                paginatedData.map(tx => (
                  <tr key={tx.id} className="border-b border-[#1f2229] last:border-0 hover:bg-[#1f2229]/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{tx.type === "login" ? tx.loginName : tx.cardName}</td>
                    <td className="px-4 py-3">{formatDate(tx.purchaseDate)}</td>
                    <td className="px-4 py-3 text-center">{tx.quantity}</td>
                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(tx.totalPrice)}</td>
                    <td className="px-4 py-3 text-center">
                      <PurchaseStatusBadge status={tx.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PurchaseDetailsModal purchase={tx} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-[#1f2229] flex items-center justify-between text-sm text-[#9ca3af]">
          <span>Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, filteredData.length)} de {filteredData.length}</span>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 border border-[#1f2229] rounded hover:bg-[#262933] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1 border border-[#1f2229] rounded hover:bg-[#262933] disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
