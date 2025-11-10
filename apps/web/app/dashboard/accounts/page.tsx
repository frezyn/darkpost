"use client"
import React from "react";
import AccountRow from "./components/accountRow";
import { Button } from "@workspace/ui/components/button"; // mantendo consistência com outros controles
import { X, Plus } from "lucide-react";
import { Account } from "@prisma/client";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";




export default function AccountsPage() {

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const trpc = useTRPC()

  const { data } = useQuery(trpc.providers.GetAllProvidersFromAccount.queryOptions())


  return (
    <div className="min-h-screen p-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Contas conectadas
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Gerencie as contas conectadas às suas plataformas.
            </p>
          </div>

          <Button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar conta
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {data?.accounts.map((acc) => (
            <AccountRow key={acc.provider} account={acc} Delete={() => { }} />
          ))}

          {data?.accounts.length === 0 && (
            <div className="rounded border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Nenhuma conta conectada.
            </div>
          )}
        </div>
      </div>

      <AddAccountModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={() => { }}
      />
    </div>
  );
}


function AddAccountModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (account: Omit<AccountRowType, "id" | "connectedAt">) => void;
}) {
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [platforms, setPlatforms] = React.useState<Record<string, boolean>>({
    tiktok: false,
    facebook: false,
    youtube: false,
  });
  const trpc = useTRPC()

  const initialRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setName("");
      setUsername("");
      setDescription("");
      setPlatforms({ tiktok: false, facebook: false, youtube: false });
      setTimeout(() => initialRef.current?.focus(), 50);
    }
  }, [open]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function togglePlatform(key: string) {
    setPlatforms((p) => ({ ...p, [key]: !p[key] }));
  }


  const chosen = Object.entries(platforms).filter(([, v]) => v).map(([k]) => k) as any;
  const data = useMutation(trpc.providers.createSocialAccount.mutationOptions({
    onSuccess: () => {
      console.log("sucess!")
    }
  }))


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      <form
        onSubmit={async () => await data.mutateAsync({
          name: name
        })}
        className="relative z-10 w-full max-w-md rounded bg-white dark:bg-black border shadow p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">
              Adicionar nova conta
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Conecte uma nova conta para postar e analisar performance.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">Nome</span>
            <input
              ref={initialRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da conta (ex: Loja Exemplo)"
              className="rounded border px-3 py-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">Usuário (opcional)</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@usuario"
              className="rounded border px-3 py-2 bg-white dark:bg-black  text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">Descrição (opcional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição curta da conta"
              className="rounded border px-3 py-2 bg-white dark:bg-black  text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
              rows={2}
            />
          </label>

          <fieldset>
            <legend className="text-sm text-gray-700 dark:text-gray-300 mb-2">Plataformas</legend>
            <div className="flex flex-wrap gap-2">
              {["tiktok", "facebook", "youtube"].map((p) => (
                <label
                  key={p}
                  className={`inline-flex items-center gap-2 rounded px-3 py-1 text-sm cursor-pointer ${platforms[p] ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={!!platforms[p]}
                    onChange={() => togglePlatform(p)}
                    className="sr-only"
                  />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Cancelar
          </Button>
          <Button onClick={async () => await data.mutateAsync({ name: name })} className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <Plus className="h-4 w-4" />
            Conectar conta
          </Button>
        </div>
      </form>
    </div >
  );
}
