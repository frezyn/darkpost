"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const platforms = [
  {
    key: "tiktok", name: "TikTok", icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.38 6.793c-1.27-.986-2.068-2.542-2.14-4.14-.008-.18-.013-.36-.015-.54h-4.04v15.48c-.024 1.284-.627 2.462-1.62 3.18-1.572 1.134-3.78.867-4.92-.6-.72-.924-.996-2.094-.78-3.24.288-2.436 2.556-4.08 4.98-3.78v2.22c-.792-.288-1.644-.24-2.4.12-.996.48-1.56 1.56-1.32 2.64.216 1.008 1.14 1.74 2.22 1.74 1.296 0 2.34-1.044 2.34-2.34V9.913c1.008.72 2.22 1.14 3.48 1.14V6.913c-.792 0-1.5-.36-2.04-.96z" />
      </svg>
    )
  },
  {
    key: "youtube", name: "YouTube", icon: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    key: "facebook", name: "Facebook", icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
] as const;

export function AddAccountModal({ close }: { close: () => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());

  const trpc = useTRPC();
  const initialRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation(trpc.providers.createSocialAccount.mutationOptions({
    onSuccess: () => {

      toast("Conta criada com sucesso!")
      close()
    },
  }));

  useEffect(() => {
    setName("");
    setUsername("");
    setDescription("");
    setSelectedPlatforms(new Set());
    setTimeout(() => initialRef.current?.focus(), 150);
  }, []);

  const togglePlatform = (key: string) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await mutation.mutateAsync({
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <DialogContent className="max-w-lg bg-black border-zinc-800 text-white rounded-2xl shadow-2xl">
      <DialogHeader className="text-left">
        <DialogTitle className="text-2xl font-bold">Criar novo perfil</DialogTitle>
        <DialogDescription className="text-zinc-400">
          Organize suas contas em um perfil para postar e analisar performance.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Nome do Perfil */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Nome do perfil</Label>
          <Input
            ref={initialRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Minha Loja Oficial"
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-yellow-500 focus-visible:ring-2 h-12 text-lg"
            required
          />
        </div>

        {/* Username (opcional) */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Username geral (opcional)</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@minhaloja"
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 h-12"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Descrição (opcional)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Loja de roupas femininas com foco em moda jovem"
            rows={3}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 resize-none focus-visible:ring-yellow-500 focus-visible:ring-2"
          />
        </div>


        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => { }}
            className="text-zinc-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending || !name.trim()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-8 h-auto rounded-xl shadow-lg shadow-yellow-500/20 transition-all"
          >
            {mutation.isPending ? (
              "Criando perfil..."
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Criar Perfil
              </>
            )}
          </Button>
        </div>
      </form>
    </DialogContent>

  );
}
