"use client";

import { useState } from "react";
import { Search, Plus, Copy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog";
import { AddAccountModal } from "./components/dialogAddAccount";
import { useSession } from "@workspace/auth";

// Ícones (mantidos)
const platformIcons = {
  tiktok: () => (
    <svg width="48px" height="48px" viewBox="0 0 48 48" fill="currentColor">
      <path d="M38.0766847,15.8542954 C36.0693906,15.7935177 34.2504839,14.8341149 32.8791434,13.5466056 C32.1316475,12.8317108 31.540171,11.9694126 31.1415066,11.0151329 C30.7426093,10.0603874 30.5453728,9.03391952 30.5619062,8 L24.9731521,8 L24.9731521,28.8295196 C24.9731521,32.3434487 22.8773693,34.4182737 20.2765028,34.4182737 C19.6505623,34.4320127 19.0283477,34.3209362 18.4461858,34.0908659 C17.8640239,33.8612612 17.3337909,33.5175528 16.8862248,33.0797671 C16.4386588,32.6422142 16.0833071,32.1196657 15.8404292,31.5426268 C15.5977841,30.9658208 15.4727358,30.3459348 15.4727358,29.7202272 C15.4727358,29.0940539 15.5977841,28.4746337 15.8404292,27.8978277 C16.0833071,27.3207888 16.4386588,26.7980074 16.8862248,26.3604545 C17.3337909,25.9229017 17.8640239,25.5791933 18.4461858,25.3491229 C19.0283477,25.1192854 19.6505623,25.0084418 20.2765028,25.0219479 C20.7939283,25.0263724 21.3069293,25.1167239 21.794781,25.2902081 L21.794781,19.5985278 C21.2957518,19.4900128 20.7869423,19.436221 20.2765028,19.4380839 C18.2431278,19.4392483 16.2560928,20.0426009 14.5659604,21.1729264 C12.875828,22.303019 11.5587449,23.9090873 10.7814424,25.7878401 C10.003907,27.666593 9.80084889,29.7339663 10.1981162,31.7275214 C10.5953834,33.7217752 11.5748126,35.5530237 13.0129853,36.9904978 C14.4509252,38.4277391 16.2828722,39.4064696 18.277126,39.8028054 C20.2711469,40.1991413 22.3382874,39.9951517 24.2163416,39.2169177 C26.0948616,38.4384508 27.7002312,37.1209021 28.8296253,35.4300711 C29.9592522,33.7397058 30.5619062,31.7522051 30.5619062,29.7188301 L30.5619062,18.8324027 C32.7275484,20.3418321 35.3149087,21.0404263 38.0766847,21.0867664 L38.0766847,15.8542954 Z" fill="currentColor" />
    </svg>
  ),
  youtube: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  facebook: () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};

const platformConfig = [
  { key: "tiktok" as const, name: "TikTok", icon: platformIcons.tiktok },
  { key: "youtube" as const, name: "YouTube", icon: platformIcons.youtube },
  { key: "facebook" as const, name: "Facebook", icon: platformIcons.facebook },
];

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<any>(null); // Você controla manualmente

  const { data: session } = useSession();
  const trpc = useTRPC();

  const { data: profilesData, isLoading } = useQuery(
    trpc.providers.GetAllProvidersFromAccount.queryOptions()
  );

  const disconnectMutation = useMutation(
    trpc.providers.disconnectAccount.mutationOptions()
  );

  const profiles = profilesData?.accounts || [];
  const filteredProfiles = profiles.filter((profile: any) =>
    profile.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectProfile = (profile: any) => {
    setSelectedProfile(profile);
    // URL você adiciona depois, quando quiser
  };

  const connectAccount = (platform: string) => {
    if (!session?.user?.id || !selectedProfile?.id) return;
    // router.replace(...) você coloca depois
    alert(`Conectar ${platform} - Implementar depois`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Perfis</h1>
          <p className="text-gray-500 mt-2">Gerencie seus perfis e contas conectadas</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="relative flex-1 mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar perfil"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mb-6 bg-yellow-500 text-black hover:bg-yellow-400">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo perfil
                </Button>
              </DialogTrigger>
              <AddAccountModal />
            </Dialog>

            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-zinc-500 py-8">Carregando...</p>
              ) : filteredProfiles.map((profile: any) => (
                <button
                  key={profile.id}
                  onClick={() => selectProfile(profile)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all border",
                    selectedProfile?.id === profile.id
                      ? "bg-zinc-900 border-yellow-500/40 shadow-lg shadow-yellow-500/10"
                      : "bg-zinc-950/50 border-transparent hover:bg-zinc-900/60"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-600 text-black text-sm font-bold">
                        {profile.name?.slice(0, 2).toUpperCase() || "PF"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.name || "Sem nome"}</p>
                      <p className="text-xs text-gray-500">
                        {profile.connectedAccounts?.length || 0} conta(s)
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-3">
            {selectedProfile ? (
              <>
                <Card className="bg-zinc-900/70 border-zinc-800 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-5">
                    <Avatar className="h-16 w-16 ring-4 ring-yellow-500/30">
                      <AvatarImage src={selectedProfile.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-600 text-black text-2xl font-bold">
                        {selectedProfile.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Criado em {format(new Date(selectedProfile.createdAt), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  {platformConfig.map(({ key, name, icon: Icon }) => {
                    const account = selectedProfile.connectedAccounts?.find(
                      (a: any) => a.platform.toLowerCase() === key
                    );
                    const isConnected = !!account;

                    return (
                      <Card key={key} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
                              <Icon />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{name}</h4>
                              {isConnected ? (
                                <p className="text-2xl font-medium text-yellow-500 mt-1">
                                  @{account.username || account.displayName}
                                </p>
                              ) : (
                                <p className="text-gray-500 mt-2">Conta não conectada</p>
                              )}
                            </div>
                          </div>

                          <div>
                            {isConnected ? (
                              <Button
                                variant="destructive"
                                onClick={async () => await disconnectMutation.mutateAsync({ id: account.id, provider: key })}
                              >
                                Desconectar
                              </Button>
                            ) : (
                              <Button
                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                                onClick={() => connectAccount(key)}
                              >
                                + Conectar
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-8">
                  <Search className="h-16 w-16 text-zinc-700" />
                </div>
                <h3 className="text-3xl font-semibold mb-3">Nenhum perfil selecionado</h3>
                <p className="text-zinc-500 text-lg">Selecione um perfil para gerenciar suas contas</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
