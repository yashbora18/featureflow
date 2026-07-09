import React from "react";
import { 
  useGetFlagsSummary, 
  useListAuditLogs 
} from "@workspace/api-client-react";
import { useEnvironment } from "@/context/useEnvironment";
import { format } from "date-fns";
import { 
  Activity, 
  CheckCircle2, 
  FileText, 
  Flag, 
  Layers, 
  ToggleLeft, 
  XCircle 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  loading = false,
  trend = null
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  description?: string;
  loading?: boolean;
  trend?: "up" | "down" | "neutral" | null;
}) {
  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground font-mono">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-20 bg-muted/50" />
        ) : (
          <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { selectedEnvironmentId, selectedEnvironment } = useEnvironment();
  
  const { 
    data: summary, 
    isLoading: isLoadingSummary 
  } = useGetFlagsSummary(
    selectedEnvironmentId !== null ? { environment_id: selectedEnvironmentId } : undefined
  );
  
  const { 
    data: auditLogs, 
    isLoading: isLoadingLogs 
  } = useListAuditLogs({
    environment_id: selectedEnvironmentId ?? undefined,
    limit: 5
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
          System Overview
        </h1>
        <p className="text-muted-foreground">
          {selectedEnvironment 
            ? `Viewing metrics for environment: ${selectedEnvironment.name}`
            : "Viewing metrics across all environments"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Flags"
          value={summary?.total_flags ?? 0}
          icon={Flag}
          loading={isLoadingSummary}
          description="Active feature toggles"
        />
        <StatCard
          title="Enabled Flags"
          value={summary?.enabled_flags ?? 0}
          icon={CheckCircle2}
          loading={isLoadingSummary}
          description="Currently returning true"
        />
        <StatCard
          title="Active Rules"
          value={summary?.targeting_rules_count ?? 0}
          icon={Layers}
          loading={isLoadingSummary}
          description="Complex targeting conditions"
        />
        <StatCard
          title="Recent Changes"
          value={summary?.recent_changes ?? 0}
          icon={Activity}
          loading={isLoadingSummary}
          description="In the last 7 days"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-card-border flex flex-col">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Flags by Type</CardTitle>
            <CardDescription>Distribution of flag return values</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {isLoadingSummary ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full bg-muted/50" />)}
              </div>
            ) : summary?.flags_by_type && Object.keys(summary.flags_by_type).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(summary.flags_by_type).map(([type, count]) => {
                  const percentage = Math.round((count / summary.total_flags) * 100) || 0;
                  return (
                    <div key={type} className="flex items-center">
                      <div className="w-24 text-sm font-medium capitalize font-mono text-muted-foreground">{type}</div>
                      <div className="flex-1 ml-4">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm font-mono">{count}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 font-mono text-sm border border-dashed border-border rounded-md">
                No flags found
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-card-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-mono text-lg">Recent Audit Logs</CardTitle>
              <CardDescription>Latest system changes</CardDescription>
            </div>
            <Link href="/audit-logs" className="text-sm font-mono text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded bg-muted/50" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4 bg-muted/50" />
                      <Skeleton className="h-3 w-1/2 bg-muted/50" />
                    </div>
                  </div>
                ))}
              </div>
            ) : auditLogs?.items && auditLogs.items.length > 0 ? (
              <div className="space-y-6">
                {auditLogs.items.map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className="mt-0.5 bg-muted rounded p-1.5 border border-border text-muted-foreground">
                      {log.entity_type === "flag" ? <Flag className="h-4 w-4" /> : 
                       log.entity_type === "environment" ? <Layers className="h-4 w-4" /> : 
                       <FileText className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <span className="capitalize">{log.action}</span>{" "}
                        <span className="font-mono text-primary">{log.entity_type}</span>
                        {log.entity_name && (
                          <span>: <span className="font-mono text-foreground">{log.entity_name}</span></span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        <span>{format(new Date(log.created_at), "MMM d, HH:mm:ss")}</span>
                        {log.environment_name && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-[10px] h-4 py-0 px-1 bg-muted/50">
                              {log.environment_name}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 font-mono text-sm border border-dashed border-border rounded-md">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
