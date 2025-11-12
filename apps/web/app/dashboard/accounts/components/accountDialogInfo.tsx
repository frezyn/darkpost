import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";

import { SocialAccountIntercace } from "./accountRow";


const platform = [{
  name: "tiktok",
  connected: false
}]


type Props = {
  account: SocialAccountIntercace;
  children?: React.ReactNode;
};

export default function AccountDetailsDialog({ account, children }: Props) {


  return (

    <DialogContent className="max-w-md bg-white dark:bg-black border">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-gray-900 dark:text-gray-100">{(account.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-black dark:text-white">{account.name}</span>
            {account.nameFromPlataform && <span className="text-xs text-gray-500 dark:text-gray-400">@{account.nameFromPlataform}</span>}
          </div>

        </DialogTitle>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Plataformas</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {account.linkedAccounts.map((p, idx) => (
              <PlatformBadge platform={p.provider} key={idx} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Conectado em</div>
          <div className="mt-1 text-sm text-black dark:text-white">
            {account.createdAt ? format(new Date(account.createdAt), "PPPp") : "Sem informação"}
          </div>
        </div>

        {account.description && (
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Descrição</div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{account.description}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {platform.map((a, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 p-3 border rounded-md bg-card">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">

              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{a.name}</span>
                  {a.connected ? (
                    <span className="text-xs text-green-400">conectado</span>
                  ) : (
                    <span className="text-xs text-zinc-400">não conectado</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {a.connected ? "Conta conectada" : "Nenhuma conta conectada"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {a.connected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {


                    }}
                  >
                    Atualizar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {

                    }}
                  >
                    Desconectar
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={async () => {

                  }}
                >
                  Conectar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={() => { }} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
          Fechar
        </Button>
      </div>
    </DialogContent>

  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const base = "inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium";
  if (platform === "tiktok") {
    return (
      <Badge className={`${base} bg-zinc-900 text-gray-900 dark:text-gray-100`}>
        <TikTokIcon className="h-4 w-4" />
        TikTok
      </Badge>
    );
  }
  if (platform === "facebook") {
    return (
      <Badge className={`${base} bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300`}>
        <FacebookIcon className="h-4 w-4" />
        Facebook
      </Badge>
    );
  }
  return (
    <Badge className={`${base} bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300`}>
      <YoutubeIcon className="h-4 w-4" />
      YouTube
    </Badge>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="200" height="200" viewBox="0 0 48 48">
      <path fill="#212121" fill-rule="evenodd" d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z" clip-rule="evenodd"></path><path fill="#ec407a" fill-rule="evenodd" d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011 c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413 c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607L29.208,20.607 z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561L30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1 c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391 C17.213,29.127,17.972,30.274,19.079,30.832z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157 c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379 c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391 c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183 c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63L28.034,19.63z" clip-rule="evenodd"></path><path fill="#81d4fa" fill-rule="evenodd" d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848 C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019 c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338 c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069 c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183 C14.374,24.749,17.611,21.463,21.635,21.38z" clip-rule="evenodd"></path>
    </svg>

  );
}
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.1 0-1.45.69-1.45 1.4V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden>
      <path d="M23 7.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.8 3 12 3 12 3s-4.8 0-8.1.9c-.4.1-1.3.1-2.1 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.8v2.4C.8 15 1 16.8 1 16.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.4 7 .9 7 .9s4.8 0 8.1-.9c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-2 .2-3.6v-2.4C23.2 9 23 7.2 23 7.2zM9.8 15.1V8.9l5.1 3.1-5.1 3.1z" />
    </svg>
  );
}
