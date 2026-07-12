import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, FileText, User, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export const Route = createFileRoute("/hr/assistant")({
  component: AssistantPage,
});

interface Msg {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

const suggestions = [
  "What is the interview policy?",
  "What technologies are required for backend roles?",
  "Explain probation policy.",
  "Is Docker mandatory?",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m1",
      role: "assistant",
      text: "Hi! I'm your RecruitIQ assistant. Ask about company policies, interview procedures, role requirements, or candidate insights.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    setError(null);
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await api.post<{ text: string; sources: string[] }>("/assistant/chat", {
        query: text,
      });

      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: res.data.text,
          sources: res.data.sources,
        },
      ]);
      setSources(res.data.sources || []);
    } catch (err) {
      console.error(err);
      setError("Failed to get response from assistant. Please try again.");
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <PageHeader title="HR Assistant" description="Ask questions about policies, roles, or hiring workflows." />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="flex h-[calc(100vh-14rem)] flex-col border-border/60 shadow-[var(--shadow-card)]">
          <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-6">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing ? (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                  <Dot /><Dot delay="150ms" /><Dot delay="300ms" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-border/70 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); void send(input); }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); }
                }}
                placeholder="Ask about hiring, policies, or a candidate…"
                className="min-h-[44px] resize-none rounded-xl"
                rows={1}
              />
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl" disabled={typing}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" /> Prompt suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="w-full rounded-lg border border-border/70 p-3 text-left text-sm transition hover:border-primary/40 hover:bg-primary/5"
                >
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-[var(--shadow-card)]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-primary" /> Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {sources.length === 0 ? (
                <div className="text-xs text-muted-foreground py-2">
                  No sources cited yet. Ask a question to load source documents.
                </div>
              ) : (
                sources.map((s) => (
                  <div key={s} className="rounded-lg border border-border/70 p-2.5 text-xs bg-muted/35">
                    <div className="font-medium text-foreground">{s}</div>
                    <div className="text-muted-foreground">Cited from knowledge base</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  );
}
