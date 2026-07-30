import { prisma } from "@/lib/prisma";
import { Star, Trash2 } from "lucide-react";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Moderação de Avaliações</h1>
      <p className="text-[#9ca3af] mb-8">Apague avaliações falsas ou revise feedbacks de clientes.</p>
      
      <div className="bg-[#181a20] border border-[#262933] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-[#9ca3af]">
          <thead className="bg-[#1f2229] border-b border-[#262933]">
            <tr>
              <th className="px-6 py-4 font-bold text-white">Cliente / Produto</th>
              <th className="px-6 py-4 font-bold text-white">Nota</th>
              <th className="px-6 py-4 font-bold text-white">Comentário</th>
              <th className="px-6 py-4 font-bold text-white text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} className="border-b border-[#262933] hover:bg-[#1f2229]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-bold">{review.user.name}</div>
                  <div className="text-xs text-[#6b7280]">Produto: {review.product?.name || "Geral"}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-[#4b5563]"} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-[300px] truncate">
                  {review.comment || <span className="italic text-[#4b5563]">Sem comentário</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[11px] text-red-500 font-bold bg-red-500/10 hover:bg-red-500/20 transition-colors px-3 py-1.5 rounded-md flex items-center justify-end gap-1 ml-auto">
                    <Trash2 size={12} /> Apagar
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#6b7280]">Nenhuma avaliação registrada ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
