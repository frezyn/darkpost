// src/components/posts/DayPostsDialog.tsx
import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"
import { Calendar, Plus } from "lucide-react"
import { format } from "date-fns"

type Post = {
  id: string
  title: string
  time: string
  platforms: string
}

type DayPostsDialogProps = {
  date: Date | null
  posts: Post[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DayPostsDialog({ date, posts, open, onOpenChange }: DayPostsDialogProps) {
  if (!date) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {format(date, "EEEE, d 'de' MMMM 'de' yyyy")}
          </DialogTitle>
          <DialogDescription>
            {posts.length > 0
              ? `${posts.length} post(s) agendado(s)`
              : "Nenhum post agendado para este dia"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex gap-4 rounded-lg border bg-muted/50 p-4">
                  <div className="h-12 w-12 shrink-0 rounded bg-muted" />
                  <div className="space-y-1">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.platforms} • {post.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-6 text-lg font-medium">Nenhum post agendado</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Este dia está livre. Que tal agendar algo?
              </p>
              <Button className="mt-8 bg-yellow-500 text-black hover:bg-yellow-600 font-medium">
                <Plus className="mr-2 h-4 w-4" />
                Criar post para este dia
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
