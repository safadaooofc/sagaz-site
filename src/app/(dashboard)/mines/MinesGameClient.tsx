"use client";

import { useState } from "react";
import { toast } from "sonner";
import { startGame, revealCell, cashOut } from "./actions";
import { Bomb, Diamond, Loader2 } from "lucide-react";

export function MinesGameClient({ baseMultiplier, maxBet, initialBalance }: { baseMultiplier: number, maxBet: number, initialBalance: number }) {
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState("10");
  const [bombsCount, setBombsCount] = useState(3);
  
  const [gameId, setGameId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clickedCells, setClickedCells] = useState<number[]>([]);
  const [revealedBombs, setRevealedBombs] = useState<number[]>([]);
  const [currentMult, setCurrentMult] = useState(1);
  const [gameOverStatus, setGameOverStatus] = useState<"BUST" | "CASHOUT" | null>(null);

  const start = async () => {
    const betNum = parseFloat(bet);
    if (isNaN(betNum) || betNum <= 0) return toast.error("Aposta inválida");
    if (betNum > balance) return toast.error("Saldo insuficiente");
    
    setLoading(true);
    const res = await startGame(betNum, bombsCount) as any;
    if (res.success) {
      setGameId(res.gameId);
      setPlaying(true);
      setClickedCells([]);
      setRevealedBombs([]);
      setCurrentMult(1);
      setGameOverStatus(null);
      setBalance(res.newBalance);
      toast.success("Jogo iniciado! Boa sorte.");
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  const handleCellClick = async (index: number) => {
    if (!playing || clickedCells.includes(index) || loading || gameOverStatus) return;
    
    setLoading(true);
    const res = await revealCell(gameId!, index) as any;
    if (res.success) {
      if (res.status === "BUST") {
        setRevealedBombs(res.board);
        setPlaying(false);
        setGameOverStatus("BUST");
        toast.error("BOMBA! Você perdeu a aposta.");
      } else {
        setClickedCells(prev => [...prev, index]);
        setCurrentMult(res.currentMultiplier);
      }
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  const handleCashOut = async () => {
    if (!playing || clickedCells.length === 0 || loading) return;
    
    setLoading(true);
    const res = await cashOut(gameId!) as any;
    if (res.success) {
      setRevealedBombs(res.bombs);
      setPlaying(false);
      setGameOverStatus("CASHOUT");
      setBalance(prev => prev + res.profit);
      toast.success(`Você retirou R$${res.profit.toFixed(2)}!`);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="font-sans space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Bomb className="text-red-500" /> Casino Mines
        </h1>
        <p className="text-[#9ca3af]">Ache os diamantes e multiplique seu saldo. Cuidado com as bombas!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Controls */}
        <div className="bg-[#13151a] border border-[#262933] rounded-xl p-6 h-fit space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#9ca3af] uppercase">Valor da Aposta</label>
              <span className="text-xs text-[#6b7280]">Max: R${maxBet}</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280] font-bold">R$</span>
              <input 
                type="number" 
                value={bet}
                onChange={e => setBet(e.target.value)}
                disabled={playing}
                className="w-full bg-[#0f1115] border border-[#262933] rounded-lg pl-10 pr-4 py-3 text-white font-bold outline-none focus:border-red-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#9ca3af] uppercase">Quantidade de Bombas</label>
              <span className="text-xs text-[#6b7280]">{bombsCount} Bombas</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="24" 
              value={bombsCount}
              onChange={e => setBombsCount(parseInt(e.target.value))}
              disabled={playing}
              className="w-full accent-red-500"
            />
          </div>

          {!playing ? (
            <button 
              onClick={start} 
              disabled={loading || parseFloat(bet) > balance}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-black py-4 rounded-xl transition-colors text-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "APOSTAR"}
            </button>
          ) : (
            <button 
              onClick={handleCashOut} 
              disabled={loading || clickedCells.length === 0}
              className="w-full bg-[#eab308] hover:bg-[#ca8a04] disabled:bg-gray-700 text-black font-black py-4 rounded-xl transition-colors text-lg flex flex-col items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <span>RETIRAR</span>
                  <span className="text-sm">R$ {(parseFloat(bet) * currentMult).toFixed(2)}</span>
                </>
              )}
            </button>
          )}

          <div className="pt-4 border-t border-[#262933]">
            <p className="text-center text-sm text-[#9ca3af]">Saldo Atual: <span className="text-white font-bold">R$ {balance.toFixed(2)}</span></p>
          </div>
        </div>

        {/* Game Grid */}
        <div className="lg:col-span-2 bg-[#13151a] border border-[#262933] rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Status Overlay */}
          {gameOverStatus && (
            <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-sm animate-in fade-in">
              <div className={`p-8 rounded-2xl border-2 font-black text-3xl shadow-2xl flex flex-col items-center gap-2 ${
                gameOverStatus === "BUST" 
                  ? "bg-red-500/20 border-red-500 text-red-500" 
                  : "bg-green-500/20 border-green-500 text-green-500"
              }`}>
                {gameOverStatus === "BUST" ? <><Bomb size={48} /> PERDEU</> : <><Diamond size={48} /> R$ {(parseFloat(bet) * currentMult).toFixed(2)}</>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 w-full max-w-md aspect-square">
            {Array.from({ length: 25 }).map((_, i) => {
              const isClicked = clickedCells.includes(i);
              const isRevealedBomb = revealedBombs.includes(i);
              
              let bg = "bg-[#262933] hover:bg-[#374151]";
              if (isClicked) bg = "bg-[#181a20] border-2 border-green-500 shadow-[inset_0_0_15px_rgba(34,197,94,0.2)]";
              if (isRevealedBomb) bg = "bg-red-500 border-2 border-red-600 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]";

              return (
                <button
                  key={i}
                  disabled={!playing || isClicked}
                  onClick={() => handleCellClick(i)}
                  className={`${bg} rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed`}
                >
                  <div className={`transition-all duration-300 ${isClicked || isRevealedBomb ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                    {isRevealedBomb ? (
                      <Bomb className="text-black w-8 h-8 md:w-10 md:h-10" />
                    ) : (
                      <Diamond className="text-cyan-400 w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 flex gap-8">
            <div className="text-center">
              <p className="text-[#9ca3af] text-sm uppercase font-bold">Multiplicador</p>
              <p className="text-2xl font-black text-cyan-400">{currentMult.toFixed(2)}x</p>
            </div>
            <div className="text-center">
              <p className="text-[#9ca3af] text-sm uppercase font-bold">Lucro Potencial</p>
              <p className="text-2xl font-black text-green-500">R$ {playing ? (parseFloat(bet) * currentMult).toFixed(2) : "0.00"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
