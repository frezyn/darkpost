"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  ArrowUpRight,
  Calendar,
  Users,
  Activity,
  Eye,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { CartesianGrid, Line, XAxis, LineChart, ResponsiveContainer, Tooltip } from "recharts";

/* ---------------------- Types ---------------------- */
type CardData = {
  scheduled: {
    count: number;
    nextAt?: string;
    sparkline: number[];
    lastSyncedAt?: string;
  };
  published: {
    count: number;
    deltaPct?: number;
    sparkline: number[];
    avgEngagementPct?: number;
    ctrPct?: number;
  };
  engagement: {
    ratePct?: number;
    totalInteractions?: number;
    byType?: { likes?: number; comments?: number; shares?: number };
    deltaPct?: number;
    sparkline: number[];
    topChannel?: string;
  };
  reach: {
    impressions: number;
    deltaPct?: number;
    organicPct?: number;
    campaignsActive?: number;
    sparkline: number[];
  };
  failed: {
    count: number;
    lastError?: string;
    lastAt?: string;
    details?: string[];
  };
  accounts: {
    connected: number;
    expiringSoon: number;
    breakdown: Record<string, number>;
    nextExpirySample?: string;
  };
  lastUpdated: string;
};

type Props = {
  onOpenQueue?: () => void;
  onViewPublished?: () => void;
  onViewEngagement?: () => void;
  onResendFailed?: () => void;
  onManageAccounts?: () => void;
};

/* ---------------------- Demo data ---------------------- */
const DEMO_DATA: CardData = (() => {
  const now = new Date();
  return {
    scheduled: {
      count: 328,
      nextAt: new Date(now.getTime() + 1000 * 60 * 60 * 14).toISOString(),
      sparkline: [12, 18, 22, 28, 32, 36, 40],
      lastSyncedAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
    },
    published: {
      count: 54,
      deltaPct: 15,
      sparkline: [3, 8, 5, 9, 12, 10, 14],
      avgEngagementPct: 2.1,
      ctrPct: 0.8,
    },
    engagement: {
      ratePct: 2.1,
      totalInteractions: 12345,
      byType: { likes: 9200, comments: 2300, shares: 845 },
      deltaPct: 8,
      sparkline: [1.8, 1.9, 2, 2.05, 2.1, 2.15, 2.1],
      topChannel: "Instagram",
    },
    reach: {
      impressions: 120450,
      deltaPct: -4,
      organicPct: 84,
      campaignsActive: 3,
      sparkline: [18000, 20000, 22500, 21000, 19500, 24000, 20000],
    },
    failed: {
      count: 3,
      lastError: "Token expirado (Instagram)",
      lastAt: new Date(now.getTime() - 1000 * 60 * 12).toISOString(),
      details: ["instagram: token_expired", "x: network_error", "facebook: quota_reached"],
    },
    accounts: {
      connected: 18,
      expiringSoon: 2,
      breakdown: { Instagram: 6, Facebook: 5, X: 4, LinkedIn: 3 },
      nextExpirySample: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 6).toISOString(),
    },
    lastUpdated: new Date().toISOString(),
  };
})();

/* ---------------------- Utilities ---------------------- */
const formatDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "-";

const percentLabel = (n?: number) => (n === undefined ? "-" : `${n >= 0 ? "+" : ""}${n}%`);

/* Convert numeric sparkline to recharts-friendly array */
const toChartData = (points: number[]) =>
  points.map((p, i) => ({
    name: `${i}`,
    value: p,
  }));

/* Chart common props */
const chartMargin = { top: 6, right: 8, left: 8, bottom: 6 };

