"use client";

import { useState, useEffect, useMemo, useRef, Fragment } from "react";
import { DollarSign, CheckCircle2, Gift, Search, Plus, Minus, ShieldCheck, Loader2, CreditCard, ChevronDown, Check, X, AlertTriangle, AlertCircle, Info, Bitcoin, Wallet } from "lucide-react";
import QRCode from "qrcode";
import { getAvailableCryptos, createCryptoPayment, createPixPayment, checkPaymentStatus, getUserBalance } from "./actions";

import { toast } from "sonner";

function CryptoPaymentModal({ isOpen, onClose, amount, onSuccess }: any) {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  async function loadCurrencies() {
    setLoading(true);
    try {
      const data = await getAvailableCryptos();
      setCryptos(data);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar moedas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && cryptos.length === 0) {
      loadCurrencies();
    }
  }, [isOpen, cryptos.length]);

  const filteredCryptos = useMemo(() => {
    if (!search) return cryptos;
    const s = search.toLowerCase();
    return cryptos.filter((c) => c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || c.ticker.toLowerCase().includes(s));
  }, [search, cryptos]);

  const sortedCryptos = useMemo(() => {
    const popular = filteredCryptos.filter((c) => c.is_popular);
    const regular = filteredCryptos.filter((c) => !c.is_popular);
    return [...popular.sort((a, b) => a.name.localeCompare(b.name)), ...regular.sort((a, b) => a.name.localeCompare(b.name))];
  }, [filteredCryptos]);

  const handleCreatePayment = async () => {
    if (!selectedCrypto) {
      toast.error("Selecione uma moeda.");
      return;
    }
    setCreating(true);
    try {
      const res = await createCryptoPayment(amount, selectedCrypto.code);
      if (res.success && res.recharge) {
        toast.success("Pagamento criado com sucesso!");
        onSuccess(res.recharge);
        onClose();
      } else {
        toast.error(res.message || "Erro ao criar pagamento");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro ao criar pagamento");
    } finally {
      setCreating(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col rounded-lg border border-[#333845] bg-[#0f1115] text-white shadow-lg p-0 animate-in zoom-in-95 duration-200">
        <div className="flex-shrink-0 p-6 border-b border-[#1f2229]">
          <h2 className="text-center text-xl font-semibold flex items-center justify-center gap-2">
            <Bitcoin className="h-5 w-5" /> Pagamento em Criptomoedas
          </h2>
          <p className="text-center text-sm text-[#9ca3af] mt-2">Escolha a criptomoeda para pagar sua recarga</p>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 p-6">
          <div className="text-center p-4 bg-[#eab308]/10 rounded-lg border border-[#eab308]/20">
            <div className="text-2xl font-bold text-[#eab308] mb-1">
              {formatCurrency(amount)} → {formatCurrency(amount * 1.2)}
            </div>
            <div className="text-sm text-[#9ca3af]">Paga / Recebe (+20% bônus)</div>
          </div>
          
          <div className="bg-[#1f2229] border-l-4 border-[#eab308] p-4 text-sm text-white">
            <strong>Importante:</strong> Após o pagamento, você será redirecionado para uma página de acompanhamento onde poderá monitorar o status da transação.
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecione a criptomoeda</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
              <input 
                type="text" 
                placeholder="Pesquisar criptomoeda..." 
                className="w-full bg-[#181a20] border border-[#262933] rounded-md py-2 pl-9 pr-9 text-sm focus:outline-none focus:border-[#eab308]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]"
                  onClick={() => { setSearch(""); setSelectedCrypto(null); }}
                ><X size={16} /></button>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-2 py-4">
                <div className="h-10 w-full bg-[#181a20] animate-pulse rounded"></div>
                <div className="text-xs text-[#9ca3af] text-center">Carregando moedas disponíveis...</div>
              </div>
            ) : (
              <div className="h-48 w-full rounded-md border border-[#262933] bg-[#181a20] overflow-y-auto p-2">
                {sortedCryptos.length === 0 ? (
                  <div className="text-center text-[#9ca3af] py-4">Nenhuma moeda encontrada.</div>
                ) : (
                  sortedCryptos.map(c => (
                    <button 
                      key={c.code}
                      onClick={() => setSelectedCrypto(c)}
                      className={`w-full flex items-center gap-3 p-3 mb-1 rounded-md transition-colors ${selectedCrypto?.code === c.code ? 'bg-[#262933] border border-[#3f3b1b]' : 'hover:bg-[#1f2229] border border-transparent'}`}
                    >
                      <img src={c.logo_url} alt={c.name} className="w-6 h-6 object-contain" />
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{c.name}</span>
                          <span className="text-xs border border-[#333845] bg-[#0f1115] px-1.5 py-0.5 rounded text-[#9ca3af] uppercase">{c.code}</span>
                          {c.is_popular && <span className="text-xs bg-blue-600 px-1.5 py-0.5 rounded text-white">Popular</span>}
                          {c.is_stable && <span className="text-xs bg-green-600 px-1.5 py-0.5 rounded text-white">Stable</span>}
                        </div>
                        <span className="text-xs text-[#6b7280]">Rede: {c.network || "N/A"}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          
          {selectedCrypto && (
            <div className="p-3 bg-[#181a20] rounded-lg border border-[#262933]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Moeda selecionada:</span>
                </div>
                <div className="flex items-center gap-2 border border-[#333845] bg-[#0f1115] px-2 py-1 rounded text-sm font-medium">
                  <img src={selectedCrypto.logo_url} alt="" className="w-4 h-4" />
                  {selectedCrypto.name} ({selectedCrypto.code.toUpperCase()})
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 p-6 border-t border-[#1f2229]">
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={creating}
              className="flex-1 rounded-md border border-[#333845] bg-transparent hover:bg-[#1f2229] py-2 font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreatePayment}
              disabled={!selectedCrypto || creating || loading}
              className="flex-1 rounded-md bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] py-2 font-bold flex items-center justify-center disabled:opacity-50"
            >
              {creating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Criando...</> : <><Bitcoin className="h-4 w-4 mr-2" /> Pagar com {selectedCrypto?.code.toUpperCase() || "Cripto"}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PixIcon({ className }: any) {
  return (
    <svg viewBox="0 0 512 512" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.6 391.5 392.6 391.5H407.7L310.6 488.6C280.3 518.1 231.1 518.1 200.8 488.6L103.3 391.5H112.6C132.6 391.5 151.5 383.7 165.7 369.5L242.4 292.5zM262.5 218.9C257.1 224.3 247.8 224.3 242.4 218.9L165.7 142.1C151.5 127.9 132.6 120.1 112.6 120.1H103.3L200.7 22.8C231.1-7.6 280.3-7.6 310.6 22.8L407.7 120.1H392.6C372.6 120.1 353.7 127.9 339.5 142.1L262.5 218.9zM112.6 142.1C126.4 142.1 139.1 148.3 149.7 158.1L226.4 236.1C239.9 249.5 261.9 249.5 275.4 236.1L352.1 158.1C362.7 148.3 375.4 142.1 389.2 142.1H430.3L488.6 200.8C518.9 231.1 518.9 280.3 488.6 310.6L430.3 368.9H389.2C375.4 368.9 362.7 362.7 352.1 352.1L275.4 275.4C261.9 261.9 239.9 261.9 226.4 275.4L149.7 352.1C139.1 362.7 126.4 368.9 112.6 368.9H71.5L13.2 310.6C-17.1 280.3-17.1 231.1 13.2 200.8L71.5 142.1H112.6z" />
    </svg>
  );
}

export function RechargeClient({ balance: initialBalance, isEligibleForReferralBonus }: any) {
  const [balance, setBalance] = useState(initialBalance);
  const [loading, setLoading] = useState(false);
  const [customAmountStr, setCustomAmountStr] = useState("");
  const [presetAmount, setPresetAmount] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState([20]); // 0 to 100 representing 10 to 500
  
  const [generating, setGenerating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentRecharge, setCurrentRecharge] = useState<any>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentSuccessAlert, setPaymentSuccessAlert] = useState(false);
  
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [activeAmount, setActiveAmount] = useState(0);

  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const paymentCheckInterval = useRef<number | null>(null);

  useEffect(() => {
    async function init() {
      const b = await getUserBalance();
      setBalance(b.balance);
    }
    init();
  }, []);

  const generateQRCode = async (code: string) => {
    if (code && qrCanvasRef.current) {
      try {
        await QRCode.toCanvas(qrCanvasRef.current, code, {
          width: 160, margin: 2, color: { dark: "#000000", light: "#FFFFFF" }
        });
        setQrCodeDataUrl(qrCanvasRef.current.toDataURL("image/png"));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (currentRecharge?.pixCode && showPaymentModal) {
      generateQRCode(currentRecharge.pixCode);
    }
  }, [currentRecharge?.pixCode, showPaymentModal]);

  useEffect(() => {
    return () => {
      if (paymentCheckInterval.current) clearInterval(paymentCheckInterval.current);
    };
  }, []);

  function startPaymentCheck() {
    if (paymentCheckInterval.current) return;
    checkPaymentStatusInterval();
    paymentCheckInterval.current = window.setInterval(checkPaymentStatusInterval, 3000);
  }

  useEffect(() => {
    if (showPaymentModal && currentRecharge?._id && !paymentCheckInterval.current) {
      startPaymentCheck();
    } else if (!showPaymentModal && paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
      paymentCheckInterval.current = null;
    }
  }, [showPaymentModal, currentRecharge]);

  useEffect(() => {
    if (!rateLimited || retryAfter <= 0) return;
    const i = setInterval(() => {
      setRetryAfter(prev => prev <= 1 ? (setRateLimited(false), 0) : prev - 1);
    }, 1000);
    return () => clearInterval(i);
  }, [rateLimited, retryAfter]);

  const formatCurrency = (val: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const getSliderAmount = () => Math.max(1, Math.round(1 + (sliderValue[0] / 100) * 499));
  
  const getBonusPercentage = (amount: number) => {
    let p = 0;
    if (amount >= 500) p = 20;
    else if (amount >= 200) p = 15;
    else if (amount >= 100) p = 10;
    else if (amount >= 50) p = 5;

    if (isEligibleForReferralBonus && amount >= 1) p += 10;
    return p;
  };

  const getBonusMultiplier = (amount: number) => 1 + (getBonusPercentage(amount) / 100);
  const getFinalValue = (amount: number) => amount * getBonusMultiplier(amount);

  const getNextBonusLevel = (amount: number) => {
    if (amount < 50) return { threshold: 50, bonus: 5, remaining: 50 - amount };
    if (amount < 100) return { threshold: 100, bonus: 10, remaining: 100 - amount };
    if (amount < 200) return { threshold: 200, bonus: 15, remaining: 200 - amount };
    if (amount < 500) return { threshold: 500, bonus: 20, remaining: 500 - amount };
    return null;
  };

  const handlePresetSelect = (val: number) => {
    setPresetAmount(val);
    setCustomAmountStr("");
    setSliderValue([Math.max(0, Math.min(100, ((val - 1) / 499) * 100))]);
  };

  const handleCustomAmountChange = (val: string) => {
    if (val === "") {
      setCustomAmountStr("");
      setPresetAmount(null);
      return;
    }
    const clean = val.replace(/[^\d,\.]/g, "");
    const parsed = parseFloat(clean.replace(",", "."));
    if (isNaN(parsed)) {
      setCustomAmountStr(clean);
      setPresetAmount(null);
      return;
    }
    if (parsed > 500) {
      setCustomAmountStr("500");
      setPresetAmount(null);
      setSliderValue([100]);
      return;
    }
    setCustomAmountStr(clean);
    setPresetAmount(null);
    if (parsed >= 1 && parsed <= 500) {
      setSliderValue([Math.max(0, Math.min(100, ((parsed - 1) / 499) * 100))]);
    }
  };

  const handleSelectPaymentMethod = (method: string) => {
    const min = method === "crypto" ? 70 : 1;
    if (activeAmount < min) {
      toast.error(`O valor mínimo para recarga via ${method === 'crypto' ? 'Criptomoedas' : 'PIX'} é ${formatCurrency(min)}`);
      setStep(1);
      return;
    }
    setSelectedMethod(method);
    setStep(3);
  };

  const handleGenerateOrder = async () => {
    if (selectedMethod === "crypto") {
      setCryptoModalOpen(true);
      return;
    }
    setGenerating(true);
    try {
      const res = await createPixPayment(activeAmount);
      if (res.success && res.recharge) {
        // Mock fallback to our own modal instead of the /pagamento-pix page to keep it inside the SPA
        setCurrentRecharge(res.recharge);
        setShowPaymentModal(true);
      } else {
        toast.error(res.message || "Erro na recarga");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro na recarga");
    } finally {
      setGenerating(false);
    }
  };

  const checkPaymentStatusInterval = async () => {
    if (!currentRecharge?._id || !showPaymentModal) return;
    setIsCheckingPayment(true);
    try {
      const res = await checkPaymentStatus(currentRecharge._id);
      if (res.success && res.data) {
        setPaymentStatus(res.data.status);
        if (res.data.status === "completed") {
          setPaymentSuccessAlert(true);
          setShowPaymentModal(false);
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
            paymentCheckInterval.current = null;
          }
          const b = await getUserBalance();
          setBalance(b.balance);
          toast.error(`Pagamento aprovado! Seu saldo foi creditado com ${formatCurrency(currentRecharge.totalAmount)}`);
        } else if (res.data.status === "failed") {
          toast.error("Pagamento falhou.");
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
            paymentCheckInterval.current = null;
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingPayment(false);
    }
  };



  const currentValRaw = presetAmount || (customAmountStr ? parseFloat(customAmountStr.replace(",", ".")) : 0) || getSliderAmount();
  
  useEffect(() => {
    setActiveAmount(currentValRaw);
  }, [currentValRaw]);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 text-white">
          <Wallet className="h-8 w-8 text-[#eab308]" /> Recarregar Saldo
        </h1>
        <p className="text-[#9ca3af]">Siga os passos abaixo para adicionar créditos à sua conta</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 1 ? 'bg-[#eab308] text-black' : step > 1 ? 'bg-green-500 text-white' : 'bg-[#181a20] text-[#4b5563]'}`}>
            {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
          </div>
          <span className={`text-sm font-bold ${step === 1 ? 'text-white' : 'text-[#9ca3af]'}`}>Valor</span>
        </div>
        <div className={`h-0.5 w-12 ${step > 1 ? 'bg-green-500' : 'bg-[#262933]'}`}></div>
        
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 2 ? 'bg-[#eab308] text-black' : step > 2 ? 'bg-green-500 text-white' : 'bg-[#181a20] text-[#4b5563]'}`}>
            {step > 2 ? <CheckCircle2 className="h-4 w-4" /> : "2"}
          </div>
          <span className={`text-sm font-bold ${step === 2 ? 'text-white' : 'text-[#9ca3af]'}`}>Método</span>
        </div>
        <div className={`h-0.5 w-12 ${step > 2 ? 'bg-green-500' : 'bg-[#262933]'}`}></div>
        
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 3 ? 'bg-[#eab308] text-black' : 'bg-[#181a20] text-[#4b5563]'}`}>
            3
          </div>
          <span className={`text-sm font-bold ${step === 3 ? 'text-white' : 'text-[#9ca3af]'}`}>Confirmação</span>
        </div>
      </div>

      {isEligibleForReferralBonus ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4 flex items-start gap-4 animate-in fade-in zoom-in">
          <div className="bg-yellow-500/20 text-yellow-500 p-3 rounded-full shrink-0">
            <Gift size={24} />
          </div>
          <div>
            <h3 className="text-yellow-500 font-bold text-lg mb-1">🎁 Bônus de Indicação Ativo</h3>
            <p className="text-yellow-500/80 text-sm leading-relaxed">
              Você ganha <strong>+10% de Bônus Extra</strong> em qualquer recarga a partir de R$ 1,00 por usar um link de convite!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-4 mb-4 flex items-start gap-4">
          <div className="bg-[#262933] text-[#9ca3af] p-3 rounded-full shrink-0">
            <Gift size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-1">Sabia que você poderia estar ganhando mais?</h3>
            <p className="text-[#9ca3af] text-sm leading-relaxed">
              Se você tivesse se cadastrado através de um link de convite, você estaria ganhando <strong>+10% de Bônus Extra</strong> {activeAmount > 0 ? `(+ ${formatCurrency(activeAmount * 0.10)})` : ""} nesta recarga!
            </p>
          </div>
        </div>
      )}

      {rateLimited && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Muitas tentativas de recarga</h4>
            <p className="text-sm">Aguarde {Math.ceil(retryAfter / 60)} minuto(s) antes de tentar novamente ({retryAfter}s)</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-5 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-base font-medium text-white">Saldo Atual</p>
            <DollarSign className="h-4 w-4 text-[#9ca3af]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{formatCurrency(balance)}</div>
            <p className="text-xs text-[#9ca3af]">Disponível na conta</p>
          </div>
        </div>
        
        <div className="bg-[#181a20] border-2 border-green-500 rounded-xl p-5 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-base font-medium text-green-500">Saldo Após Recarga</p>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-green-500">
              {(step >= 2 && activeAmount > 0) || (step === 1 && activeAmount > 0) 
                ? formatCurrency(balance + getFinalValue(activeAmount))
                : <span className="text-[#6b7280]">—</span>}
            </div>
            <p className="text-xs text-green-500">
              {(() => {
                const amt = activeAmount;
                const perc = getBonusPercentage(amt);
                if (amt > 0) {
                  return perc > 0 
                    ? `+${formatCurrency(amt)} + ${formatCurrency(getFinalValue(amt) - amt)} bônus (${perc}%)`
                    : `+${formatCurrency(amt)} (sem bônus - mínimo R$ 50)`;
                }
                return "Escolha um valor para ver";
              })()}
            </p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-md animate-in fade-in slide-in-from-bottom-4">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <DollarSign className="h-5 w-5 text-[#eab308]" /> Etapa 1: Escolha o valor
            </h2>
            <p className="text-sm text-[#9ca3af]">Selecione quanto deseja recarregar</p>
          </div>
          
          <div className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-br from-[#eab308]/10 to-[#eab308]/5 rounded-lg border-2 border-[#eab308]/20">
              <div className="text-4xl font-bold text-[#eab308] mb-2">{formatCurrency(activeAmount)}</div>
              <div className="text-sm text-[#9ca3af] mb-2">Valor selecionado</div>
              <div className="space-y-2">
                {getBonusPercentage(activeAmount) > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Bônus de {getBonusPercentage(activeAmount)}% ativo!</span>
                  </div>
                ) : getNextBonusLevel(activeAmount) ? (
                  <div className="text-center">
                    <div className="text-xs text-[#9ca3af] mb-1">
                      Adicione mais {formatCurrency(getNextBonusLevel(activeAmount)!.remaining)} para ganhar {getNextBonusLevel(activeAmount)!.bonus}% de bônus
                    </div>
                    <div className="w-full bg-[#1f2229] rounded-full h-2">
                      <div className="bg-[#eab308] h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (activeAmount / getNextBonusLevel(activeAmount)!.threshold) * 100)}%` }}></div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-white">Valores Rápidos</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[10, 25, 50, 100, 200, 500].map(val => (
                  <button 
                    key={val}
                    onClick={() => handlePresetSelect(val)}
                    className={`h-12 text-base font-bold rounded-xl transition-all ${presetAmount === val ? 'bg-[#eab308] text-black' : 'bg-[#1f2229] border border-[#262933] text-white hover:border-[#eab308]'}`}
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-white">Ou ajuste o valor</label>
              <div className="px-2">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue[0]}
                  onChange={e => {
                    const v = parseInt(e.target.value);
                    setSliderValue([v]);
                    setPresetAmount(null);
                    setCustomAmountStr("");
                  }}
                  className="w-full accent-[#eab308] h-1.5 bg-[#262933] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-[#9ca3af] px-2 font-medium">
                <span>R$ 1,00</span>
                <span>R$ 500,00</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Valor personalizado (R$)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">R$</div>
                <input 
                  type="text"
                  value={customAmountStr}
                  onChange={e => handleCustomAmountChange(e.target.value)}
                  placeholder="Ex: 50,00"
                  className="w-full pl-9 pr-4 py-3 bg-[#1f2229] border border-[#262933] rounded-xl text-white font-medium focus:outline-none focus:border-[#eab308]"
                />
              </div>
            </div>

            <button 
              onClick={() => { if (activeAmount >= 1) setStep(2); else toast.error("Valor mínimo é R$ 1,00"); }}
              disabled={activeAmount < 1}
              className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
            >
              Continuar para Pagamento
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-md animate-in fade-in slide-in-from-right-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <Wallet className="h-5 w-5 text-[#eab308]" /> Etapa 2: Método de pagamento
              </h2>
              <p className="text-sm text-[#9ca3af]">Escolha como deseja pagar</p>
            </div>
            <button onClick={() => setStep(1)} className="text-sm text-[#eab308] hover:underline">Alterar Valor</button>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleSelectPaymentMethod("pix")}
              className="w-full flex items-center justify-between p-4 border border-[#262933] rounded-xl hover:border-[#eab308] bg-[#1f2229] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center">
                  <PixIcon className="h-6 w-6 text-teal-400" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-base group-hover:text-[#eab308] transition-colors">PIX</p>
                  <p className="text-xs text-[#9ca3af]">Aprovação imediata • Sem taxas</p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 -rotate-90 text-[#6b7280]" />
            </button>

            <button 
              onClick={() => handleSelectPaymentMethod("crypto")}
              className="w-full flex items-center justify-between p-4 border border-[#262933] rounded-xl hover:border-[#eab308] bg-[#1f2229] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f7931a]/10 rounded-full flex items-center justify-center">
                  <Bitcoin className="h-6 w-6 text-[#f7931a]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-base group-hover:text-[#eab308] transition-colors">Criptomoedas</p>
                  <p className="text-xs text-[#9ca3af]">+20% Bônus • Aprovação na blockchain</p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 -rotate-90 text-[#6b7280]" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-[#181a20] border border-[#262933] rounded-xl p-6 shadow-md animate-in fade-in slide-in-from-right-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <CheckCircle2 className="h-5 w-5 text-[#eab308]" /> Etapa 3: Confirmação
              </h2>
              <p className="text-sm text-[#9ca3af]">Revise os dados antes de gerar</p>
            </div>
            <button onClick={() => setStep(2)} className="text-sm text-[#eab308] hover:underline">Mudar Método</button>
          </div>
          
          <div className="bg-[#1f2229] rounded-xl border border-[#262933] p-5 mb-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-[#333845]">
              <span className="text-[#9ca3af] font-medium">Método</span>
              <span className="font-bold text-white capitalize flex items-center gap-2">
                {selectedMethod === 'pix' ? <PixIcon className="h-4 w-4 text-teal-400" /> : <Bitcoin className="h-4 w-4 text-[#f7931a]" />}
                {selectedMethod === 'pix' ? 'PIX' : 'Criptomoedas'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[#333845]">
              <span className="text-[#9ca3af] font-medium">Valor Base</span>
              <span className="font-bold text-white">{formatCurrency(activeAmount)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[#333845]">
              <span className="text-[#9ca3af] font-medium">Bônus</span>
              <span className="font-bold text-green-500">+{formatCurrency(getFinalValue(activeAmount) - activeAmount)} ({getBonusPercentage(activeAmount)}%)</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-white font-bold">Total a Receber</span>
              <span className="font-black text-2xl text-[#eab308]">{formatCurrency(getFinalValue(activeAmount))}</span>
            </div>
          </div>
          
          <button 
            onClick={handleGenerateOrder}
            disabled={generating}
            className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black font-bold py-4 rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {generating ? <><Loader2 className="h-5 w-5 animate-spin" /> Gerando pedido...</> : "Gerar Pedido"}
          </button>
        </div>
      )}

      <CryptoPaymentModal 
        isOpen={cryptoModalOpen} 
        onClose={() => setCryptoModalOpen(false)} 
        amount={activeAmount} 
        onSuccess={(recharge: any) => {
          setCurrentRecharge(recharge);
          setShowPaymentModal(true);
        }} 
      />

      {/* PIX Payment Modal (Mocking /pagamento-pix logic) */}
      {showPaymentModal && currentRecharge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative z-10 w-full max-w-md rounded-xl border border-[#333845] bg-[#0f1115] text-white shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-center mb-6">Pagamento {currentRecharge.method.toUpperCase()}</h2>
            
            <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-6 mx-auto w-48 h-48">
              <canvas ref={qrCanvasRef} className="w-full h-full"></canvas>
            </div>
            
            <div className="bg-[#1f2229] border border-[#262933] rounded-lg p-3 mb-6 flex flex-col items-center">
              <p className="text-sm text-[#9ca3af] mb-1">Valor a pagar</p>
              <p className="text-2xl font-black text-[#eab308]">{formatCurrency(currentRecharge.amount)}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-center text-[#9ca3af] mb-2">Copie o código PIX abaixo</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={currentRecharge.pixCode} 
                  className="flex-1 bg-[#181a20] border border-[#333845] rounded-md px-3 py-2 text-sm text-[#9ca3af]"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(currentRecharge.pixCode);
                    toast.success("Código copiado!");
                  }}
                  className="bg-[#262933] hover:bg-[#333845] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 border border-dashed border-[#eab308]/50 rounded-lg bg-[#eab308]/5">
              <Loader2 className="h-8 w-8 text-[#eab308] animate-spin mb-3" />
              <p className="text-sm font-bold text-white mb-1">Aguardando pagamento...</p>
              <p className="text-xs text-[#9ca3af] text-center">Estamos verificando o status do seu pagamento automaticamente. Não feche esta janela.</p>
            </div>
            
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="w-full mt-6 py-2 border border-[#333845] text-[#9ca3af] hover:text-white hover:bg-[#1f2229] rounded-md transition-colors"
            >
              Fechar e acompanhar depois
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
