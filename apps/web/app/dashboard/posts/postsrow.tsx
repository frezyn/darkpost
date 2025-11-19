"use client";

import { format } from "date-fns/format";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Copy, Edit2, RefreshCw, Trash2, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { PostStatus } from "@prisma/client";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../components/providers"

export type Platform = "tiktok" | "youtube" | "facebook";

interface PlatformError {
  platform: Platform;
  message: string;
}

interface ScheduledPostCardProps {
  id: string;
  thumbnailUrl?: string;
  title: string;
  scheduledAt: Date;
  createdAt: Date;
  createdBy: string;
  status: PostStatus;
  platforms: {
    platform: Platform;
    username?: string;
    error?: string;
  }[];
  onEdit?: () => void;
  onRetry?: () => void;
  onDelete?: () => void;
}

const platformConfig = {
  tiktok: { icon: "🎵", label: "tiktok", color: "text-pink-500", bg: "bg-pink-500/10" },
  youtube: { icon: "▶️", label: "youtube", color: "text-red-500", bg: "bg-red-500/10" },
  facebook: { icon: "f", label: "facebook", color: "text-blue-500", bg: "bg-blue-500/10" },
};

export function ScheduledPostCard({
  id,
  thumbnailUrl,
  title,
  scheduledAt,
  createdAt,
  createdBy,
  status,
  platforms,
  onEdit,
  onRetry,
  onDelete,
}: ScheduledPostCardProps) {
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);
  const hasError = platforms.some(p => p.error);
  const trpc = useTRPC()

  const { mutateAsync: deletePostAsync } = useMutation(trpc.providers.deletePost.mutationOptions({
    onMutate: async ({ idPost }) => {
      await queryClient.cancelQueries({
        queryKey: trpc.providers.GetAllPostsFromAccount.queryKey()
      })

      const previusData = queryClient.getQueryData(trpc.providers.GetAllPostsFromAccount.queryKey())

      queryClient.setQueryData(trpc.providers.GetAllPostsFromAccount.queryKey(), (old: any) => {
        if (!old.accounts) return old

        return {
          ...old,
          accounts: old.accounts.filter((p: any) => p.id != idPost)
        }
      })

      return {
        previusData
      }
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.providers.GetAllPostsFromAccount.queryKey()
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.providers.GetAllPostsFromAccount.queryKey()
      })
    }
  }))



  return (
    <Card className="bg-zinc-950/80 border-zinc-800/60 rounded-lg overflow-hidden hover:border-yellow-500/40 transition-all duration-300">
      <div className="p-4">
        {/* Linha principal com thumbnail e informações */}
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 mt-1"
          />

          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="thumb" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-2xl">📹</div>
                </div>
              )}
            </div>
            {status === "FAILED" && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white border-0 text-xs px-2 py-0.5">
                ✕ Failed
              </Badge>
            )}
          </div>

          {/* Informações e plataformas */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              {/* Título */}
              <h3 className="font-semibold text-start text-white text-base truncate flex-1">
                {title || "Sem título"}
              </h3>

              {/* Badge de status no canto */}
              {status === "FAILED" && (
                <Badge className="bg-red-600 text-white border-0 text-xs px-2 py-0.5 flex-shrink-0">
                  ✕ Failed
                </Badge>
              )}
            </div>

            {/* Metadados */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
              <span>
                scheduled: <span className="text-zinc-400">{format(scheduledAt, "MMM dd, yyyy, hh:mm a")} GMT-3</span>
              </span>
              <span>•</span>
              <span>
                created: <span className="text-zinc-400">{format(createdAt, "MM/dd/yyyy")}</span>
              </span>
              <span>•</span>
              <span>
                by: <span className="text-yellow-500">{createdBy}</span>
              </span>
            </div>

            {/* ID */}
            <div className="flex items-center gap-2 mb-3">
              <code className="bg-zinc-900/70 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400 text-xs">
                id: {id.slice(0, 8)}...
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => navigator.clipboard.writeText(id)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            {/* Plataformas */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">platforms:</span>
              {platforms.map(({ platform, username, error }) => {
                const config = platformConfig['tiktok'];
                const isExpanded = expandedPlatform === platform;

                return (
                  <button
                    key={platform}
                    onClick={() => error && setExpandedPlatform(isExpanded ? null : platform)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all",
                      error
                        ? "bg-red-950/40 border-red-800/60 text-red-400 hover:bg-red-950/60 cursor-pointer"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 cursor-default"
                    )}
                  >
                    {error && <AlertCircle className="h-3 w-3" />}
                    <span className="text-base">{config.icon}</span>
                    <span className="capitalize">{config.label}</span>
                    {error && (
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Erro expandido */}
        {expandedPlatform && platforms.find(p => p.platform === expandedPlatform)?.error && (
          <div className="mt-4 bg-red-950/20 border border-red-800/40 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-xs">
                {(() => {
                  const plat = platforms.find(p => p.platform === expandedPlatform);
                  const config = platformConfig[expandedPlatform];
                  return (
                    <>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-base">{config.icon}</span>
                        <span className={cn("font-semibold", config.color)}>
                          {config.label}
                        </span>
                        {plat?.username && (
                          <span className="text-yellow-500">
                            @{plat.username}
                          </span>
                        )}
                      </div>
                      <p className="text-red-300 leading-relaxed">
                        {plat?.error}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Separador */}
        {(onEdit || onRetry || onDelete) && (
          <Separator className="my-4 bg-zinc-800" />
        )}

        {/* Botões de ação em linha separada */}
        {(onEdit || onRetry || onDelete) && (
          <div className="flex items-center justify-end gap-2">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="h-8 text-xs"
              >
                <Edit2 className="h-3 w-3 mr-1" /> edit
              </Button>
            )}
            {hasError && onRetry && (
              <Button
                size="sm"
                onClick={onRetry}
                className="h-8 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> retry post
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => await deletePostAsync({
                  idPost: id
                })}
                className="h-8 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" /> delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
