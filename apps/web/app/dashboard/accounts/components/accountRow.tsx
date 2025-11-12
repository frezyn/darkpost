import React, { useEffect, useRef, useState } from "react";
import AccountDetailsDialog from "./accountDialogInfo";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog";


export type SocialAccountIntercace = {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nameFromPlataform?: string | null | undefined
  linkedAccounts: {
    socialAccountId: string;
    provider: string;
    providerAccountId: string;
    assignedAt: string;
  }[];
  description?: string | null | undefined;
}

type Props = {
  account: SocialAccountIntercace;
  className?: string;
};

export default function AccountRow({ account, className = "" }: Props) {
  const initials = getInitials(account.name);


  return (

    <div
      role="listitem"
      className={`flex items-center justify-between gap-4 rounded-lg border bg-white dark:bg-black px-4 py-3 transition-shadow hover:shadow-sm ${className}`}
    >
      {/* Conteúdo principal (avatar + info) */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback className="text-gray-900 dark:text-gray-100">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <h3 className="truncate text-base font-semibold text-black dark:text-white">
              {account.name}
            </h3>
            {account.linkedAccounts?.map((lc) => (
              <span
                key={lc.provider}
                className="truncate text-xs text-gray-500 dark:text-gray-400"
              >
                @{lc.provider}
              </span>
            ))}
          </div>

          {account.description && (
            <p className="mt-2.5 text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
              {account.description}
            </p>
          )}
        </div>
      </div>

      {/* Trigger dos 3 pontinhos (alinhado à direita) */}
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md  hover:bg-muted  transition-colors"
            aria-label="Mais opções"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DialogTrigger>
        <AccountDetailsDialog account={account} />
      </Dialog>
    </div>



  );
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}



function formatConnectedAt(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = Date.now();
    const diff = Math.floor((now - d.getTime()) / 1000);
    if (diff < 60) return "agora";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d`;
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

function PlatformPill({ platform }: { platform: string }) {
  const base = "inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (platform === "tiktok") {
    return (
      <span className={`${base} bg-gray-100 dark:bg-zinc-900/80 text-gray-900 dark:text-gray-100`}>
        <span className="flex items-center justify-center rounded-sm p-0.5 text-gray-100 dark:text-gray-900 h-6 w-6">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="200" height="200" viewBox="0 0 48 48">
            <path fill="#212121" fill-rule="evenodd" d="M10.904,6h26.191C39.804,6,42,8.196,42,10.904v26.191 C42,39.804,39.804,42,37.096,42H10.904C8.196,42,6,39.804,6,37.096V10.904C6,8.196,8.196,6,10.904,6z" clip-rule="evenodd"></path><path fill="#ec407a" fill-rule="evenodd" d="M29.208,20.607c1.576,1.126,3.507,1.788,5.592,1.788v-4.011 c-0.395,0-0.788-0.041-1.174-0.123v3.157c-2.085,0-4.015-0.663-5.592-1.788v8.184c0,4.094-3.321,7.413-7.417,7.413 c-1.528,0-2.949-0.462-4.129-1.254c1.347,1.376,3.225,2.23,5.303,2.23c4.096,0,7.417-3.319,7.417-7.413L29.208,20.607L29.208,20.607 z M30.657,16.561c-0.805-0.879-1.334-2.016-1.449-3.273v-0.516h-1.113C28.375,14.369,29.331,15.734,30.657,16.561L30.657,16.561z M19.079,30.832c-0.45-0.59-0.693-1.311-0.692-2.053c0-1.873,1.519-3.391,3.393-3.391c0.349,0,0.696,0.053,1.029,0.159v-4.1 c-0.389-0.053-0.781-0.076-1.174-0.068v3.191c-0.333-0.106-0.68-0.159-1.03-0.159c-1.874,0-3.393,1.518-3.393,3.391 C17.213,29.127,17.972,30.274,19.079,30.832z" clip-rule="evenodd"></path><path fill="#fff" fill-rule="evenodd" d="M28.034,19.63c1.576,1.126,3.507,1.788,5.592,1.788v-3.157 c-1.164-0.248-2.194-0.856-2.969-1.701c-1.326-0.827-2.281-2.191-2.561-3.788h-2.923v16.018c-0.007,1.867-1.523,3.379-3.393,3.379 c-1.102,0-2.081-0.525-2.701-1.338c-1.107-0.558-1.866-1.705-1.866-3.029c0-1.873,1.519-3.391,3.393-3.391 c0.359,0,0.705,0.056,1.03,0.159V21.38c-4.024,0.083-7.26,3.369-7.26,7.411c0,2.018,0.806,3.847,2.114,5.183 c1.18,0.792,2.601,1.254,4.129,1.254c4.096,0,7.417-3.319,7.417-7.413L28.034,19.63L28.034,19.63z" clip-rule="evenodd"></path><path fill="#81d4fa" fill-rule="evenodd" d="M33.626,18.262v-0.854c-1.05,0.002-2.078-0.292-2.969-0.848 C31.445,17.423,32.483,18.018,33.626,18.262z M28.095,12.772c-0.027-0.153-0.047-0.306-0.061-0.461v-0.516h-4.036v16.019 c-0.006,1.867-1.523,3.379-3.393,3.379c-0.549,0-1.067-0.13-1.526-0.362c0.62,0.813,1.599,1.338,2.701,1.338 c1.87,0,3.386-1.512,3.393-3.379V12.772H28.095z M21.635,21.38v-0.909c-0.337-0.046-0.677-0.069-1.018-0.069 c-4.097,0-7.417,3.319-7.417,7.413c0,2.567,1.305,4.829,3.288,6.159c-1.308-1.336-2.114-3.165-2.114-5.183 C14.374,24.749,17.611,21.463,21.635,21.38z" clip-rule="evenodd"></path>
          </svg>
        </span>
        TikTok
      </span>
    );
  }
  if (platform === "facebook") {
    return (
      <span className={`${base} bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300`}>
        <span className="flex items-center justify-center rounded-sm p-0.5 bg-blue-600 text-white h-4 w-4">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
            <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.15h-1.1c-1.1 0-1.45.69-1.45 1.4V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z" />
          </svg>
        </span>
        Facebook
      </span>
    );
  }
  return (
    <span className={`${base} bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300`}>
      <span className="flex items-center justify-center rounded-sm p-0.5 bg-red-600 text-white h-4 w-4">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
          <path d="M23 7.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.8 3 12 3 12 3s-4.8 0-8.1.9c-.4.1-1.3.1-2.1 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.8v2.4C.8 15 1 16.8 1 16.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.4 7 .9 7 .9s4.8 0 8.1-.9c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.2-2 .2-3.6v-2.4C23.2 9 23 7.2 23 7.2zM9.8 15.1V8.9l5.1 3.1-5.1 3.1z" />
        </svg>
      </span>
      YouTube
    </span>
  );
}
