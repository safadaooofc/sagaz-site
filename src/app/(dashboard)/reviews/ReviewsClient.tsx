"use client";

import { Star, ThumbsUp, ChevronDown, X, Upload } from "lucide-react";
import { useState } from "react";

type Review = {
  id: string | number;
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



import { createStoreReview } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ReviewsClient({ serverReviews }: { serverReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(serverReviews);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewStars, setNewReviewStars] = useState(5);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) return toast.error("Preencha título e comentário.");
    setIsSubmitting(true);
    const res = await createStoreReview(newReviewStars, title, content);
    setIsSubmitting(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Avaliação enviada!");
      setIsModalOpen(false);
      router.refresh(); // Refresh page to get new reviews
    }
  };


  const toggleHelpful = (id: string | number) => {
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
              className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${filterStar === null ? 'border border-[#eab308] text-[#eab308] bg-transparent' : 'bg-[#1f2229] hover:bg-[#262933] text-white'}`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button 
                key={s} 
                onClick={() => setFilterStar(s)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors flex items-center gap-1.5 shrink-0 ${filterStar === s ? 'border border-[#eab308] text-[#eab308] bg-transparent' : 'bg-[#1f2229] hover:bg-[#262933] text-white'}`}
              >
                {s} <Star size={10} className="text-[#eab308]" fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[13px] text-[#9ca3af]">Ordenar:</span>
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`flex items-center justify-between gap-2 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors min-w-[140px] ${isSortOpen ? 'border border-[#eab308] text-white bg-transparent' : 'bg-[#1f2229] hover:bg-[#262933] text-white border border-transparent'}`}
            >
              {sortBy === "recent" ? "Mais recentes" : "Mais úteis"}
              <ChevronDown size={14} className="text-[#9ca3af]" />
            </button>
            
            {isSortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-[160px] bg-[#181a20] border border-[#1f2229] rounded-xl shadow-xl overflow-hidden z-50 py-1">
                  <button
                    onClick={() => { setSortBy("recent"); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-bold hover:bg-[#1f2229] transition-colors ${sortBy === "recent" ? "text-[#eab308]" : "text-white"}`}
                  >
                    Mais recentes
                  </button>
                  <button
                    onClick={() => { setSortBy("helpful"); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-bold hover:bg-[#1f2229] transition-colors ${sortBy === "helpful" ? "text-[#eab308]" : "text-white"}`}
                  >
                    Mais úteis
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold hover:bg-[#1f2229] transition-colors text-white"
                  >
                    Maior nota
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-[13px] font-bold hover:bg-[#1f2229] transition-colors text-white"
                  >
                    Menor nota
                  </button>
                </div>
              </>
            )}
          </div>
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
          <div className="bg-[#111214] border border-[#262933] rounded-xl w-full max-w-[500px] p-6 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Deixe sua Avaliação</h2>
                <p className="text-[13px] text-[#9ca3af]">Compartilhe sua experiência conosco. Sua opinião é muito importante!</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9ca3af] hover:text-white mt-1">
                <X size={18} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-bold text-white mb-2">Sua Avaliação *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setNewReviewStars(s)}>
                    <Star size={28} className={s <= newReviewStars ? "text-[#eab308]" : "text-[#4b5563]"} fill={s <= newReviewStars ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-[13px] font-bold text-white mb-2">Título *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resuma sua experiência em poucas palavras" className="w-full bg-[#181a20] border border-[#262933] rounded-lg px-4 py-3 text-white text-[13px] placeholder-[#4b5563] focus:outline-none focus:border-[#4b5563] transition-colors" />
                <p className="text-[11px] text-[#4b5563] mt-1.5">0/100 caracteres</p>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-white mb-2">Seu Comentário *</label>
                <textarea rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="Conte-nos mais sobre sua experiência..." className="w-full bg-[#181a20] border border-[#262933] rounded-lg px-4 py-3 text-white text-[13px] placeholder-[#4b5563] focus:outline-none focus:border-[#4b5563] resize-none transition-colors"></textarea>
                <p className="text-[11px] text-[#4b5563] mt-1.5">0/1000 caracteres</p>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-white mb-0.5">Imagens (Opcional)</label>
                <p className="text-[11px] text-[#9ca3af] mb-3">Adicione até 5 imagens (máx 16MB cada)</p>
                <div className="border border-dashed border-[#262933] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#4b5563] transition-colors bg-[#181a20]/50">
                  <Upload size={24} className="text-[#6b7280] mb-3" />
                  <span className="text-[13px] text-[#6b7280]">Clique para adicionar imagens</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-white bg-transparent border border-[#262933] hover:bg-[#181a20] transition-colors">
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-[#0f1115] bg-[#eab308] hover:bg-[#ca8a04] transition-colors">{isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
