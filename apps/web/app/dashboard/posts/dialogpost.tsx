"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import {
  CalendarIcon,
  Upload,
  X,
  CheckCircle,
  Loader2,
  Zap,
  Copy,
  ExternalLink,
  Video,
} from "lucide-react";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

// Estrutura real do seu backend
type ConnectedAccount = {
  id: string;
  platform: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  accountId: string;
  platformAccountId: string;
};

export default function ScheduleVideoDialog() {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [postMode, setPostMode] = useState<"now" | "later">("now");
  const [publishedPostId, setPublishedPostId] = useState<string | null>(null);

  const { data: providersData, isLoading: loadingAccounts } = useQuery(
    trpc.providers.GetAllProvidersFromAccount.queryOptions()
  );

  // Transforma em array plano de contas conectadas
  const connectedAccounts: ConnectedAccount[] =
    providersData?.accounts.flatMap(p => p.connectedAccounts.map(acc => ({
      id: acc.id,
      platform: acc.platform,
      username: acc.username,
      displayName: acc.displayName,
      avatarUrl: acc.avatarUrl,
      accountId: acc.accountId,
      platformAccountId: acc.platformAccountId,
    }))) || [];

  const selectedAccount = connectedAccounts.find(a => a.id === selectedAccountId);

  const createPresignedUrl = useMutation(trpc.providers.upload.createObjectLinkS3.mutationOptions());
  const publishPost = useMutation(
    trpc.providers.upload.publishPost.mutationOptions({
      onSuccess: (data: any) => {
        const isNow = postMode === "now";
        if (isNow && data.postId) setPublishedPostId(data.postId);

        toast.success(
          isNow
            ? "Vídeo publicado com sucesso!"
            : `Vídeo agendado para ${format(scheduledAt!, "dd/MM/yyyy 'às' HH:mm")}`
        );
        if (!isNow) resetForm();
      },
      onError: (err: any) => toast.error(err.message || "Erro ao publicar"),
    })
  );

  const resetForm = () => {
    setFile(null);
    setCaption("");
    setScheduledAt(undefined);
    setSelectedAccountId("");
    setUploadedKey(null);
    setUploadProgress(0);
    setPostMode("now");
    setPublishedPostId(null);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file || !file.type.startsWith("video/")) {
        toast.error("Apenas vídeos são permitidos");
        return;
      }
      setFile(file);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const { uploadUrl, key, contentType } = await createPresignedUrl.mutateAsync({
          fileName: file.name,
          fileType: file.type,
        });
        await uploadToS3(uploadUrl, file, contentType, (p) => setUploadProgress(p));
        setUploadedKey(key);
        toast.success("Upload concluído!");
      } catch (error: any) {
        toast.error(error.message || "Falha no upload");
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [createPresignedUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    maxFiles: 1,
  });

  const uploadToS3 = (url: string, file: File, contentType: string, onProgress: (p: number) => void) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Erro ${xhr.status}`)));
      xhr.onerror = () => reject(new Error("Erro de rede"));
      xhr.send(file);
    });

  const canPublish = uploadedKey && selectedAccountId && !publishPost.isPending && (postMode === "now" || scheduledAt);

  const getPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "tiktok": return "TikTok";
      case "youtube": return "YouTube";
      case "facebook": return "Facebook";
      default: return platform;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "tiktok":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.38 6.793c-1.27-.986-2.068-2.542-2.14-4.14-.008-.18-.013-.36-.015-.54h-4.04v15.48c-.024 1.284-.627 2.462-1.62 3.18-1.572 1.134-3.78.867-4.92-.6-.72-.924-.996-2.094-.78-3.24.288-2.436 2.556-4.08 4.98-3.78v2.22c-.792-.288-1.644-.24-2.4.12-.996.48-1.56 1.56-1.32 2.64.216 1.008 1.14 1.74 2.22 1.74 1.296 0 2.34-1.044 2.34-2.34V9.913c1.008.72 2.22 1.14 3.48 1.14V6.913c-.792 0-1.5-.36-2.04-.96z" /></svg>;
      case "youtube":
        return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
      case "facebook":
        return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium">
            <Video className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Publicar Vídeo</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Upload */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Vídeo</Label>
              {!file ? (
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all",
                    isDragActive ? "border-yellow-500 bg-zinc-900/50" : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/30"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-zinc-500" />
                  <p className="mt-3 text-sm text-zinc-400">
                    {isDragActive ? "Solte aqui" : "Arraste ou clique para fazer upload"}
                  </p>
                </div>
              ) : (
                <Card className="bg-zinc-900/70 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-yellow-500" /> : uploadedKey ? <CheckCircle className="h-5 w-5 text-green-500" /> : null}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      {!uploadedKey && <Button size="sm" variant="ghost" onClick={() => { setFile(null); setUploadedKey(null); setUploadProgress(0); }}><X className="h-4 w-4" /></Button>}
                    </div>
                    {isUploading && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-zinc-400 mb-1"><span>Enviando...</span><span>{uploadProgress}%</span></div>
                        <div className="w-full bg-zinc-800 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} /></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Legenda */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Legenda (opcional)</Label>
              <Textarea
                placeholder="Escreva uma legenda incrível..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-32 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                disabled={!uploadedKey}
              />
            </div>

            {/* Conta + Card Visual */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Para qual conta?</Label>

              <Select value={selectedAccountId} onValueChange={setSelectedAccountId} disabled={!uploadedKey || loadingAccounts}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Selecione uma conta conectada" />
                </SelectTrigger>
                <SelectContent>
                  {connectedAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={acc.avatarUrl || undefined} />
                          <AvatarFallback className="bg-zinc-800 text-xs">{acc.platform[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">@{acc.username || acc.displayName || "Sem nome"}</span>
                          <span className="text-xs text-zinc-400 ml-2">{getPlatformName(acc.platform)}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* CARD VISUAL DA CONTA SELECIONADA */}
              {selectedAccount && (
                <Card className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="p-5 flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-zinc-700">
                      <AvatarImage src={selectedAccount.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white text-xl font-bold">
                        {selectedAccount.platform[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xl">{getPlatformName(selectedAccount.platform)}</span>
                        {getPlatformIcon(selectedAccount.platform)}
                      </div>
                      <p className="text-2xl font-medium text-yellow-500 mt-1">
                        @{selectedAccount.username || selectedAccount.displayName || "conta"}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Quando postar */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">Quando postar?</Label>
              <Tabs value={postMode} onValueChange={(v) => setPostMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                  <TabsTrigger value="now"><Zap className="h-4 w-4 mr-2" />Postar Agora</TabsTrigger>
                  <TabsTrigger value="later"><CalendarIcon className="h-4 w-4 mr-2" />Agendar</TabsTrigger>
                </TabsList>
                <TabsContent value="later" className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-zinc-900 border-zinc-800", !scheduledAt && "text-zinc-500")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledAt ? format(scheduledAt, "dd/MM/yyyy 'às' HH:mm") : "Escolha data e hora"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                      <Calendar mode="single" selected={scheduledAt} onSelect={setScheduledAt} disabled={(d) => d < new Date()} className="rounded-md border-0" />
                    </PopoverContent>
                  </Popover>
                </TabsContent>
              </Tabs>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-8"
                disabled={!canPublish}
                onClick={() => publishPost.mutateAsync({
                  accountId: selectedAccount?.accountId!,
                  videoKey: uploadedKey!,
                  caption,
                  scheduledAt,
                })}
              >
                {publishPost.isPending ? (
                  <> <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processando... </>
                ) : postMode === "now" ? (
                  <> <Zap className="h-5 w-5 mr-2" /> Postar Agora </>
                ) : (
                  <> <CalendarIcon className="h-5 w-5 mr-2" /> Agendar </>
                )}
              </Button>
            </div>

            {/* Sucesso */}
            {publishedPostId && selectedAccount && (
              <Card className="bg-zinc-900/80 border-green-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-green-400 mb-4">
                    <CheckCircle className="h-8 w-8" />
                    <p className="text-lg font-semibold">Vídeo publicado!</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(publishedPostId); toast.success("ID copiado!"); }}>
                      <Copy className="h-4 w-4 mr-2" /> Copiar ID
                    </Button>
                    <Button size="sm" onClick={() => window.open(`https://www.tiktok.com/@${selectedAccount.username}/video/${publishedPostId}`, "_blank")}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Ver no {getPlatformName(selectedAccount.platform)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
