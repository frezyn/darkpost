"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Info, RefreshCw } from "lucide-react";
import { useSession } from "@workspace/auth";
import { useTRPCClient } from "@/utils/trpc";
import { toast } from "sonner";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";


type ProviderKey = "google" | "discord";

type ConnectedAccount = {
  provider: ProviderKey;
  connected: boolean;
  email?: string | null;
  connectedAt?: string | null;
};

const DEFAULT_PROVIDERS: ProviderKey[] = ["google", "discord"];

function ProviderLogo({ provider, className }: { provider: ProviderKey; className?: string }) {
  if (provider === "google") {
    return (
      <svg viewBox="0 0 533.5 544.3" className={className} aria-hidden>
        <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.6-37-4.8-54.6H272v103.3h146.9c-6.4 34.6-25 63.9-53.3 83.5v69.4h86.2c50.5-46.6 81.7-115.2 81.7-201.6z" />
        <path fill="#34A853" d="M272 544.3c72.6 0 133.7-24.1 178.2-65.4l-86.2-69.4c-24 16.2-54.8 25.8-92 25.8-70.8 0-130.8-47.9-152.2-112.4H30.7v70.8C75.2 483.4 167 544.3 272 544.3z" />
        <path fill="#FBBC05" d="M119.8 322.9c-10.8-31.9-10.8-66.3 0-98.2V154h-88.9C8.9 204.5 0 236.9 0 272s8.9 67.5 30.9 118l88.9-67.1z" />
        <path fill="#EA4335" d="M272 107.7c39.4 0 74.6 13.6 102.4 40.4l76.8-76.8C405.7 27.6 348.6 0 272 0 167 0 75.2 60.9 30.7 154l88.9 70.5C141.2 155.6 201.2 107.7 272 107.7z" />
      </svg>
    );
  }
  if (provider === "discord") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
        <path fill="#8c9eff" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"></path>
      </svg>
    );
  }

}

export default function Settings() {
  const { data } = useSession();
  const [nameCssBuy, setNameCssBuy] = useState("");
  const [inviteUser, setInviteUser] = useState("");
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trpc = useTRPCClient();

  // Connected accounts state
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(
    DEFAULT_PROVIDERS.map((p) => ({ provider: p, connected: false }))
  );
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAccounts() {
    setLoadingAccounts(true);
    setAccountsError(null);
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Erro ao carregar contas");
      const data: ConnectedAccount[] = await res.json();
      const map = new Map(data.map((d) => [d.provider, d]));
      const merged = DEFAULT_PROVIDERS.map((p) => map.get(p) ?? { provider: p, connected: false });
      setAccounts(merged);
    } catch (err: any) {
      setAccountsError(err?.message ?? "Erro desconhecido");
    } finally {
      setLoadingAccounts(false);
    }
  } <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
    <path fill="#8c9eff" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"></path>
  </svg>

  async function connectProvider(provider: ProviderKey) {
    try {
      const res = await fetch(`/api/oauth/${provider}`, { method: "POST" });
      if (!res.ok) throw new Error("Não foi possível iniciar OAuth");
      const body = await res.json();
      const redirectUrl = body?.redirectUrl;
      if (redirectUrl) {
        // redireciona para o provedor (fluxo real)
        window.location.href = redirectUrl;
        return;
      }
      // Mock fallback para desenvolvimento: marca como conectado localmente
      setAccounts((prev) => prev.map((a) => (a.provider === provider ? { ...a, connected: true, email: `${provider}@exemplo.test`, connectedAt: new Date().toISOString() } : a)));
      toast.success(`${provider} conectado`);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao conectar: " + (err?.message ?? "desconhecido"));
    }
  }

  async function disconnectProvider(provider: ProviderKey) {
    try {
      const res = await fetch(`/api/accounts/${provider}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Não foi possível desconectar");
      setAccounts((prev) => prev.map((a) => (a.provider === provider ? { ...a, connected: false, email: null, connectedAt: null } : a)));
      toast.success(`${provider} desconectado`);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao desconectar: " + (err?.message ?? "desconhecido"));
    }
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background pt-4 md:gap-8 mt-8">
      {/* Contas Conectadas - mantendo a mesma aparência shadcn/ui-like */}
      <Card>
        <CardHeader>
          <CardTitle>Contas Conectadas</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Gerencie suas conexões externas (Google, Discord, Telegram)
            <Button
              variant="ghost"
              size="sm"
              className="ml-3"
              onClick={() => fetchAccounts()}
              aria-label="Atualizar conexões"
            >
              <RefreshCw className="mr-2" />
              {loadingAccounts ? "Atualizando..." : "Atualizar"}
            </Button>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {accountsError ? <div className="text-sm text-destructive">Erro: {accountsError}</div> : null}

          <div className="flex flex-col gap-3">
            {accounts.map((a) => (
              <div key={a.provider} className="flex items-center justify-between gap-4 p-3 border rounded-md bg-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                    <ProviderLogo provider={a.provider} className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{a.provider}</span>
                      {a.connected ? (
                        <span className="text-xs text-green-400">conectado</span>
                      ) : (
                        <span className="text-xs text-zinc-400">não conectado</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {a.connected ? a.email ?? "Conta conectada" : "Nenhuma conta conectada"}
                    </div>
                    {a.connectedAt ? (
                      <div className="text-xs text-muted-foreground mt-1">
                        Conectado em {new Date(a.connectedAt).toLocaleString()}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {a.connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          await fetchAccounts();
                          toast.success("Atualizado");
                        }}
                      >
                        Atualizar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await disconnectProvider(a.provider);
                        }}
                      >
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={async () => {
                        await connectProvider(a.provider);
                      }}
                    >
                      Conectar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Observação: ao conectar, você poderá ser redirecionado para o fluxo OAuth do provedor.
          </div>
        </CardContent>
      </Card>
    </main >
  );
}
