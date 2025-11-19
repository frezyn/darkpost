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
import { LoginWithDiscord, LoginWithGoogle } from "./actions"

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
              <Button variant="outline" className="w-full" onClick={() => LoginWithGoogle()}>
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
      {/*
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Tem alguma duvida, ou problema? <a href="https://discord.gg/VZm54A7uPB">Entre em nosso server do discord</a>{" "}
      </div>
      */}
    </div >
  )
}

