"use client";
import { Button } from "@workspace/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FlickeringGrid } from "@workspace/ui/components/flickering-grid"
import { LoaderFive } from "@workspace/ui/components/ui/loader"
import { ConfettiFireworks } from "@workspace/ui/components/fireworkds-confetti";
import { z } from "zod"
import { toast } from "sonner"
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { Toaster } from "@workspace/ui/components/sonner";
//TODO: criar um validador de telefone melhor.
const phoneRegex = new RegExp(
  /(\d{2})(\d{1})(\d{4})(\d{4})/
);

function isValidCPF(cpf: string | string[]) {
  if (typeof cpf !== 'string') return false
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
  cpf = cpf.split('')
  const validator = cpf
    .filter((digit, index, array) => index >= array.length - 2 && digit)
    .map(el => +el)
  const toValidate = (pop: any) => cpf
    .filter((digit, index, array) => index < array.length - pop && digit)
    .map(el => +el)
  const rest = (count: any, pop: any) => (toValidate(pop)
    .reduce((soma, el, i) => soma + el * (count - i), 0) * 10) % 11 % 10
  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1])
}

const schema = z.object({
  name: z.string(),
  phone: z.string().regex(phoneRegex, "telefone invalido!"),
  cpf: z.string().refine(isValidCPF, "Cpf invalido"),
  cssUser: z.string(),
  invite: z.string().optional(),
})

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const trpc = useTRPC()


  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: undefined,
      phone: undefined,
      cpf: undefined,
      cssUser: undefined,
    },
  });

  const registerUser = useMutation(trpc.user.registerUser.mutationOptions({
    onSuccess: () => {
      ConfettiFireworks()
      setTimeout(() => { }, 5);
      window.location.href = "/"
    },
    onError: ({ message }) => {
      toast("Erro ao enviar dados, certifique de ter escrito corretamente", {
        description: message,
        position: "top-left"
      })
      setIsLoading(false)
      //TODO: Adicionar detalhes do erro.
    },
  }))

  function handleSubit(data: z.infer<typeof schema>) {
    setIsLoading(true)
    try {
      registerUser.mutate({
        cpf: data.cpf,
        name: data.name,
        cssUser: data.cssUser,
        phone: data.phone,
        invite: data.invite
      })
    } catch (e) {
      console.error(e);
    } finally { }
  }

  //TODO: adicionar marcara no cpf e telefone, e melhorar as mensagens de erro quando estiver invalido.

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <Toaster />
      <div className="w-full max-w-[500px] h-fit p-3 sm:p-4 pb-2 border rounded-xl shadow-xl shadow-black/5 backdrop-blur-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-2 sm:p-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-sm font-medium">{form.formState.errors.name?.message || "Seu nome"}</label>
                    <Input className="h-10" {...field} />
                  </div>
                )}
              />
              <FormField
                name="cssUser"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-sm font-medium">{form.formState.errors.cssUser?.message || "CssBuy username"}</label>
                    <Input className="h-10" {...field} />
                  </div>
                )}
              />
            </div>
            <div className="px-2 sm:px-4 space-y-3 sm:space-y-4">
              <FormField
                name="cpf"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1 sm:space-y-2">
                    <label className={`text-sm font-medium`}>{form.formState.errors.cpf?.message ?? "seu CPF"}</label>
                    <Input className="w-full h-10" {...field} />
                  </div>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-sm font-medium">{form.formState.errors.phone?.message || "Seu telefone"}</label>
                    <Input className="w-full h-10" {...field} type="tel" />
                  </div>
                )}
              />
              <FormField
                name="invite"
                control={form.control}
                render={({ field }) => (
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-sm font-medium">{form.formState.errors.phone?.message || "Codigo de convite"}</label>
                    <Input className="w-full h-10" {...field} value={field.value || "Sem codigo de convite"} disabled />
                  </div>
                )}
              />

            </div>
            <div className="mx-2 sm:mx-4 my-4 sm:my-6">
              <Button className="w-full h-11 text-base" type="submit" disabled={isLoading}>
                {isLoading ? <LoaderFive text="Enviando informacoes" /> : "Enviar informações"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div >
  );
}

/*
function getCookie(name: string) {
  return document.cookie.split("; ").map((row) => {
    if (row.startsWith(`${name}=`)) {
      return row.split("=")[1]
    }
  }).filter(r => r != undefined).pop()
}
*/
