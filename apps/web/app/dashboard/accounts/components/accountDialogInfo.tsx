import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";
import { Account } from "./accountRow";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";

// Plataformas suportadas
const SUPPORTED_PLATFORMS = [
  { name: "youtube", label: "YouTube", icon: YoutubeIcon },
  { name: "tiktok", label: "TikTok", icon: TikTokIcon },
  { name: "facebook", label: "Facebook", icon: FacebookIcon },
] as const;

type PlatformKey = (typeof SUPPORTED_PLATFORMS)[number]["name"];

type Props = {
  account: Account;
  children?: React.ReactNode;
};

export default function AccountDetailsDialog({ account, children }: Props) {
  const trpc = useTRPC()
  const router = useRouter()
  const connectedProviders = new Set(
    account.accounts.map((acc) => acc.provider.toLowerCase())
  );


  const { mutateAsync: deleteAccount } = useMutation(trpc.providers.deleteaccount.mutationOptions({}))

  const getConnectedAccount = (platform: PlatformKey) =>
    account.accounts.find((acc) => acc.provider.toLowerCase() === platform);

  return (
    <DialogContent className="max-w-md w-full mx-auto bg-black text-white border border-zinc-800 p-0 overflow-hidden">
      <DialogHeader className="p-4 pb-3 border-b border-zinc-800">
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-zinc-700">
            <AvatarFallback className="bg-zinc-800 text-white text-sm">
              {(account.name || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{account.name}</p>
            {account.id && (
              <p className="text-xs text-zinc-400 truncate font-mono">{account.id}</p>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-zinc-400 mb-1">Plataformas conectadas</p>
          <div className="flex flex-wrap gap-1.5">
            {account.accounts.length > 0 ? (
              account.accounts.map((acc) => (
                <PlatformBadge key={acc.providerAccountId} platform={acc.provider} />
              ))
            ) : (
              <span className="text-xs text-zinc-500">Nenhuma</span>
            )}
          </div>
        </div>


        <div>
          <p className="text-xs text-zinc-400">Conectado em</p>
          <p className="text-sm">
            {account.createdAt ? format(new Date(account.createdAt), "PPPp") : "—"}
          </p>
        </div>


        {account.description && (
          <div>
            <p className="text-xs text-zinc-400">Descrição</p>
            <p className="text-sm text-zinc-300">{account.description}</p>
          </div>
        )}
      </div>


      <div className="border-t border-zinc-800 p-4 space-y-3 px-4">
        {SUPPORTED_PLATFORMS.map((platform) => {
          const isConnected = connectedProviders.has(platform.name);
          const connectedAcc = isConnected ? getConnectedAccount(platform.name) : null;

          return (
            <div
              key={platform.name}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <platform.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium ">{platform.label}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate font-mono">
                    {isConnected
                      ? connectedAcc?.providerAccountId || "ID oculto"
                      : "Nenhuma conta conectada"}
                  </p>
                </div>
              </div>


              <div className="flex items-center gap-1.5">
                {isConnected && connectedAcc ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={async () => {
                      await deleteAccount({
                        id: connectedAcc.providerAccountId,
                        provider: platform.name as "youtube" | "tiktok" | "facebook",
                      });
                      router.refresh(); // Atualiza a página ou use query invalidation
                    }}
                  >
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs"
                    onClick={() => {
                      redirect(`/api/${platform.name}?userId=${account.userId}&accountId=${account.id}`);
                    }}
                  >
                    Conectar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fechar */}
      <div className="p-4 border-t border-zinc-800 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-900"
          onClick={() => { }}
        >
          Fechar
        </Button>
      </div>
    </DialogContent>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  const base = "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full";

  if (p === "tiktok")
    return (
      <Badge className={`${base} bg-black text-white`}>
        <TikTokIcon className="w-3 h-3" />
        TikTok
      </Badge>
    );

  if (p === "facebook")
    return (
      <Badge className={`${base} bg-blue-900 text-blue-300`}>
        <FacebookIcon className="w-3 h-3" />
        Facebook
      </Badge>
    );

  if (p === "youtube")
    return (
      <Badge className={`${base} bg-red-900 text-red-300`}>
        <YoutubeIcon className="w-3 h-3" />
        YouTube
      </Badge>
    );

  return <Badge className={base}>{p}</Badge>;
}


function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <path fill="#212121" d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z" />
      <path fill="#ec407a" d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391C17.213,29.127,17.972,30.274,19.079,30.832z" />
      <path fill="#fff" d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63z" />
      <path fill="#81d4fa" d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183C14.374,24.749,17.611,21.463,21.635,21.38z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.1 0-1.45.69-1.45 1.4V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23 7.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.8 3 12 3 12 3s-4.8 0-8.1.9c-.4.1-1.3.1-2.1 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.8v2.4C.8 15 1 16.8 1 16.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.4 7 .9 7 .9s4.8 0 8.1-.9c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-2 .2-3.6v-2.4C23.2 9 23 7.2 23 7.2zM9.8 15.1V8.9l5.1 3.1-5.1 3.1z" />
    </svg>
  );
}
