import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, FileText, User } from "lucide-react";
import { PageHeader } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hr/assistant")({
  component: AssistantPage,
});

interface Msg { id: string; role: "user" | "assistant"; text: string }

const suggestions = [
  "What is the interview policy?",
  "What technologies are required for backend roles?",
  "Explain probation policy.",
  "Is Docker mandatory?",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m1", role: "assistant", text: "Hi Alex 👋 I'm your RecruitIQ assistant. Ask about hiring policies, role requirements, or candidate insights." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, user]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            "Based on your company handbook, technical roles follow a 4-stage interview: recruiter screen, technical, system design and hiring manager. Docker and cloud (AWS or GCP) proficiency is recommended for backend positions.",
        },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      <PageHeader title="HR Assistant" description="Ask questions about policies, roles, or hiring workflows." />

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
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
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
                  onClick={() => send(s)}
                  className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                placeholder="Ask about hiring, policies, or a candidate…"
                className="min-h-[44px] resize-none rounded-xl"
                rows={1}
              />
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl">
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
                  onClick={() => send(s)}
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
              {[
                "Employee handbook v3.2",
                "Interview policy — 2025",
                "Backend role profile",
              ].map((s) => (
                <div key={s} className="rounded-lg border border-border/70 p-2.5 text-xs">
                  <div className="font-medium">{s}</div>
                  <div className="text-muted-foreground">Cited in last response</div>
                </div>
              ))}
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
