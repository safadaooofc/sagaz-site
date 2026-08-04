"use client";

import { useState } from "react";
import { 
  MessageSquare, Plus, Send, Loader2, AlertTriangle, ShieldCheck, 
  RefreshCw, CheckCircle2, Video, Clock, CreditCard, Ban 
} from "lucide-react";
import { toast } from "sonner";
import { createTicket, replyTicket } from "./actions";

export function SuporteClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState<any | null>(initialTickets[0] || null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<"general" | "exchange" | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // General Ticket State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Exchange Ticket State
  const [productName, setProductName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [exchangeReason, setExchangeReason] = useState("");

  const [loading, setLoading] = useState(false);

  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);

  const resetForm = () => {
    setSubject("");
    setMessage("");
    setProductName("");
    setVideoLink("");
    setExchangeReason("");
    setAcceptedTerms(false);
    setTicketCategory(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalSubject = subject;
    let finalMessage = message;

    if (ticketCategory === "exchange") {
      if (!acceptedTerms) {
        toast.error("Você deve aceitar os termos de troca para prosseguir.");
        setLoading(false);
        return;
      }
      finalSubject = `[TROCA] ${productName}`;
      finalMessage = `**Produto:** ${productName}\n**Link do Vídeo (Google Pay):** ${videoLink}\n\n**Motivo relatado:**\n${exchangeReason}`;
    }

    const res = await createTicket(finalSubject, finalMessage);
    if (res.success) {
      toast.success("Ticket criado com sucesso!");
      setIsCreating(false);
      resetForm();
      window.location.reload(); 
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    setReplying(true);
    const res = await replyTicket(activeTicket.id, reply);
    if (res.success) {
      toast.success("Mensagem enviada!");
      setReply("");
      window.location.reload();
    } else {
      toast.error(res.error);
    }
    setReplying(false);
  };

  return (
    <div className="font-sans space-y-6 max-w-7xl mx-auto h-[85vh] flex flex-col">
      <div className="flex justify-between items-center shrink-0 bg-[#0f1115] border border-[#262933] p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-cyan-400" /> Central de Suporte
          </h1>
          <p className="text-[#9ca3af]">Acompanhe seus chamados ou solicite trocas diretamente com a staff.</p>
        </div>
        <button 
          onClick={() => { setIsCreating(true); setActiveTicket(null); resetForm(); }}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105"
        >
          <Plus size={20} /> Abrir Ticket
        </button>
      </div>

      <div className="flex gap-6 h-full overflow-hidden shrink-0 min-h-[500px]">
        {/* Ticket List */}
        <div className="w-1/3 bg-[#0a0c10] border border-[#1e2028] rounded-2xl overflow-y-auto hidden md:block shadow-inner">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-[#6b7280] flex flex-col items-center justify-center h-full">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Nenhum ticket aberto.</p>
            </div>
          ) : (
            <div className="flex flex-col p-2 gap-2">
              {tickets.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTicket(t); setIsCreating(false); }}
                  className={`p-4 text-left rounded-xl border transition-all ${
                    activeTicket?.id === t.id 
                      ? "bg-[#181a20] border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                      : "bg-[#0f1115] border-[#1e2028] hover:border-[#2a2d39]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white line-clamp-1 pr-2 text-sm">{t.subject}</h3>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase shrink-0 ${t.status === 'OPEN' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                    {t.messages[t.messages.length - 1]?.content || "Sem mensagens"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Content or Create Form */}
        <div className="flex-1 bg-[#0a0c10] border border-[#1e2028] rounded-2xl flex flex-col overflow-hidden relative shadow-lg">
          {isCreating ? (
            <div className="p-8 overflow-y-auto h-full styled-scrollbar">
              
              {!ticketCategory ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Como podemos te ajudar?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <button 
                      onClick={() => setTicketCategory("general")}
                      className="bg-[#13151a] border border-[#262933] hover:border-cyan-500/50 p-8 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-xl group"
                    >
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                        <MessageSquare className="text-cyan-400" size={32} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Dúvida ou Problema Geral</h3>
                      <p className="text-[#6b7280] text-sm">Problemas na conta, dúvidas sobre compras ou relatórios de bugs.</p>
                    </button>
                    
                    <button 
                      onClick={() => setTicketCategory("exchange")}
                      className="bg-[#13151a] border border-[#262933] hover:border-purple-500/50 p-8 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-xl group"
                    >
                      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                        <RefreshCw className="text-purple-400" size={32} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Solicitar Troca (Garantia)</h3>
                      <p className="text-[#6b7280] text-sm">Reportar material die/inválido e solicitar troca (Vídeo obrigatório).</p>
                    </button>
                  </div>
                </div>
              ) : ticketCategory === "general" ? (
                <div className="max-w-3xl mx-auto w-full">
                  <button onClick={() => setTicketCategory(null)} className="text-sm text-[#9ca3af] hover:text-white mb-6 flex items-center gap-2">
                    &larr; Voltar
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-6">Criar Ticket Geral</h2>
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[#9ca3af] mb-2">Assunto</label>
                      <input 
                        type="text" 
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                        placeholder="Ex: Não recebi meu saldo após o PIX"
                        className="w-full bg-[#13151a] border border-[#262933] rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#9ca3af] mb-2">Mensagem</label>
                      <textarea 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        rows={8}
                        placeholder="Descreva seu problema com o máximo de detalhes possível..."
                        className="w-full bg-[#13151a] border border-[#262933] rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 resize-none transition-colors"
                      ></textarea>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors flex-1 shadow-lg">
                        {loading ? <Loader2 className="animate-spin" /> : "Enviar Ticket"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto w-full pb-10">
                  <button onClick={() => setTicketCategory(null)} className="text-sm text-[#9ca3af] hover:text-white mb-6 flex items-center gap-2">
                    &larr; Voltar
                  </button>
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <RefreshCw className="text-purple-400" /> Solicitação de Troca
                  </h2>
                  
                  {/* TERMOS DE TROCA */}
                  <div className="bg-[#13151a] border border-purple-500/20 rounded-2xl p-6 mb-8 shadow-inner">
                    <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold border-b border-purple-500/10 pb-3">
                      <ShieldCheck size={20} /> Termos Rigorosos de Garantia e Troca
                    </div>
                    
                    <div className="space-y-6 text-sm text-[#d1d5db]">
                      <div>
                        <h4 className="text-white font-bold flex items-center gap-2 mb-2"><CheckCircle2 className="text-green-500" size={16} /> O que é garantido</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong className="text-white">Saldo Garantido & Live:</strong> Material virgem, testado previamente no checker e entregue 100% aprovado/vivo.</li>
                          <li><strong className="text-white">Não garantimos aprovação:</strong> A recusa em uma loja X não dá direito a troca. A troca só é válida para saldo abaixo do comprado ou se o cartão estiver morto mediante prova (Google Pay).</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold flex items-center gap-2 mb-2"><AlertTriangle className="text-yellow-500" size={16} /> Regras para Solicitação</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong className="text-white">Onde testar:</strong> Para pedir troca, adicione no <strong>Google Pay</strong>.</li>
                          <li><strong className="text-white flex items-center gap-1 inline-flex"><Clock size={14}/> Prazo limite:</strong> O teste deve ser enviado em até <strong>10 minutos</strong> após a entrega. Após isso, negado automaticamente.</li>
                          <li><strong className="text-white flex items-center gap-1 inline-flex"><Video size={14}/> Prova em Vídeo:</strong> Estritamente obrigatório gravar vinculando no GPay mostrando o erro e os dados do cartão no mesmo take.</li>
                        </ul>
                      </div>

                      <div className="bg-[#0f1115] p-4 rounded-xl border border-[#262933]">
                        <h5 className="font-bold text-white mb-2 flex items-center gap-2"><CreditCard size={14} /> Resultados GPay:</h5>
                        <ul className="space-y-2 text-xs">
                          <li><span className="text-green-400 font-bold">Vinculou:</span> Cartão está LIVE. Sem troca.</li>
                          <li><span className="text-red-400 font-bold">Emissor recusou / Saldo Insuficiente:</span> Cartão DIE. Direito a troca imediata (com vídeo).</li>
                          <li><span className="text-yellow-400 font-bold">Falha Genérica:</span> Problema na SUA conta do Google, não no cartão. Use conta com histórico.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-white font-bold flex items-center gap-2 mb-2"><Ban className="text-red-500" size={16} /> Avisos Importantes</h4>
                        <p className="text-xs text-[#9ca3af] leading-relaxed">
                          Não teste em vários lugares, isso bloqueia o cartão. Cartões identificados como já passados em outros gateways terão o ticket ignorado. Estas normas existem para evitar "farm" de trocas, protegendo a plataforma.
                        </p>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 mt-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl cursor-pointer hover:bg-purple-500/20 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-gray-900 bg-gray-700"
                      />
                      <span className="text-white text-sm font-medium">
                        Eu li, entendi e declaro que cumpri todas as regras acima (Teste no Google Pay em menos de 10 minutos, gravado em vídeo em take único).
                      </span>
                    </label>
                  </div>

                  {/* FORMULÁRIO DE TROCA (Só aparece se aceitou os termos) */}
                  <div className={`transition-all duration-500 ${acceptedTerms ? 'opacity-100 max-h-[1000px]' : 'opacity-50 max-h-[100px] overflow-hidden pointer-events-none'}`}>
                    <form onSubmit={handleCreate} className="space-y-5 bg-[#13151a] p-6 rounded-2xl border border-[#262933]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-[#9ca3af] mb-2">ID do Pedido / Info do Cartão</label>
                          <input 
                            type="text" 
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                            required={acceptedTerms}
                            placeholder="Ex: Pedido #992 ou 4000 00..."
                            className="w-full bg-[#0a0c10] border border-[#262933] rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-[#9ca3af] mb-2">Link do Vídeo (Obrigatório)</label>
                          <input 
                            type="url" 
                            value={videoLink}
                            onChange={e => setVideoLink(e.target.value)}
                            required={acceptedTerms}
                            placeholder="Link do YouTube, Imgur, Streamable..."
                            className="w-full bg-[#0a0c10] border border-[#262933] rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#9ca3af] mb-2">Descreva o que ocorreu</label>
                        <textarea 
                          value={exchangeReason}
                          onChange={e => setExchangeReason(e.target.value)}
                          required={acceptedTerms}
                          rows={4}
                          placeholder="Ex: Tentei vincular no Google Pay assim que comprei, mas retornou 'Emissor Recusou'. O vídeo mostra todo o processo."
                          className="w-full bg-[#0a0c10] border border-[#262933] rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 resize-none transition-colors"
                        ></textarea>
                      </div>
                      <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg">
                          {loading ? <Loader2 className="animate-spin" /> : "Enviar Solicitação de Troca"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : activeTicket ? (
            <>
              <div className="p-6 border-b border-[#1e2028] bg-[#0f1115] flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {activeTicket.subject.includes('[TROCA]') ? <RefreshCw className="text-purple-400" size={20} /> : <MessageSquare className="text-cyan-400" size={20} />}
                    {activeTicket.subject}
                  </h2>
                  <p className="text-sm text-[#6b7280] mt-1">Criado em {new Date(activeTicket.createdAt).toLocaleDateString('pt-BR')} às {new Date(activeTicket.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${activeTicket.status === 'OPEN' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {activeTicket.status === 'OPEN' ? 'Em Aberto' : 'Resolvido'}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 styled-scrollbar bg-[#0a0c10]">
                {activeTicket.messages.map((m: any) => (
                  <div key={m.id} className={`flex ${m.isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] rounded-2xl p-5 shadow-sm ${
                      m.isAdmin 
                        ? 'bg-[#181a20] border border-[#262933] text-white rounded-tl-none' 
                        : 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-[0_5px_15px_rgba(6,182,212,0.2)]'
                    }`}>
                      <p className="text-[14px] whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${m.isAdmin ? 'border-[#262933]' : 'border-white/20'}`}>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${m.isAdmin ? 'text-[#9ca3af]' : 'text-cyan-100'}`}>
                          {m.isAdmin ? 'Staff Support' : 'Você'}
                        </span>
                        <span className={`text-[10px] ${m.isAdmin ? 'text-[#6b7280]' : 'text-cyan-200'}`}>
                          • {new Date(m.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeTicket.status === 'OPEN' ? (
                <form onSubmit={handleReply} className="p-4 border-t border-[#1e2028] bg-[#0f1115] flex gap-3 shrink-0">
                  <input 
                    type="text" 
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-[#13151a] border border-[#262933] rounded-xl px-5 text-white outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button type="submit" disabled={replying || !reply.trim()} className="w-14 rounded-xl bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center text-white disabled:opacity-50 shrink-0 transition-colors shadow-lg">
                    {replying ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </form>
              ) : (
                <div className="p-4 border-t border-[#1e2028] bg-[#0f1115] text-center text-[#6b7280] text-sm shrink-0">
                  <ShieldCheck className="mx-auto mb-2 text-[#4b5563]" size={24} />
                  Este ticket foi encerrado pela administração.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#4b5563]">
              <MessageSquare size={64} className="mb-4 opacity-10" />
              <p className="font-medium">Selecione um ticket ao lado ou abra um novo chamado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
