"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MinesStatusContext = createContext<{ isActive: boolean }>({ isActive: false });

export function MinesStatusProvider({ children, initialIsActive }: { children: React.ReactNode, initialIsActive: boolean }) {
  const { data } = useSWR("/api/mines/status", fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds
    fallbackData: { isActive: initialIsActive }
  });

  const currentIsActive = data?.isActive || false;
  const [previousStatus, setPreviousStatus] = useState<boolean | null>(null);

  useEffect(() => {
    if (previousStatus !== null && currentIsActive !== previousStatus) {
      if (currentIsActive) {
        toast.success("O Evento de Mines acabou de começar! Acesse a aba Mines e boa sorte.", {
          duration: 6000,
          position: "top-center"
        });
        
        // Try to play sound if available (Optional, if they have one. Or standard beep)
        try {
          const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3");
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch(e) {}
      } else {
        toast.error("O evento de Mines terminou. Fique de olho para a próxima rodada!", {
          duration: 6000,
          position: "top-center"
        });
      }
    }
    setPreviousStatus(currentIsActive);
  }, [currentIsActive, previousStatus]);

  return (
    <MinesStatusContext.Provider value={{ isActive: currentIsActive }}>
      {children}
    </MinesStatusContext.Provider>
  );
}

export const useMinesStatus = () => useContext(MinesStatusContext);
