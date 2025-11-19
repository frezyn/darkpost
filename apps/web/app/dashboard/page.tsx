"use client"

import { Suspense, useState } from "react"
import { format, startOfMonth, isSameMonth, isToday, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Upload, List, Calendar as CalendarIcon, Pencil } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { DayPostsDialog } from "./dayPostsDialog"
import { cn } from "@workspace/ui/lib/utils"
import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog"
import Schedulevideodialog from "./posts/dialogpost"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/utils/trpc"
import { ScheduledPostCard } from "./posts/postsrow"
import { error } from "console"
import { Platform } from "./posts/postsrow"
import { Toaster } from "sonner"
import colors from "tailwindcss/colors"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

// Dados simulados (substitua por seu fetch real)
const postsByDate: Record<string, any[]> = {
  "2025-11-17": [
    { id: "1", title: "Lançamento do novo produto!", time: "14:30", platforms: "Instagram, LinkedIn" },
    { id: "2", title: "Live com o time", time: "19:00", platforms: "YouTube" },
  ],
}


export default function PostsPage() {
  const [view, setView] = useState<"list" | "calendar">("list")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const trpc = useTRPC()


  const monthStart = startOfMonth(currentMonth)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    return d
  })

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setDialogOpen(true)
  }

  const posts = useQuery(trpc.providers.GetAllPostsFromAccount.queryOptions())

  const hasAnyPosts = posts?.data?.accounts?.length! > 0
  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null
  const dayPosts = selectedKey ? postsByDate[selectedKey] || [] : []

  return (
    <>
      <Toaster />
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6 md:px-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">Posts</h1>
              <p className="text-muted-foreground">Gerencie seus posts agendados e publicados</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Schedulevideodialog />
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Importar CSV
                </Button>
              </div>

              <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                <TabsList>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="h-4 w-4" /> Lista
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-2">
                    <CalendarIcon className="h-4 w-4" /> Calendário
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 md:px-6">
        {view === "list" ? (

          hasAnyPosts ? (
            <Card className="border bg-card/50">
              <div className="p-24 text-center space-y-3 text-muted-foreground">
                {posts.data?.accounts.map((post) => (
                  <ScheduledPostCard
                    id={post.id}
                    thumbnailUrl={post.socialAccount.user.image!}
                    title={post.caption!}
                    scheduledAt={new Date(post.scheduledAt!)}
                    createdAt={new Date(post.createdAt!)}
                    createdBy={post.socialAccount.user.name!}
                    status={post.status!}
                    platforms={
                      [...post.socialAccount.connectedAccounts.map((conta) => {
                        return {
                          platform: conta.platform as Platform,
                          username: conta.displayName!,
                          error: ""
                        }
                      })]
                    }

                    onEdit={() => console.log("edit")}
                    onRetry={() => console.log("retry")}
                    onDelete={() => console.log("delete")}
                  />
                ))}
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Pencil className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mt-8 text-2xl font-semibold tracking-tight">Nenhum post ainda</h2>
              <p className="mt-2 text-muted-foreground">Crie seu primeiro post para redes sociais</p>
              <Button className="mt-10 bg-yellow-500 text-black hover:bg-yellow-600 font-medium">
                Criar post
              </Button>
            </div>
          )
        ) : (
          /* VISÃO DE CALENDÁRIO */
          <Card className="overflow-hidden border-0 bg-zinc-900 shadow-2xl">
            <div className="bg-zinc-900 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    {format(currentMonth, "MMMM 'de' yyyy")}
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const hoje = new Date()
                      setCurrentMonth(hoje)
                      setSelectedDate(hoje)
                    }}
                  >
                    Hoje
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-8">
              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 gap-0 border-b border-zinc-800 pb-4 text-center text-sm font-medium text-zinc-400">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-0">
                {days.map((day, i) => {
                  const key = format(day, "yyyy-MM-dd")
                  const count = postsByDate[key]?.length || 0
                  const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === key

                  return (
                    <button
                      key={i}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "relative h-32 border border-zinc-800 bg-zinc-900 p-3 text-left transition-all duration-300",
                        "hover:bg-zinc-800",
                        !isSameMonth(day, currentMonth) && "text-zinc-600",
                        isToday(day) && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-950",
                        isSelected && "z-10 ring-4 ring-yellow-500 ring-offset-4 ring-offset-zinc-950 shadow-2xl shadow-yellow-500/40"
                      )}
                    >
                      <span className={cn("text-lg font-medium transition-colors", isSelected && "text-yellow-400")}>
                        {format(day, "d")}
                      </span>

                      {count > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {Array.from({ length: Math.min(count, 8) }).map((_, idx) => (
                            <div key={idx} className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                          ))}
                          {count > 8 && <span className="text-xs text-yellow-500">+{count - 8}</span>}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Dialog com posts do dia */}
      <DayPostsDialog date={selectedDate} posts={dayPosts} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
