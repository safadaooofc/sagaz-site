"use client";

import { MessageSquare, ShieldAlert, ShoppingBag, Store, Info, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function Accordion({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#181a20] border border-[#1f2229] rounded-lg mb-3 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center font-bold text-[14px] text-white p-5 hover:bg-[#1f2229] transition-colors"
      >
        {title}
        <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={18} className="text-[#6b7280]" />
        </span>
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="text-[13px] text-[#9ca3af] p-5 pt-0 leading-relaxed border-t border-[#1f2229] mt-2 bg-[#1a1c23]">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqContent({ isPublic = false }: { isPublic?: boolean }) {
  const faq1 = [
    { title: "O que são M1X?", content: "Cartões de níveis diversos de Standard até Platinum. Material de alta qualidade." },
    { title: "O que são LOGS?", content: "Contas aquecidas e antigas com histórico de compras." },
    { title: "O que é Aprovação?", content: "Compras aprovadas usando o material da plataforma." },
    { title: "Quais sites vocês recomendam?", content: "Shopee, AliExpress, Mercado Livre, Amazon, Kabum, Magalu." },
    { title: "O que devo evitar?", content: "Evitar IP queimado, recomendamos fortemente o uso de 4G." },
    { title: "Posso colocar para receber em casa?", content: "SIM! É totalmente seguro colocar o próprio endereço, pois o material é virgem." },
  ];

  const faq2 = [
    { title: "O que é LIVE/DIE?", content: "LIVE = Funcional / DIE = Ruim/Morto." },
    { title: "O que é VBV?", content: "Verified by Visa - É uma etapa de segurança do banco, não significa necessariamente que o cartão está ruim." },
    { title: "Onde aprovar / Segurança", content: "Sites pequenos têm mais chance de aprovação. Sites grandes exigem IP limpo e um login com bom histórico." },
    { title: "Dicas rápidas", content: "Sempre usar rede 4G limpa e ter um bom login aquecido antes de tentar a aprovação." },
  ];

  const sites = [
    { cat: "E-commerce Geral", list: "Americanas, Mercado Livre, Shopee, AliExpress", icon: ShoppingBag },
    { cat: "Alimentação & Bebidas", list: "Swift, iFood, Wine", icon: Store },
    { cat: "Farmácias & Saúde", list: "Pague Menos, Droga Raia, Drogaria São Paulo, DrogaSil", icon: Info },
    { cat: "Pets & Casa", list: "Cobasi", icon: Store },
    { cat: "Beleza & Cuidados", list: "GlamBox", icon: Store },
    { cat: "Tecnologia & Eletrônicos", list: "Samsung, Kabum", icon: Store },
  ];

  return (
    <div className={`font-sans max-w-[900px] mx-auto pb-12 ${isPublic ? 'pt-8' : ''}`}>
      {isPublic && (
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#1f2229]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#eab308] rounded flex items-center justify-center font-black text-2xl text-black">K</div>
            <span className="font-black text-xl text-white tracking-tight">KNIGHT</span>
          </div>
          <Link href="/login" className="bg-[#eab308] text-[#0f1115] font-bold text-[13px] px-6 py-2.5 rounded-lg">
            Entrar
          </Link>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dúvidas e termos</h1>
        <p className="text-sm text-[#9ca3af]">Perguntas frequentes, política de trocas e termos de uso em um só lugar</p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#eab308] rounded-sm"></span> Perguntas Frequentes
        </h2>
        <div>
          {faq1.map((item, i) => (
            <Accordion key={i} title={item.title} content={item.content} />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#3b82f6] rounded-sm"></span> Dúvidas Técnicas
        </h2>
        <div>
          {faq2.map((item, i) => (
            <Accordion key={i} title={item.title} content={item.content} />
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#22c55e] rounded-sm"></span> Sites Recomendados para Aprovar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sites.map((site, i) => {
            const Icon = site.icon;
            return (
              <div key={i} className="bg-[#181a20] border border-[#1f2229] rounded-lg p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#1f2229] border border-[#2c303a] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#eab308]" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-white mb-1">{site.cat}</h4>
                  <p className="text-[12px] text-[#9ca3af] leading-relaxed">{site.list}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-[#ef4444] rounded-sm"></span> Termos de uso e política de trocas
        </h2>
        <div className="bg-[#1a1315] border border-[#4a1c22] rounded-lg p-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <ShieldAlert size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-[14px]">Política de reembolsos:</strong>
                <p className="text-[13px] text-[#ef4444] opacity-90 mt-1">Sem reembolsos via PIX, apenas substituição conforme política.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-[14px]">Prazos para trocas:</strong>
                <p className="text-[13px] text-[#ef4444] opacity-90 mt-1">O cliente possui 5 minutos para solicitar a troca após a compra.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-[14px]">Verificação bancária (VBV):</strong>
                <p className="text-[13px] text-[#ef4444] opacity-90 mt-1">Produtos bloqueados por VBV ou WhatsApp não são elegíveis para troca.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-[14px]">Plataformas com baixa taxa:</strong>
                <p className="text-[13px] text-[#ef4444] opacity-90 mt-1">Evite aprovar em Roblox, Bonox, Rei dos Coins (isso anula a garantia).</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-[14px]">Limite de trocas:</strong>
                <p className="text-[13px] text-[#ef4444] opacity-90 mt-1">Máximo de 2 trocas por compra. A 3ª solicitação será negada automaticamente.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6 text-center">
        <h3 className="font-bold text-white text-[15px] mb-2">Aprovou? Envie suas avaliações!</h3>
        <p className="text-[13px] text-[#9ca3af] mb-4">Precisa de ajuda? Use os canais oficiais no Discord</p>
        <div className="flex justify-center gap-4">
          <a href="https://discord.gg/sagaz" target="_blank" className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            <MessageSquare size={16} /> Discord
          </a>
        </div>
      </div>
    </div>
  );
}
