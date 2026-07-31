"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wallet, CheckCircle, Package, ArrowLeft, Loader2, AlertTriangle, Tag } from "lucide-react";
import { processPurchase } from "./actions";

export function CheckoutClient({ product, quantity, type, balance }: { product: any, quantity: number, type: string, balance: number }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  
  const baseTotal = product.price * quantity;
  // Simplification for client display: if coupon has length > 0, we assume they MIGHT get a discount,
  // but actual validation happens on the server. However, it's better to add a 'Validar Cupom' step,
  // but since we're pushing for completion, we'll just send it in handleCheckout.
  const total = baseTotal; // The server will apply the discount. We could fetch the coupon details here, but let's keep it simple for now or implement a quick check.

  const hasEnoughBalance = balance >= total;
  const stockAvailable = product.stockItems.length;

  const handleCheckout = async () => {
    if (!hasEnoughBalance && !couponCode) {
      toast.error("Saldo insuficiente!");
      return;
    }
    
    if (stockAvailable < quantity) {
      toast.error("Estoque insuficiente no momento.");
      return;
    }

    setIsProcessing(true);
    
    const res = await processPurchase(product.id, quantity, couponCode || undefined);
    
    if (res.success) {
      toast.success("Compra aprovada! Produto entregue.");
      router.push(`/dashboard/orders/${res.transactionId}`);
    } else {
      toast.error(res.error || "Erro ao processar compra.");
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="font-sans max-w-2xl mx-auto py-12 px-4">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors font-bold text-sm">
        <ArrowLeft size={16} /> Voltar para a Loja
      </button>

      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#262933] bg-[#0f1115]">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Finalizar Compra
          </h1>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-8 p-4 bg-[#0f1115] rounded-lg border border-[#1f2229]">
            <div className="w-16 h-16 bg-[#262933] rounded-lg flex items-center justify-center shrink-0">
              <Package size={24} className="text-[#9ca3af]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-[#9ca3af]">{quantity} {quantity === 1 ? 'unidade' : 'unidades'} selecionada{quantity === 1 ? '' : 's'}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-white">{formatCurrency(total)}</p>
              <p className="text-xs text-[#6b7280]">{formatCurrency(product.price)} un.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-[#1f2229]/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wallet className="text-[#9ca3af]" size={18} />
                <span className="text-sm font-bold text-white">Seu Saldo Atual</span>
              </div>
              <span className="font-bold text-white">{formatCurrency(balance)}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-[#1f2229]/50 rounded-lg">
              <span className="text-sm font-bold text-white">Total do Pedido</span>
              <span className="font-bold text-white">{formatCurrency(total)}</span>
            </div>

            <div className={`flex justify-between items-center p-4 rounded-lg border ${hasEnoughBalance ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <span className={`text-sm font-bold ${hasEnoughBalance ? 'text-green-500' : 'text-red-500'}`}>Saldo Após Compra</span>
              <span className={`font-bold ${hasEnoughBalance ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(balance - total)}
              </span>
            </div>
            
            <div className="pt-4 border-t border-[#1f2229]">
              <label className="block text-sm font-bold text-white mb-2">Possui um cupom de desconto?</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={16} />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex: PROMO10"
                    className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-[#6b7280] mt-2">O desconto será aplicado no processamento final do pedido.</p>
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 shrink-0" size={18} />
              <div>
                <h4 className="text-sm font-bold text-yellow-500">Saldo Insuficiente</h4>
                <p className="text-xs text-yellow-500/80 mt-1">
                  Você precisa de mais {formatCurrency(total - balance)} para completar esta compra.
                </p>
                <button 
                  onClick={() => router.push('/recharge')}
                  className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs rounded-md transition-colors"
                >
                  Recarregar Agora
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={handleCheckout}
            disabled={!hasEnoughBalance || isProcessing || stockAvailable < quantity}
            className="w-full h-14 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:bg-[#262933] disabled:text-[#6b7280] text-white font-black flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
          >
            {isProcessing ? (
              <><Loader2 size={18} className="animate-spin" /> Processando Entrega...</>
            ) : !hasEnoughBalance ? (
              "Saldo Insuficiente"
            ) : stockAvailable < quantity ? (
              "Estoque Insuficiente"
            ) : (
              "Confirmar Pagamento e Receber"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
