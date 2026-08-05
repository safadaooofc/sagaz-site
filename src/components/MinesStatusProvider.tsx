"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { toast } from "sonner";

const MinesStatusContext = createContext<{ isActive: boolean }>({ isActive: false });

export function MinesStatusProvider({ children, initialIsActive }: { children: React.ReactNode, initialIsActive: boolean }) {
  const [currentIsActive, setCurrentIsActive] = useState(initialIsActive);
  const previousStatus = useRef<boolean>(initialIsActive);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/mines/status");
        if (res.ok) {
          const data = await res.json();
          setCurrentIsActive(data.isActive);
        }
      } catch (err) {
        // ignore network errors for polling
      }
    };

    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIsActive !== previousStatus.current) {
      if (currentIsActive) {
        toast.success("O Evento de Mines acabou de começar! Acesse a aba Mines e boa sorte.", {
          duration: 6000,
          position: "top-center"
        });
        
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
      previousStatus.current = currentIsActive;
    }
  }, [currentIsActive]);

  return (
    <MinesStatusContext.Provider value={{ isActive: currentIsActive }}>
      {children}
    </MinesStatusContext.Provider>
  );
}

export const useMinesStatus = () => useContext(MinesStatusContext);

