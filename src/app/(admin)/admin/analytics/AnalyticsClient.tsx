"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "./actions";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { Activity, DollarSign, Users, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1115]/90 border border-cyan-500/30 p-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <p className="text-cyan-400 font-bold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-white text-sm">
            <span style={{color: p.color}}>{p.name}: </span>
            <span className="font-mono">{p.name === 'receita' ? `R$ ${p.value.toFixed(2)}` : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin glow-cyan"></div>
    </div>;
  }


  return (
    <div className="font-sans space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Activity className="text-cyan-400" /> Inteligência Holográfica
        </h1>
        <p className="text-cyan-400/60 font-mono text-sm uppercase tracking-widest">Painel de Monitoramento do Sistema V2.0</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hologram Cards */}
        <div className="bg-gradient-to-br from-[#0f1115] to-[#181a20] border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-cyan-400/70 text-xs font-bold uppercase tracking-wider">Receita (7 dias)</p>
              <h2 className="text-2xl font-black text-white mt-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalRevenue)}
              </h2>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="h-12 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="receita" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f1115] to-[#181a20] border border-fuchsia-500/20 rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl group-hover:bg-fuchsia-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-fuchsia-400/70 text-xs font-bold uppercase tracking-wider">Membros Discord</p>
              <h2 className="text-2xl font-black text-white mt-1">{data.discordMembers}</h2>
            </div>
            <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 border border-fuchsia-500/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-fuchsia-400/70">
            <TrendingUp size={14} className="text-fuchsia-400" /> Sincronizado ao vivo
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f1115] to-[#181a20] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-emerald-400/70 text-xs font-bold uppercase tracking-wider">Sessões Ativas</p>
              <h2 className="text-2xl font-black text-white mt-1">{data.activeSessions}</h2>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <Activity size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400/70">
            Rastreamento de dispositivos (Logins)
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f1115] to-[#181a20] border border-orange-500/20 rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-orange-400/70 text-xs font-bold uppercase tracking-wider">Tickets Abertos</p>
              <h2 className="text-2xl font-black text-white mt-1">{data.discordTickets}</h2>
            </div>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-orange-400/70">
            Aguardando suporte no servidor
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 bg-[#13151a] border border-[#262933] rounded-xl p-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-400" /> Fluxo de Vendas (7 dias)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262933" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receita" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Produtos */}
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-6">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <DollarSign size={16} className="text-fuchsia-400" /> Produtos Mais Vendidos
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262933" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#262933', opacity: 0.4}} />
                <Bar dataKey="value" fill="#d946ef" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
