import { Search } from "lucide-react";

export function HistoryTable() {
  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-[360px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input 
            type="text"
            placeholder="Buscar compras..."
            className="w-full bg-[#181a20] border border-transparent rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#262933] transition-colors"
          />
        </div>
        <button className="bg-[#181a20] hover:bg-[#1f2229] border border-[#262933] text-white px-4 py-2 rounded-md text-[13px] font-bold transition-colors">
          + Nova Compra
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-[13px] text-[#9ca3af]">
          <thead>
            <tr className="border-b border-[#262933]">
              <th className="font-normal py-4 px-2">Produto</th>
              <th className="font-normal py-4 px-2 text-center">Quantidade</th>
              <th className="font-normal py-4 px-2 text-center">Total</th>
              <th className="font-normal py-4 px-2 text-center">Data</th>
              <th className="font-normal py-4 px-2 text-center">Status</th>
              <th className="font-normal py-4 px-2 text-right">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-primary hover:underline font-medium text-xs">Ver Resgate</button>
              </td>
            </tr>
            */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
