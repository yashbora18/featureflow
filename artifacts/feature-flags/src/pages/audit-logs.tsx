import React, { useState } from "react";
import { useListAuditLogs } from "@workspace/api-client-react";
import { useEnvironment } from "@/context/useEnvironment";
import { format } from "date-fns";
import { 
  Activity, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  FileText, 
  Filter, 
  Flag, 
  Layers, 
  Search, 
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 15;

export default function AuditLogsPage() {
  const { selectedEnvironmentId, selectedEnvironment } = useEnvironment();
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState<string>("all");
  
  const { 
    data: auditData, 
    isLoading 
  } = useListAuditLogs({
    environment_id: selectedEnvironmentId ?? undefined,
    action: actionFilter !== "all" ? actionFilter : null,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE
  });

  const totalPages = auditData ? Math.ceil(auditData.total / PAGE_SIZE) : 0;

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-primary border-primary/30 bg-primary/10';
      case 'deleted': return 'text-destructive border-destructive/30 bg-destructive/10';
      case 'updated': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'toggled': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      default: return 'text-muted-foreground border-border bg-muted';
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'flag': return <Flag className="h-4 w-4" />;
      case 'environment': return <Layers className="h-4 w-4" />;
      case 'targeting_rule': return <Filter className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
            Audit Logs
          </h1>
          <p className="text-muted-foreground">
            System-wide chronological record of all changes
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground bg-card px-3 py-1.5 rounded-md border border-border">
          <Activity className="h-4 w-4 text-primary" />
          <span>Tracking Active</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground w-16">ACTION:</span>
          <Select 
            value={actionFilter} 
            onValueChange={(val) => {
              setActionFilter(val);
              setPage(0); // Reset page on filter change
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background border-border font-mono text-xs">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border font-mono text-xs">
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="toggled">Toggled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedEnvironment && (
          <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-4">
            <span className="text-sm font-mono text-muted-foreground">ENV FILTER:</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono">
              {selectedEnvironment.name}
            </Badge>
          </div>
        )}
      </div>

      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs font-medium text-muted-foreground w-[180px]">TIMESTAMP</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground w-[120px]">ACTION</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">ENTITY</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground w-[180px]">ENVIRONMENT</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground w-[150px]">USER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index} className="border-border">
                  <TableCell><Skeleton className="h-5 w-32 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full bg-muted/50" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded bg-muted/50" />
                      <Skeleton className="h-5 w-48 bg-muted/50" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 bg-muted/50" /></TableCell>
                </TableRow>
              ))
            ) : auditData?.items.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground font-mono">
                    <FileText className="h-8 w-8 mb-2 opacity-20" />
                    <p>No audit logs found for the selected filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              auditData?.items.map((log) => (
                <TableRow key={log.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 opacity-50" />
                      {format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-mono text-[10px] uppercase ${getActionColor(log.action)}`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-muted p-1 rounded border border-border text-muted-foreground">
                        {getEntityIcon(log.entity_type)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-muted-foreground">{log.entity_type}</span>
                        {log.entity_name ? (
                          <span className="font-mono font-medium text-foreground">{log.entity_name}</span>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">ID: {log.entity_id}</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.environment_name ? (
                      <span className="font-mono text-xs border border-border px-2 py-0.5 rounded bg-background">
                        {log.environment_name}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground opacity-50">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <User className="h-3 w-3 opacity-50" />
                      {log.user_id || "System"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {auditData && auditData.total > PAGE_SIZE && (
        <div className="flex items-center justify-between bg-card p-4 border border-border rounded-lg">
          <div className="text-xs font-mono text-muted-foreground">
            Showing <span className="text-foreground">{page * PAGE_SIZE + 1}</span> to <span className="text-foreground">{Math.min((page + 1) * PAGE_SIZE, auditData.total)}</span> of <span className="text-foreground">{auditData.total}</span> entries
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background border-border font-mono text-xs"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <div className="flex items-center justify-center px-3 font-mono text-xs border border-border rounded bg-muted/50">
              Page {page + 1} of {totalPages || 1}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background border-border font-mono text-xs"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
