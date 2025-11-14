"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarIcon, Upload, X, CheckCircle, Loader2, Zap, Copy, ExternalLink } from "lucide-react";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

interface PublishResult {
  publish_id: any;
  postId: string;
}



export default function ScheduleVideoPage() {
  const trpc = useTRPC();

  // Estados
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [accountId, setAccountId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [postMode, setPostMode] = useState<"now" | "later">("now");
  const [publishedPostId, setPublishedPostId] = useState<string | null>(null); // Novo

  const { data: accountsData, isLoading: loadingAccounts } = useQuery(
    trpc.providers.GetAllProvidersFromAccount.queryOptions()
  );

  const createPresignedUrl = useMutation(trpc.providers.upload.createObjectLinkS3.mutationOptions());

  const publishPost = useMutation(
    trpc.providers.upload.publishPost.mutationOptions({
      //@ts-ignore
      onSuccess: (data: PublishResult) => {
        const isNow = postMode === "now";

        if (isNow && data.postId) {
          setPublishedPostId(data.postId);
        }
        console.log(data)

        toast.success(
          isNow
            ? "Vídeo publicado com sucesso!"
            : `Vídeo agendado para ${format(scheduledAt!, "PPP 'às' p")}`
        );

        if (!isNow) {
          resetForm();
        }
      },
      onError: (err: any) => {
        toast.error(err.message || "Erro ao publicar");
      },
    })
  );

  const resetForm = () => {
    setFile(null);
    setCaption("");
    setScheduledAt(undefined);
    setAccountId("");
    setUploadedKey(null);
    setUploadProgress(0);
    setPostMode("now");
    setPublishedPostId(null);
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!file.type.startsWith("video/")) {
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
        await uploadToS3(uploadUrl, file, contentType, (progress) => {
          setUploadProgress(progress);
        });
        setUploadedKey(key);
        toast.success("Upload concluído!");
      } catch (error: any) {
        console.error("Erro:", error);
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

  const uploadToS3 = (
    url: string,
    file: File,
    contentType: string,
    onProgress: (p: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`S3 Error: ${xhr.status}`));
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(file);
    });
  };

  const canPublish =
    uploadedKey && accountId && !publishPost.isPending && (postMode === "now" || scheduledAt);

  const publishButtonText = publishPost.isPending
    ? "Processando..."
    : postMode === "now"
      ? "Postar Agora"
      : "Agendar";

  const selectedAccount = accountsData?.accounts.find((acc) => acc.id === accountId);

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-black">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white">Publicar no TikTok</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Faça upload e publique ou agende seu vídeo.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle>1. Vídeo</CardTitle>
              <CardDescription>Arraste ou clique para fazer upload</CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    isDragActive
                      ? "border-black dark:border-white bg-gray-50 dark:bg-gray-900"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {isDragActive ? "Solte aqui" : "Arraste um vídeo ou clique"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      ) : uploadedKey ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : null}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {!uploadedKey && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setFile(null);
                          setUploadedKey(null);
                          setUploadProgress(0);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {isUploading && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Enviando...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-black dark:bg-white h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legenda */}
          <Card>
            <CardHeader>
              <CardTitle>2. Legenda (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escreva uma legenda..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-24"
                disabled={!uploadedKey}
              />
            </CardContent>
          </Card>

          {/* Conta */}
          <Card>
            <CardHeader>
              <CardTitle>3. Conta TikTok</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={accountId} onValueChange={setAccountId} disabled={!uploadedKey || loadingAccounts}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {accountsData?.accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      @{acc.name} ({acc.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {accountsData?.accounts.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">Nenhuma conta conectada.</p>
              )}
            </CardContent>
          </Card>

          {/* Modo: Postar agora ou agendar */}
          <Card>
            <CardHeader>
              <CardTitle>4. Quando postar?</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={postMode} onValueChange={(v) => setPostMode(v as "now" | "later")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="now" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Postar Agora
                  </TabsTrigger>
                  <TabsTrigger value="later" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Agendar
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="later" className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledAt && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledAt ? format(scheduledAt, "PPP 'às' p") : "Selecione data e hora"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduledAt}
                        onSelect={setScheduledAt}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Botão Final */}
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={async () => {
                await publishPost.mutateAsync({
                  accountId,
                  videoKey: uploadedKey!,
                  caption,
                  scheduledAt,
                });
              }}
              disabled={!canPublish || !!publishedPostId}
              className="gap-2 min-w-48"
            >
              {publishPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : postMode === "now" ? (
                <>
                  <Zap className="h-4 w-4" />
                  {publishButtonText}
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" />
                  {publishButtonText}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Modal de Sucesso - Postar Agora */}
        {publishedPostId && selectedAccount && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  Vídeo Publicado!
                </CardTitle>
                <CardDescription>
                  Seu vídeo já está no TikTok.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ID do vídeo:</p>
                  <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg font-mono text-sm break-all">
                    {publishedPostId}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(publishedPostId);
                      toast.success("ID copiado!");
                    }}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar ID
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const url = `https://www.tiktok.com/@${selectedAccount.name}/video/${publishedPostId}`;
                      window.open(url, "_blank");
                    }}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver no TikTok
                  </Button>
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => {
                    setPublishedPostId(null);
                    resetForm();
                  }}
                >
                  Fechar e Novo Upload
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
