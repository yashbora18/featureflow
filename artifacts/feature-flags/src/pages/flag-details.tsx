import type { ReactNode } from "react";
import { useParams, Link } from "wouter";
import { useGetFlag, getGetFlagQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ArrowLeft, User, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnvironment } from "@/context/useEnvironment";

export default function FlagDetailsPage() {
  const params = useParams<{ id: string }>();
  const flagId = Number(params.id);
  const { environments } = useEnvironment();

  const {
    data: flag,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFlag(flagId, {
    query: {
      queryKey: getGetFlagQueryKey(flagId),
      enabled: Number.isFinite(flagId),
    },
  });

  const environment = environments.find((e) => e.id === flag?.environment_id);

  if (!Number.isFinite(flagId)) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive font-mono">
          Invalid flag id.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Skeleton className="h-9 w-64 bg-muted/50" />
        <div className="rounded-md border border-border bg-card p-6 space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !flag) {
    const status = (error as { status?: number } | undefined)?.status;
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-destructive font-mono">
              {status === 404 ? "Flag not found." : "Failed to load flag details."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs border-border"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {flag.key}
            </h1>
            <Badge
              variant={flag.enabled ? "default" : "secondary"}
              className={`font-mono text-xs ${
                flag.enabled
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {flag.enabled ? (
                <ToggleRight className="mr-1 h-3.5 w-3.5" />
              ) : (
                <ToggleLeft className="mr-1 h-3.5 w-3.5" />
              )}
              {flag.enabled ? "ENABLED" : "DISABLED"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{flag.name}</p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card divide-y divide-border">
        <DetailRow label="Flag Key" value={<span className="font-mono">{flag.key}</span>} />
        <DetailRow
          label="Flag Type"
          value={
            <span className="font-mono text-xs px-2 py-1 bg-background border border-border rounded">
              {flag.flag_type}
            </span>
          }
        />
        <DetailRow
          label="Default Value"
          value={
            flag.default_value ? (
              <span className="font-mono">{flag.default_value}</span>
            ) : (
              <span className="text-muted-foreground/40 font-mono">—</span>
            )
          }
        />
        <DetailRow
          label="Current Status"
          value={
            <span className={`font-mono ${flag.enabled ? "text-primary" : "text-muted-foreground"}`}>
              {flag.enabled ? "ON" : "OFF"}
            </span>
          }
        />
        <DetailRow
          label="Description"
          value={
            flag.description ? (
              <span>{flag.description}</span>
            ) : (
              <span className="text-muted-foreground/40 font-mono">No description provided</span>
            )
          }
        />
        <DetailRow
          label="Owner"
          value={
            flag.owner ? (
              <div className="flex items-center gap-1.5 font-mono">
                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                {flag.owner}
              </div>
            ) : (
              <span className="text-muted-foreground/40 font-mono">Unassigned</span>
            )
          }
        />
        <DetailRow
          label={t("environment.environment")}
          value={
            <Badge
              variant="outline"
              className="font-mono text-[10px] bg-background"
              style={environment ? { borderColor: environment.color } : undefined}
            >
              {flag.environment_name}
            </Badge>
          }
        />
        <DetailRow label="Version" value={<span className="font-mono">v{flag.version}</span>} />
        <DetailRow
          label="Last Updated"
          value={<span className="font-mono">{format(new Date(flag.updated_at), "MMM dd, yyyy HH:mm")}</span>}
        />
      </div>

      <div className="rounded-md border border-border bg-card p-6">
        <h2 className="text-sm font-mono font-medium text-muted-foreground mb-2">TARGETING RULES</h2>
        <div className="flex items-center justify-center h-24 rounded-md border border-dashed border-border text-muted-foreground font-mono text-sm">
          Coming in Milestone 2
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/flags"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-mono"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to Flags
    </Link>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <span className="text-xs font-mono font-medium text-muted-foreground shrink-0">
        {label.toUpperCase()}
      </span>
      <div className="text-sm text-foreground text-right">{value}</div>
    </div>
  );
}
