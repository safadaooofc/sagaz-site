"use client";

import { Star, ThumbsUp, ChevronDown, X } from "lucide-react";
import { useState } from "react";

type Review = {
  id: number;
  author: string;
  initial: string;
  date: string;
  stars: number;
  title: string;
  content: string;
  helpful: number;
  images: number;
  isHelpfulClicked?: boolean;
};

const initialReviews: Review[] = [
  { id: 1, author: "Rlam Lucas", initial: "R", date: "31 de mar, de 2026", stars: 5, title: "mto bom", content: "mt bom, 10/10, melhores q tem", helpful: 0, images: 0 },
  { id: 2, author: "Vitor Hugo Scar face", initial: "V", date: "21 de mar, de 2026", stars: 5, title: "os meno e bom", content: "os cara sabe oque faz memo, 10/10 na mxm", helpful: 0, images: 0 },
  { id: 3, author: "Henrique Campos Lourenço", initial: "H", date: "11 de mar, de 2026", stars: 4, title: "500 facil 10", content: "Teclado ajazz shopee + kit upgrade ryzen 7 5700x e b550m aorus", helpful: 2, images: 3 },
  { id: 4, author: "João Pedro Cardozo Lima", initial: "J", date: "3 de mar, de 2026", stars: 5, title: "Loja 10/10", content: "Tudo funcionando certinho sem erro, posso comprar Novamente!", helpful: 0, images: 0 },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewStars, setNewReviewStars] = useState(5);

  const toggleHelpful = (id: number) => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        if (r.isHelpfulClicked) return { ...r, helpful: r.helpful - 1, isHelpfulClicked: false };
        return { ...r, helpful: r.helpful + 1, isHelpfulClicked: true };
      }
      return r;
    }));
  };

  const filteredReviews = reviews
    .filter(r => filterStar ? r.stars === filterStar : true)
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful;
      return 0; // Recent by default assuming array is sorted by date
    });

  return (
    <div className="font-sans max-w-[1000px] mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-[13px] px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Star size={16} fill="currentColor" /> Deixar Avaliação
        </button>
      </div>

      <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-6 mb-8">
        <h3 className="text-[13px] font-bold text-white mb-6">Avaliação Geral</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white leading-none mb-2">4.8</span>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="text-[#eab308]" fill="currentColor" />
              ))}
            </div>
            <p className="text-[11px] text-[#9ca3af] leading-tight text-center">
              {reviews.length} avaliações
            </p>
          </div>

          <div className="flex-1 w-full max-w-[600px] space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.stars === star).length;
              const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8 text-[11px] font-bold text-white justify-end">
                    {star} <Star size={10} className="text-[#eab308]" fill="currentColor" />
                  </div>
                  <div className="flex-1 h-2 bg-[#1f2229] rounded-full overflow-hidden">
                    <div className="h-full bg-[#eab308] rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="w-16 text-right text-[11px] text-[#6b7280]">
                    {pct}% <span className="text-[#4b5563]">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <span className="text-[13px] text-[#9ca3af] whitespace-nowrap">Filtrar por:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterStar(null)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${filterStar === null ? 'bg-[#eab308] text-[#0f1115]' : 'bg-[#1f2229] hover:bg-[#262933] text-white'}`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button 
                key={s} 
                onClick={() => setFilterStar(s)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors flex items-center gap-1 shrink-0 ${filterStar === s ? 'bg-[#eab308] text-[#0f1115]' : 'bg-[#1f2229] hover:bg-[#262933] text-white'}`}
              >
                {s} <Star size={10} className={filterStar === s ? "text-[#0f1115]" : "text-[#eab308]"} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[13px] text-[#9ca3af]">Ordenar:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as "recent" | "helpful")}
            className="bg-[#1f2229] border border-[#262933] text-white px-3 py-1.5 rounded-md text-[13px] font-bold focus:outline-none focus:border-[#eab308]"
          >
            <option value="recent">Mais recentes</option>
            <option value="helpful">Mais úteis</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-[#181a20] border border-[#1f2229] rounded-lg p-10 text-center">
            <p className="text-[13px] text-[#9ca3af]">Nenhuma avaliação encontrada com esse filtro.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-[#181a20] border border-[#1f2229] rounded-lg p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1f2229] border border-[#2c303a] flex items-center justify-center text-white font-bold shrink-0 text-sm">
                  {rev.initial}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[13px] text-white leading-none mb-1.5">{rev.author}</h4>
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
                      <div key={idx} className="w-16 h-16 rounded-md bg-[#1f2229] border border-[#262933]"></div>
                    ))}
                  </div>
                )}
                
                <button 
                  onClick={() => toggleHelpful(rev.id)}
                  className={`flex items-center gap-2 text-[11px] transition-colors font-medium ${rev.isHelpfulClicked ? 'text-[#eab308]' : 'text-[#6b7280] hover:text-white'}`}
                >
                  <ThumbsUp size={12} /> {rev.helpful} pessoas acharam útil
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#181a20] border border-[#1f2229] rounded-xl w-full max-w-[500px] p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Deixar Avaliação</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9ca3af] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-bold text-white mb-2">Nota</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setNewReviewStars(s)}>
                    <Star size={32} className={s <= newReviewStars ? "text-[#eab308]" : "text-[#262933]"} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[13px] font-bold text-white mb-2">Título</label>
                <input type="text" placeholder="Ex: Muito bom!" className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-[#4b5563] focus:outline-none focus:border-[#eab308]" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-white mb-2">Comentário</label>
                <textarea rows={4} placeholder="Escreva sua experiência..." className="w-full bg-[#0f1115] border border-[#1f2229] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-[#4b5563] focus:outline-none focus:border-[#eab308] resize-none"></textarea>
              </div>
            </div>

            <button onClick={() => setIsModalOpen(false)} className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115] font-bold text-[13px] py-3 rounded-lg transition-colors">
              Enviar Avaliação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
