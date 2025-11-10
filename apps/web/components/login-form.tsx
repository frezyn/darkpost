"use client"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { useForm } from "react-hook-form"
import { Form, FormField } from "@workspace/ui/components/form"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { LoginWithDiscord } from "./actions"

const schama = z.object({
  email: z.string().email()
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(schama),
    defaultValues: {
      email: ""
    }
  })



  return (
    <div className={cn("flex flex-col gap-6 opacity-80", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">            Opa, beleza? ;D
          </CardTitle>
          <CardDescription>
            Digite seu melhor e-mail e nós enviaremos um link para você acessar sua conta de forma segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full" onClick={() => LoginWithDiscord()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                    fill="currentColor"
                  />
                </svg>
                Login com Discord
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login com Google
              </Button>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => {
                setLoading(true)

              })}>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Ou continue com seu email
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label >Email</Label>
                    <FormField
                      {...form.control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="seulindoemail@gmail.com"
                          required
                        />
                      )}
                    />
                  </div>
                  <Button type="submit" variant={loading ? "outline" : "default"} className="w-full">
                    {loading ? "Carregando..." : "Login"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Tem alguma duvida, ou problema? <a href="https://discord.gg/VZm54A7uPB">Entre em nosso server do discord</a>{" "}
      </div>
    </div >
  )
}

