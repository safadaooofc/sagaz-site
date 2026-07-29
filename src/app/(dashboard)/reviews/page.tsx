import { Star, ThumbsUp, ChevronDown } from "lucide-react";

export default function ReviewsPage() {
  const reviews = [
    {
      author: "Rlam Lucas",
      initial: "R",
      date: "31 de mar, de 2026",
      stars: 5,
      title: "mto bom",
      content: "mt bom, 10/10, melhores q tem",
      helpful: 0,
      images: 0,
    },
    {
      author: "Vitor Hugo Scar face",
      initial: "V",
      date: "21 de mar, de 2026",
      stars: 5,
      title: "os meno e bom",
      content: "os cara sabe oque faz memo, 10/10 na mxm",
      helpful: 0,
      images: 0,
    },
    {
      author: "Henrique Campos Lourenço",
      initial: "H",
      date: "11 de mar, de 2026",
      stars: 5,
      title: "500 facil 10",
      content: "Teclado ajazz shopee + kit upgrade ryzen 7 5700x e b550m aorus",
      helpful: 2,
      images: 3,
    },
    {
      author: "João Pedro Cardozo Lima",
      initial: "J",
      date: "3 de mar, de 2026",
      stars: 5,
      title: "Loja 10/10",
      content: "Tudo funcionando certinho sem erro, posso comprar Novamente!",
      helpful: 0,
      images: 0,
    },
  ];

  return (
    <div className="font-sans max-w-[1000px] mx-auto">
      <div className="mb-6">
        <button className="bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-sm px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <Star size={16} fill="currentColor" /> Deixar Avaliação
        </button>
      </div>

      <div className="bg-[#181a20] border border-[#262933] rounded-lg p-6 mb-8">
        <h3 className="text-sm font-bold text-white mb-6">Avaliação Geral</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white leading-none mb-2">5.0</span>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="text-[#eab308]" fill="currentColor" />
              ))}
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-tight text-center">
              105 avaliações<br />
              105 com fotos
            </p>
          </div>

          <div className="flex-1 w-full max-w-[600px] space-y-2">
            {[
              { star: 5, pct: "98%", count: 103 },
              { star: 4, pct: "1%", count: 2 },
              { star: 3, pct: "1%", count: 1 },
              { star: 2, pct: "0%", count: 0 },
              { star: 1, pct: "0%", count: 0 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8 text-[11px] font-bold text-white justify-end">
                  {row.star} <Star size={10} className="text-[#eab308]" fill="currentColor" />
                </div>
                <div className="flex-1 h-2 bg-[#262933] rounded-full overflow-hidden">
                  <div className="h-full bg-[#eab308] rounded-full" style={{ width: row.pct }}></div>
                </div>
                <div className="w-16 text-right text-[11px] text-[#6b7280]">
                  {row.pct} <span className="text-[#4b5563]">({row.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#9ca3af]">Filtrar por:</span>
          <div className="flex gap-2">
            <button className="bg-[#eab308] text-[#0f1115] px-3 py-1.5 rounded-full text-[12px] font-bold">Todas</button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button key={s} className="bg-[#1f2229] hover:bg-[#262933] text-white px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors flex items-center gap-1">
                {s} <Star size={10} className="text-[#eab308]" fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#9ca3af]">Ordenar:</span>
          <button className="bg-[#1f2229] border border-[#262933] text-white px-3 py-1.5 rounded-md text-[13px] font-bold flex items-center gap-2">
            Mais recentes <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev, i) => (
          <div key={i} className="bg-[#181a20] border border-[#262933] rounded-lg p-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#262933] flex items-center justify-center text-white font-bold shrink-0">
                {rev.initial}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[14px] text-white leading-none mb-1.5">{rev.author}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= rev.stars ? "text-[#eab308]" : "text-[#262933]"} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6b7280]">{rev.date}</span>
                </div>
              </div>
            </div>
            
            <div className="pl-14">
              <h5 className="font-bold text-[13px] text-white mb-1">{rev.title}</h5>
              <p className="text-[13px] text-[#9ca3af] leading-relaxed mb-3">{rev.content}</p>
              
              {rev.images > 0 && (
                <div className="flex gap-2 mb-3">
                  {Array.from({ length: rev.images }).map((_, idx) => (
                    <div key={idx} className="w-16 h-16 rounded bg-[#262933]"></div>
                  ))}
                </div>
              )}
              
              <button className="flex items-center gap-2 text-[11px] text-[#6b7280] hover:text-white transition-colors font-medium">
                <ThumbsUp size={12} /> {rev.helpful} pessoas acharam útil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
