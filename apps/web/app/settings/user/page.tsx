"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSession } from "@workspace/auth"


import { useTRPCClient } from "@/utils/trpc";
import { toast } from "sonner";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Settings() {
  const { data } = useSession();
  const [nameCssBuy, setNameCssBuy] = useState("");
  const [inviteUser, setInviteUser] = useState("");
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null)
  const trpc = useTRPCClient()


  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background pt-4  md:gap-8 mt-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seu nome</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex space-x-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={data?.user?.name ?? "Nenhum nome fornecido"}
              />
              <Button
                disabled={!name.length}
                className="max-sm:w-fit px-6"
                onClick={async () => {
                }}
              >
                Salvar
              </Button>
            </form>
          </CardContent>
          <CardHeader>
            <CardTitle>Seu nome no CSS</CardTitle>
            <CardDescription className="flex gap-2  pt-2 text-red-500 text-xs md:items-center">
              <Info className="size-4 max-sm:size-6" />
              cuidado, esse nome que será usado para enviar os yuans.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Input
              placeholder={data?.user?.cssName ?? "Nenhum nome cadastrado"}
              value={nameCssBuy}
              onChange={(e) => setNameCssBuy(e.target.value)}
            />
            <Button
              disabled={!nameCssBuy.length}
              className="max-sm:w-fit px-6"
              onClick={async () => {

              }}
            >
              Salvar
            </Button>
          </CardContent>
          <CardHeader>
            <CardTitle>codigo de afiliado</CardTitle>
            <CardDescription className="flex gap-2  pt-2 text-zinc-100 text-xs md:items-center">
              <Info className="size-4 max-sm:size-6" />
              gere um lindo codigo para indicacao :D
            </CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Input
              readOnly
              value={data?.user.inviteCode || "nao temos nenhum codigo aqui"}
              ref={inputRef}
              onClick={async () => {
                if (inputRef.current) {
                  inputRef.current.select();
                  inputRef.current.setSelectionRange(0, 999999);
                  await navigator.clipboard.writeText(inputRef.current.value)
                  toast.success("codigo copiado para clipboard")
                }
              }}
            />
            <Button
              className="max-sm:w-fit px-6"
              onClick={async () => {
                try {

                  toast.success("invite criado com sucesso")
                } catch (err) {
                  toast.error("Erro ao gerar invite, o que acha de tentar dnv?")
                }
              }}
            >
              gerar um codigo
            </Button>
          </CardContent>
          <CardHeader>
            <CardTitle>Usar de afiliado</CardTitle>
            <CardDescription className="flex gap-2  pt-2 text-zinc-100 text-xs md:items-center">
              <Info className="size-4 max-sm:size-6" />
              Use um codigo de uma pessoa especial, e ele ganhara uma % da sua recarga :D
            </CardDescription>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Input
              onChange={(r) => setInviteUser(r.target.value)}
              value={inviteUser}

            />
            <Button
              className="max-sm:w-fit px-6"
              onClick={async () => {
                try {

                  toast.success("invite alterado com sucesso")
                } catch (err) {
                  toast.error("Erro ao gerar invite, o que acha de tentar dnv?")
                }
              }}
            >
              salvar
            </Button>
          </CardContent>

        </Card>
      </div>

    </main >
  );
}
