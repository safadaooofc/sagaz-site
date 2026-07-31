"use client";

import { useMemo } from "react";
import { Gift, Zap, Package, Plus, ShieldBan, CheckCircle, Trash2, PieChart, Info } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { deleteRewardCode, toggleRewardCodeActive } from "../marketing/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function GiftsClient({ gifts, products }: { gifts: any[], products: any[] }) {
  const router = useRouter();
  
  // Calculate analytics
  const { typeChartData, adminChartData } = useMemo(() => {
    // Gift Types
    let balanceCount = 0;
    let productCount = 0;
    let boostCount = 0;

    // Admin Creation
    const adminCount: Record<string, number> = {};

    gifts.forEach(g => {
      if (g.type === 'BALANCE') balanceCount++;
      if (g.type === 'PRODUCT') productCount++;
      if (g.type === 'RECHARGE_BONUS') boostCount++;

      const adminName = g.createdBy?.name || 'Desconhecido';
      adminCount[adminName] = (adminCount[adminName] || 0) + 1;
    });

    const tData = [
      { name: 'Saldo (R$)', value: balanceCount, color: '#4ade80' },
      { name: 'Produtos', value: productCount, color: '#22d3ee' },
      { name: 'Boosts', value: boostCount, color: '#eab308' }
    ].filter(d => d.value > 0);

    const aData = Object.keys(adminCount).map((name, i) => ({
      name,
      value: adminCount[name],
      color: ['#8b5cf6', '#ec4899', '#f43f5e', '#f97316'][i % 4]
    }));

    return { typeChartData: tData, adminChartData: aData };
  }, [gifts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar permanentemente este gift card?")) return;
    const res = await deleteRewardCode(id);
    if (res.success) toast.success("Apagado!");
    else toast.error(res.error);
  };

  const handleToggle = async (id: string, active: boolean) => {
    const res = await toggleRewardCodeActive(id, !active);
    if (res.success) toast.success("Status alterado!");
    else toast.error(res.error);
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'BALANCE': return <Gift className="text-green-400" size={16} />;
      case 'PRODUCT': return <Package className="text-cyan-400" size={16} />;
      case 'RECHARGE_BONUS': return <Zap className="text-yellow-400" size={16} />;
      default: return <Gift className="text-white" size={16} />;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181a20] border border-[#262933] p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold">{payload[0].name}</p>
          <p className="text-sm" style={{ color: payload[0].payload.color }}>Quantidade: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Gift className="text-green-400" /> Gift Cards & Drops
          </h1>
          <p className="text-[#9ca3af]">Análise de gifts criados e registro de atividades de Admin.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/marketing')}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          <Plus size={18} /> Criar Novo (Via Drops)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-green-400" /> 
            Tipos de Gifts Criados
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={typeChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {typeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldBan size={18} className="text-purple-400" /> 
            Gifts Gerados por Admin
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={adminChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {adminChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Lista Completa de Gifts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map(code => (
          <div key={code.id} className={`bg-[#181a20] border ${code.active ? 'border-green-500/30' : 'border-[#262933] opacity-60'} rounded-xl p-5 relative transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeIcon(code.type)}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">
                    {code.type === 'BALANCE' ? 'Saldo' : code.type === 'PRODUCT' ? 'Produto' : 'Boost'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider truncate max-w-[200px]">{code.code}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggle(code.id, code.active)} className={`p-1.5 rounded-md ${code.active ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {code.active ? <ShieldBan size={14} /> : <CheckCircle size={14} />}
                </button>
                <button onClick={() => handleDelete(code.id)} className="p-1.5 rounded-md bg-[#0f1115] text-[#6b7280] hover:bg-red-500 hover:text-white">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#262933] mb-4">
              {code.type === 'BALANCE' && <p className="text-lg font-black text-green-400">R$ {code.value?.toFixed(2)}</p>}
              {code.type === 'RECHARGE_BONUS' && <p className="text-lg font-black text-yellow-400">+{code.value}% Bônus</p>}
              {code.type === 'PRODUCT' && (
                <p className="text-sm font-bold text-cyan-400 truncate">
                  {products.find(p => p.id === code.productId)?.name || "Produto não encontrado"}
                </p>
              )}
            </div>

            <div className="space-y-2 mt-4 text-xs border-t border-[#262933] pt-4">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Gerado por:</span>
                <span className="text-white font-bold">{code.createdBy?.name || 'Sistema'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Usos:</span>
                <span className="text-white font-bold">{code.used} / {code.maxUses}</span>
              </div>
              
              {code.usages && code.usages.length > 0 && (
                <div className="mt-2 p-2 bg-[#262933]/30 rounded-md">
                  <p className="text-[10px] text-[#9ca3af] uppercase font-bold mb-1">Último uso:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#262933] overflow-hidden shrink-0">
                      {code.usages[0].user?.image && <img src={code.usages[0].user.image} alt="User" />}
                    </div>
                    <span className="text-white truncate">{code.usages[0].user?.name || 'Usuário'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
