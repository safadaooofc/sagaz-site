"use client";

import { useMemo, useState } from "react";
import { Ticket, Percent, Plus, ShieldBan, CheckCircle, Trash2, TrendingUp, Users } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#181a20] border border-[#262933] p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        <p className="text-sm text-fuchsia-400">Usos: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

import { deleteRewardCode, toggleRewardCodeActive } from "../marketing/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CouponsClient({ coupons }: { coupons: any[] }) {
  const router = useRouter();
  
  // Calculate analytics
  const { chartData, topCoupons } = useMemo(() => {
    // Generate usage over time (last 7 days approx)
    const usageDates: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      usageDates[dateStr] = 0;
    }

    coupons.forEach(c => {
      c.usages.forEach((u: any) => {
        const dStr = new Date(u.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        if (usageDates[dStr] !== undefined) {
          usageDates[dStr]++;
        }
      });
    });

    const cData = Object.keys(usageDates).map(date => ({
      data: date,
      Usos: usageDates[date]
    }));

    // Top Coupons
    const top = [...coupons].sort((a, b) => b.used - a.used).slice(0, 5).map(c => ({
      name: c.code,
      Usos: c.used
    }));

    return { chartData: cData, topCoupons: top };
  }, [coupons]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar permanentemente este cupom?")) return;
    const res = await deleteRewardCode(id);
    if (res.success) toast.success("Apagado!");
    else toast.error(res.error);
  };

  const handleToggle = async (id: string, active: boolean) => {
    const res = await toggleRewardCodeActive(id, !active);
    if (res.success) toast.success("Status alterado!");
    else toast.error(res.error);
  };


  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Ticket className="text-fuchsia-400" /> Sistema de Cupons
          </h1>
          <p className="text-[#9ca3af]">Análise profunda de descontos e conversões.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/marketing')}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)]"
        >
          <Plus size={18} /> Criar Novo (Via Drops)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-fuchsia-400" /> 
            Uso de Cupons (Últimos 7 Dias)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262933" vertical={false} />
                <XAxis dataKey="data" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Usos" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorUsos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-cyan-400" /> 
            Top 5 Cupons Mais Usados
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCoupons} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262933" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1f2229' }} />
                <Bar dataKey="Usos" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Lista de Cupons de Desconto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {coupons.map(code => (
          <div key={code.id} className={`bg-[#181a20] border ${code.active ? 'border-fuchsia-500/30' : 'border-[#262933] opacity-60'} rounded-xl p-5 relative transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="text-fuchsia-400" size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af]">Desconto</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">{code.code}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleToggle(code.id, code.active)} className={`p-1.5 rounded-md ${code.active ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {code.active ? <ShieldBan size={14} /> : <CheckCircle size={14} />}
                </button>
                <button onClick={() => handleDelete(code.id)} className="p-1.5 rounded-md bg-[#0f1115] text-[#6b7280] hover:bg-red-500 hover:text-white">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="bg-[#0f1115] p-3 rounded-lg border border-[#262933] mb-4 text-center">
              <p className="text-2xl font-black text-fuchsia-400">{code.value}% OFF</p>
            </div>

            <div className="flex justify-between items-center text-xs text-[#6b7280] font-mono mb-2">
              <span>Usos: {code.used} / {code.maxUses}</span>
            </div>
            
            {code.usages && code.usages.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#262933]">
                <p className="text-[10px] text-[#9ca3af] uppercase font-bold mb-1">Último uso:</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#262933] overflow-hidden shrink-0">
                    {code.usages[0].user?.image && <img src={code.usages[0].user.image} alt="User" />}
                  </div>
                  <span className="text-xs text-white truncate">{code.usages[0].user?.name || 'Usuário'}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