/* ---------------------- Component ---------------------- */
export const DashboardCards: React.FC<Props> = ({
  onOpenQueue,
  onViewPublished,
  onViewEngagement,
  onResendFailed,
  onManageAccounts,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CardData | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(DEMO_DATA);
      setLoading(false);
    }, 120);
    return () => clearTimeout(t);
  }, []);

  const scheduledBadge = useMemo(() => {
    if (!data) return null;
    const next = data.scheduled.nextAt ? new Date(data.scheduled.nextAt) : null;
    if (!next) return null;
    const diffHours = Math.round((next.getTime() - Date.now()) / (1000 * 60 * 60));
    return diffHours <= 24
      ? `Próxima: ${next.toLocaleString("pt-BR", { timeStyle: "short", dateStyle: "short" })}`
      : `Próxima: ${next.toLocaleString("pt-BR", { dateStyle: "short" })}`;
  }, [data]);

  const scheduledChartData = useMemo(() => toChartData(data?.scheduled.sparkline ?? []), [data]);
  const publishedChartData = useMemo(() => toChartData(data?.published.sparkline ?? []), [data]);


  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-3">
        {/* Scheduled Card */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex items-start justify-between gap-2">
            <div>
              <CardDescription>Agendadas</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? "—" : data?.scheduled.count ?? "—"}</CardTitle>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="px-2 py-1">
                <Calendar className="mr-1 h-4 w-4" /> {scheduledBadge ?? "Sem agendamento"}
              </Badge>
            </div>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-2 pt-0 flex-1">
            <div className="text-sm font-medium flex items-center gap-2">
              Próxima publicação:{" "}
              <span className="font-normal text-muted-foreground">
                {loading ? "—" : data ? `${formatDateTime(data.scheduled.nextAt)} • ${data.scheduled.sparkline.length} no dia` : "—"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Última sincronia: {loading ? "—" : data ? formatDateTime(data.scheduled.lastSyncedAt) : "—"}</div>


            {/*
            <div className="mt-2 w-full h-20">
              < ResponsiveContainer width="100%" height="100%">
            <LineChart data={scheduledChartData} margin={chartMargin}>
              <CartesianGrid vertical={false} strokeOpacity={0.04} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
              <Tooltip formatter={(value: any) => [value, "Agendamentos"]} />
              <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
      </div>
          */}

            <div className="flex-1"></div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="ghost" onClick={onOpenQueue}>
                Ver fila
              </Button>
              <Button size="sm">Novo</Button>
            </div>
          </CardFooter>
        </Card >

        < Card className="flex flex-col h-full" >
          <CardHeader className="flex items-start justify-between gap-2">
            <div>
              <CardDescription>Publicadas (hoje)</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? "—" : data?.published.count ?? "—"}</CardTitle>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <ArrowUpRight className="mr-1 h-4 w-4" /> {loading ? "—" : `${data?.published.deltaPct ? (data.published.deltaPct > 0 ? "+" : "") + data.published.deltaPct : "-"}%`}
              </Badge>
            </div>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-2 pt-0 flex-1">
            <div className="text-sm font-medium">Engajamento médio: <span className="font-normal text-muted-foreground">{loading ? "—" : `${data?.published.avgEngagementPct ?? "—"}%`}</span></div>
            <div className="text-xs text-muted-foreground">CTR: {loading ? "—" : data?.published.ctrPct ?? "—"}</div>


            {/*
            <div className="mt-2 w-full h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={publishedChartData} margin={chartMargin}>
                  <CartesianGrid vertical={false} strokeOpacity={0.04} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                  <Tooltip formatter={(value: any) => [value, "Publicadas"]} />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            */}

            <div className="flex-1"></div>

            <div className="mt-3">
              <Button size="sm" onClick={onViewPublished}>Ver posts</Button>
            </div>
          </CardFooter>
        </Card >

        {/* Errors Card (no chart) */}
        < Card className="flex flex-col h-full" >
          <CardHeader className="flex items-start justify-between gap-2">
            <div>
              <CardDescription>Erros</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? "—" : data?.failed.count ?? "—"}</CardTitle>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="destructive" className="px-2 py-1">
                <AlertTriangle className="mr-1 h-4 w-4" /> {loading ? "—" : data?.failed.count && data.failed.count > 0 ? "Requer ação" : "Sem erros"}
              </Badge>
            </div>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-2 pt-0 flex-1">
            <div className="text-sm font-medium flex items-center gap-2">
              Último erro: <span className="font-normal text-muted-foreground">{loading ? "—" : data?.failed.lastError ?? "—"}</span>
            </div>
            <div className="text-xs text-muted-foreground">Última falha: {loading ? "—" : data?.failed.lastAt ? formatDateTime(data.failed.lastAt) : "—"}</div>

            <div className="flex-1"></div>

            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="destructive" onClick={onResendFailed}><RefreshCcw className="mr-2 h-4 w-4" />Reenviar</Button>
              <Button size="sm" variant="ghost">Ver logs</Button>
            </div>
          </CardFooter>
        </Card >

        {/* Accounts Card (no chart) */}
        < Card className="flex flex-col h-full" >
          <CardHeader className="flex items-start justify-between gap-2">
            <div>
              <CardDescription>Contas Conectadas</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">{loading ? "—" : data?.accounts.connected ?? "—"}</CardTitle>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="px-2 py-1">
                <Users className="mr-1 h-4 w-4" /> {loading ? "—" : data?.accounts.expiringSoon ? `${data.accounts.expiringSoon} expirando` : "Tudo ok"}
              </Badge>
            </div>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-2 pt-0 flex-1">
            <div className="text-sm font-medium">
              {loading ? "—" : Object.entries(data!.accounts.breakdown).map(([k, v]) => `${k}: ${v}`).join(" • ")}
            </div>
            <div className="text-xs text-muted-foreground">Renovar tokens antes de: {loading ? "—" : formatDateTime(data?.accounts.nextExpirySample)}</div>

            <div className="flex-1"></div>

            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={onManageAccounts}>Gerenciar</Button>
            </div>
          </CardFooter>
        </Card >
      </div >

      {/* Last updated row (below the scroller) */}
      < div className="px-4 text-sm text-muted-foreground" >
        {loading ? "Carregando dados…" : `Última atualização: ${data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString("pt-BR") : "-"}`}
      </div >
    </div >
  );
};

export default DashboardCards;
