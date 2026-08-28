"use client";

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-transform duration-300 z-50 flex items-center justify-center",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 hover:scale-110"
        )}
        aria-label="Tanya Asisten AI"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] bg-background border border-border/50 shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold font-poppins leading-tight">Pemandu Salawu</h3>
              <p className="text-xs opacity-80 font-sans">Online - Tanya apa saja!</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans bg-muted/10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <Bot className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Halo! Saya asisten AI Desa Salawu. Ada yang bisa saya bantu terkait UMKM atau Wisata hari ini?
              </p>
            </div>
          )}

          {messages.map(m => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3",
                m.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {m.role !== 'user' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl max-w-[80%] text-sm",
                  m.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm border border-border/50"
                )}
              >
                {/* Parse basic markdown like bold text manually if needed, or just plain text for now */}
                {m.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>

              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-muted text-foreground rounded-tl-sm border border-border/50 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Mengetik...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-background border-t border-border/50 flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-sans"
            value={input}
            placeholder="Tanya tentang Desa Salawu..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center shrink-0 h-10 w-10"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
