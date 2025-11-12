"use client"
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { X, Plus } from "lucide-react";
import { SocialAccount } from "@prisma/client";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";



interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (account: Omit<SocialAccount, "id" | "connectedAt">) => void;
}

export function AddAccountModal({ open, onClose, onAdd }: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState<Record<string, boolean>>({
    tiktok: false,
    facebook: false,
    youtube: false,
  });

  const trpc = useTRPC();
  const initialRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation(trpc.providers.createSocialAccount.mutationOptions({
    onSuccess: () => {
      console.log("sucesso!")
    }
  }))

  useEffect(() => {
    if (open) {
      setName("");
      setUsername("");
      setDescription("");
      setPlatforms({ tiktok: false, facebook: false, youtube: false });
      setTimeout(() => initialRef.current?.focus(), 100);
    }
  }, [open]);

  const togglePlatform = (key: string) => {
    setPlatforms((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await mutation.mutateAsync({
      name,
      description: description,
      socialNameAccount: username,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar nova conta</DialogTitle>
          <DialogDescription>
            Conecte uma nova conta para postar e analisar performance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              ref={initialRef}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da conta (ex: Loja Exemplo)"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="username">Usuário (opcional)</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@usuario"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição curta da conta"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Plataformas</Label>
            <div className="flex flex-wrap gap-2">
              {["tiktok", "facebook", "youtube"].map((platform) => (
                <label
                  key={platform}
                  className={`
                    flex items-center gap-2 rounded-md px-3 py-1.5 text-sm cursor-pointer transition-colors
                    ${platforms[platform]
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }
                  `}
                >
                  <Checkbox
                    checked={platforms[platform]}
                    onCheckedChange={() => togglePlatform(platform)}
                    className="sr-only"
                  />
                  <span className="capitalize">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="gap-2"
            >
              {mutation.isPending ? (
                "Conectando..."
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Conectar conta
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
