"use client";

import { Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  // Calcula o link final no client-side para suportar links relativos
  const fullLink = typeof window !== 'undefined' && link.startsWith('/')
    ? `${window.location.origin}${link}`
    : link;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex gap-2 mb-4 flex-col sm:flex-row">
      <div className="flex-1 bg-[#1f2229] border border-[#2c303a] rounded-md px-4 py-3 flex items-center overflow-hidden">
        <span className="text-[13px] text-white font-mono truncate">{fullLink}</span>
      </div>
      <button 
        onClick={handleCopy}
        className={`p-3 rounded-md transition-all shrink-0 font-bold flex items-center justify-center gap-2 ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-[#eab308] hover:bg-[#ca8a04] text-[#0f1115]'}`}
      >
        {copied ? (
          <>
            <CheckCircle2 size={20} /> <span className="sm:hidden">Copiado!</span>
          </>
        ) : (
          <>
            <Copy size={20} /> <span className="sm:hidden">Copiar</span>
          </>
        )}
      </button>
    </div>
  );
}
