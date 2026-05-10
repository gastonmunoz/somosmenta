"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hola, soy el asistente de Calton. ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros servicios, responder preguntas frecuentes o ayudarte a armar tu próximo evento.",
};

const CALENDLY_RE = /(https?:\/\/cal\.com\/\S+)/;

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const parts = msg.content.split(CALENDLY_RE);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? "bg-[var(--sage)] text-white rounded-tr-sm"
            : "bg-[var(--sage-light)] text-[var(--black)] rounded-tl-sm"
        }`}
      >
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 font-medium"
            >
              {part}
            </a>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error();

      const { content, leadCaptured: captured } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content }]);
      if (captured) setLeadCaptured(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hubo un problema al conectar. Escribinos directamente desde el formulario de contacto.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="w-80 max-h-[480px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-black/5"
            style={{ background: "#fff" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--sage)]">
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-semibold text-white"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Calton — Asistente
                </span>
                {leadCaptured && (
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
                    Registro enviado
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 min-h-0">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--sage-light)] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[var(--sage)]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-black/5 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                placeholder="Escribí un mensaje..."
                className="flex-1 text-[13px] bg-[#F5F5F5] rounded-xl px-3.5 py-2 outline-none placeholder:text-[var(--gray-text)] text-[var(--black)] disabled:opacity-50"
                style={{ fontFamily: "var(--font-inter)" }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl bg-[var(--sage)] flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0 self-end"
                aria-label="Enviar"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[var(--sage)] text-white flex items-center justify-center shadow-lg"
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
