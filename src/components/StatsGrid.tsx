export function StatsGrid() {
  const stats = [
    { label: "SALDO", value: "R$ 0,00", sub: "Disponível para compras" },
    { label: "COMPRAS", value: "0", sub: "Cartões adquiridos" },
    { label: "TOTAL GASTO", value: "R$ 0,00", sub: "Desde o cadastro" },
    { label: "TICKET MÉDIO", value: "R$ 0,00", sub: "Por compra" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#181a20] border border-[#262933] p-6 rounded-lg flex flex-col justify-center">
          <p className="text-[11px] font-bold text-[#9ca3af] mb-1">{stat.label}</p>
          <h3 className="text-3xl font-bold text-white leading-none mb-1">{stat.value}</h3>
          <p className="text-xs text-[#6b7280]">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
