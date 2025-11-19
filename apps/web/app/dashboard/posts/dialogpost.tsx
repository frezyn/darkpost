"use client";
import React, { useState, useCallback, JSX } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Calendar } from "@workspace/ui/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarIcon, Upload, X, CheckCircle, Loader2, Video, Clock } from "lucide-react";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

export default function ScheduleVideoDialog() {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [postMode, setPostMode] = useState<"now" | "later">("now");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState({ hours: "12", minutes: "00" });

  const { data: providersData } = useQuery(
    trpc.providers.GetAllProvidersFromAccount.queryOptions()
  );

  const selectedProfile = providersData?.accounts.find(p => p.id === selectedProfileId);
  const connectedAccounts = selectedProfile?.connectedAccounts || [];

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const createPresignedUrl = useMutation(trpc.providers.upload.createObjectLinkS3.mutationOptions());
  const publishPost = useMutation(trpc.providers.upload.publishPost.mutationOptions());

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith("video/")) return toast.error("Apenas vídeos");

    setFile(file);
    setIsUploading(true);
    try {
      const { uploadUrl, key, contentType } = await createPresignedUrl.mutateAsync({
        fileName: file.name,
        fileType: file.type,
      });
      await uploadToS3(uploadUrl, file, contentType, setUploadProgress);
      setUploadedKey(key);
      toast.success("Upload concluído!");
    } catch {
      toast.error("Falha no upload");
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    maxFiles: 1,
  });

  const uploadToS3 = (url: string, file: File, contentType: string, onProgress: (p: number) => void) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.upload.onprogress = e => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject());
      xhr.onerror = reject;
      xhr.send(file);
    });

  const getScheduledDateTime = (): Date | undefined => {
    if (!scheduledAt || !scheduledTime) return undefined;

    const date = new Date(scheduledAt);

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(scheduledTime.hours),
      parseInt(scheduledTime.minutes)
    );
  };

  const canPublish = uploadedKey && selectedProfileId && selectedPlatforms.length > 0 && (postMode === "now" || scheduledAt);

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "tiktok": return "text-pink-500";
      case "youtube": return "text-red-500";
      case "facebook": return "text-blue-500";
      default: return "text-yellow-500";
    }
  };

  const getPlatformIcon = (platform: string) => {
    const map: Record<string, JSX.Element> = {
      tiktok: <span className="text-lg">🎵</span>,
      youtube: <span className="text-lg">▶️</span>,
      facebook: <span className="text-lg">f</span>,
    };
    return map[platform.toLowerCase()] || null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-amber-500 text-black font-semibold">
          <Video className="w-4 h-4 " /> Novo Post
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] hide-scrollbar bg-[#0a0a0a] border-zinc-800 text-white p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Publicar Vídeo</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 hide-scrollbar">
          <div className="space-y-6 pb-4">

            {/* Upload */}
            {!file ? (
              <div {...getRootProps()} className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 text-center cursor-pointer hover:border-zinc-600 transition">
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-zinc-500" />
                <p className="mt-4 text-zinc-400">Arraste ou clique para enviar o vídeo</p>
              </div>
            ) : (
              <Card className="bg-zinc-900/60 border-zinc-800">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-yellow-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { setFile(null); setUploadedKey(null); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {isUploading && (
                  <div className="px-4 pb-4">
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Legenda */}
            <div>
              <Label className="text-sm text-zinc-400 mb-2 block">Legenda (opcional)</Label>
              <Textarea
                placeholder="Escreva sua legenda..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="mt-2 bg-zinc-900/50 border-zinc-700 min-h-24 placeholder:text-zinc-500 resize-none"
                disabled={!uploadedKey}
              />
            </div>

            {/* Selecionar Perfil */}
            <div>
              <Label className="text-sm text-zinc-400 mb-2 block">profiles</Label>
              <p className="text-xs text-zinc-600 mb-3">
                Select one or more profiles to post to their connected accounts
              </p>
              <Select value={selectedProfileId} onValueChange={setSelectedProfileId} disabled={!uploadedKey}>
                <SelectTrigger className="bg-zinc-900/70 border-zinc-700 h-12 rounded-lg">
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {providersData?.accounts.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="font-medium">{profile.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Plataformas do perfil selecionado */}
            {selectedProfile && connectedAccounts.length > 0 && (
              <div>
                <Label className="text-sm text-zinc-400 mb-3 block">
                  platforms {selectedProfile ? `(from ${selectedProfile.name} profile)` : ""}
                </Label>

                {/* Groups label (pode ser implementado depois) */}
                <div className="mb-3">
                  <p className="text-xs text-zinc-600 mb-1">groups</p>
                  <p className="text-xs text-zinc-700">no groups yet</p>
                </div>

                {/* ScrollArea para as plataformas com altura máxima */}
                <div className="max-h-[280px] overflow-y-auto pr-2 space-y-2 hide-scrollbar">
                  {connectedAccounts.map(acc => {
                    const checked = selectedPlatforms.includes(acc.id);
                    return (
                      <Card
                        key={acc.id}
                        className={cn(
                          "bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-4 cursor-pointer transition-all hover:bg-zinc-900/60",
                          checked && "bg-zinc-900/60 border-zinc-700"
                        )}
                        onClick={() => togglePlatform(acc.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-12 w-12 border-2 border-zinc-800">
                              <AvatarImage src={acc.avatarUrl || undefined} />
                              <AvatarFallback className="bg-zinc-800 text-sm font-bold">
                                {acc.platform[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {/* Ícone da plataforma sobreposto */}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center text-[10px]">
                              {getPlatformIcon(acc.platform)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn("font-medium capitalize text-sm", getPlatformColor(acc.platform))}>
                                {acc.platform}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-sm truncate">
                              @{acc.username || acc.displayName || "conta"}
                            </p>
                          </div>

                          <Checkbox
                            checked={checked}
                            className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlatform(acc.id);
                            }}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Agendamento */}
            <div>
              <Label className="text-sm text-zinc-400 mb-3 block">publishing</Label>
              <Tabs value={postMode} onValueChange={v => setPostMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900/70 h-11">
                  <TabsTrigger
                    value="now"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    Postar Agora
                  </TabsTrigger>
                  <TabsTrigger
                    value="later"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    Agendar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="later" className="mt-4 space-y-3">
                  {/* Data e Hora na mesma linha */}
                  <div className="flex gap-3">
                    {/* Seletor de Data */}
                    <div className="flex-1">
                      <Label className="text-xs text-zinc-500 mb-2 block">Data</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-zinc-900/70 border-zinc-700 h-11"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledAt ? format(scheduledAt, "PPP") : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700">
                          <Calendar
                            mode="single"
                            selected={scheduledAt}
                            onSelect={setScheduledAt}
                            disabled={(e) => {
                              let today = new Date()
                              let yesterday = new Date(today)
                              yesterday.setDate(yesterday.getDate() - 1);
                              return e < yesterday
                            }}

                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Seletor de Hora */}
                    <div className="w-40">
                      <Label className="text-xs text-zinc-500 mb-2 block">Hora</Label>
                      <div className="flex gap-2 items-center">
                        <Select
                          value={scheduledTime.hours}
                          onValueChange={(h) => setScheduledTime(prev => ({ ...prev, hours: h }))}
                        >
                          <SelectTrigger className="bg-zinc-900/70 border-zinc-700 h-11 flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700 max-h-[200px]">
                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                              <SelectItem key={hour} value={hour}>{hour}h</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-zinc-500 text-sm">:</span>
                        <Select
                          value={scheduledTime.minutes}
                          onValueChange={(m) => setScheduledTime(prev => ({ ...prev, minutes: m }))}
                        >
                          <SelectTrigger className="bg-zinc-900/70 border-zinc-700 h-11 flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700 max-h-[200px]">
                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(minute => (
                              <SelectItem key={minute} value={minute}>{minute}min</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Preview da data/hora completa */}
                  {scheduledAt && (
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-zinc-400">Agendado para:</span>
                        <span className="text-white font-medium">
                          {format(getScheduledDateTime() || scheduledAt, "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Botões fixos no rodapé */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-[#0a0a0a]">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-amber-500 text-black font-bold px-8"
            disabled={!canPublish || publishPost.isPending}
            onClick={() => {
              publishPost.mutate({
                videoKey: uploadedKey!,
                caption,
                accountId: selectedProfile?.id!,
                scheduledAt: postMode === "later" ? getScheduledDateTime()?.toISOString() : undefined,
              });
            }}
          >
            {publishPost.isPending ? "Publicando..." : postMode === "now" ? "Publicar Agora" : "Agendar Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
