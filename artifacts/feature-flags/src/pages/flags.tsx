import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  useListFlags, 
  useToggleFlag, 
  useDeleteFlag,
  getListFlagsQueryKey
} from "@workspace/api-client-react";
import type { Flag } from "@workspace/api-client-react";
import { useEnvironment } from "@/context/useEnvironment";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  ToggleLeft,
  User,
  FlaskConical
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { FlagFormDialog } from "@/components/flag-form-dialog";
import { EvaluateFlagDialog } from "@/components/evaluate-flag-dialog";

export default function FlagsPage() {
  const { selectedEnvironmentId, selectedEnvironment } = useEnvironment();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editFlag, setEditFlag] = useState<Flag | null>(null);
  const [evaluateFlag, setEvaluateFlag] = useState<Flag | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: flags = [], 
    isLoading 
  } = useListFlags({ 
    environment_id: selectedEnvironmentId ?? undefined,
    search: search.length > 2 ? search : undefined,
  });

  const toggleFlag = useToggleFlag({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(
          getListFlagsQueryKey({ 
            environment_id: selectedEnvironmentId ?? undefined,
            search: search.length > 2 ? search : undefined,
          }),
          (oldFlags: Flag[] | undefined) => {
            if (!oldFlags) return oldFlags;
            return oldFlags.map((f) => f.id === data.id ? { ...f, enabled: data.enabled } : f);
          }
        );
        toast({
          title: "Flag Updated",
          description: `${data.key} is now ${data.enabled ? "enabled" : "disabled"}.`,
        });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to toggle feature flag.", variant: "destructive" });
      }
    }
  });

  const deleteFlag = useDeleteFlag({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          getListFlagsQueryKey({ 
            environment_id: selectedEnvironmentId ?? undefined,
            search: search.length > 2 ? search : undefined,
          }),
          (oldFlags: Flag[] | undefined) => {
            if (!oldFlags) return oldFlags;
            return oldFlags.filter((f) => f.id !== variables.id);
          }
        );
        toast({ title: "Flag Deleted", description: "Feature flag permanently removed." });
      }
    }
  });

  const handleToggle = (id: number) => toggleFlag.mutate({ id });

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this flag? This cannot be undone.")) {
      deleteFlag.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
            Feature Flags
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage feature toggles across environments
          </p>
        </div>
        <Button
          className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Flag
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by key or name..."
            className="pl-8 bg-card border-border font-mono text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {selectedEnvironment && (
          <Badge variant="outline" className="bg-card font-mono text-xs border-primary/30 text-primary px-3 py-1 shrink-0">
            ENV: {selectedEnvironment.name}
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">FLAG KEY</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">ENVIRONMENT</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">TYPE</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">OWNER</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">STATUS</TableHead>
              <TableHead className="font-mono text-xs font-medium text-muted-foreground">LAST UPDATED</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-5 w-48 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12 rounded-full bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32 bg-muted/50" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-md bg-muted/50" /></TableCell>
                </TableRow>
              ))
            ) : flags.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground font-mono">
                    <ToggleLeft className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">No flags found.</p>
                    <button
                      className="mt-2 text-xs text-primary underline underline-offset-2"
                      onClick={() => setCreateOpen(true)}
                    >
                      Create the first flag
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              flags.map((flag) => (
                <TableRow
                  key={flag.id}
                  className="border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/flags/${flag.id}`)}
                >
                  {/* Key + name */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-foreground">{flag.key}</span>
                      <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{flag.name}</span>
                    </div>
                  </TableCell>
                  {/* Environment */}
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] bg-background">
                      {flag.environment_name}
                    </Badge>
                  </TableCell>
                  {/* Type */}
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground px-2 py-1 bg-background border border-border rounded">
                      {flag.flag_type}
                    </span>
                  </TableCell>
                  {/* Owner */}
                  <TableCell>
                    {flag.owner ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[120px]">{flag.owner}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40 font-mono">—</span>
                    )}
                  </TableCell>
                  {/* Status toggle */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggle(flag.id)}
                        disabled={toggleFlag.isPending && toggleFlag.variables?.id === flag.id}
                        className="data-[state=checked]:bg-primary"
                      />
                      <span className={`text-xs font-mono ${flag.enabled ? "text-primary" : "text-muted-foreground"}`}>
                        {flag.enabled ? "ON" : "OFF"}
                      </span>
                    </div>
                  </TableCell>
                  {/* Date */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {format(new Date(flag.updated_at), "MMM dd, HH:mm")}
                  </TableCell>
                  {/* Actions */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] font-mono text-xs border-border bg-popover">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setEditFlag(flag)}
                        >
                          <Edit className="mr-2 h-3.5 w-3.5" />
                          Edit Flag
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setEvaluateFlag(flag)}
                        >
                          <FlaskConical className="mr-2 h-3.5 w-3.5" />
                          Evaluate Flag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDelete(flag.id)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete Flag
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog */}
      <FlagFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultEnvironmentId={selectedEnvironmentId}
      />

      {/* Edit dialog */}
      <FlagFormDialog
        open={!!editFlag}
        onOpenChange={(open) => { if (!open) setEditFlag(null); }}
        flag={editFlag ?? undefined}
      />

      {/* Evaluate dialog */}
      {evaluateFlag && (
        <EvaluateFlagDialog
          open={!!evaluateFlag}
          onOpenChange={(open) => { if (!open) setEvaluateFlag(null); }}
          flag={evaluateFlag}
        />
      )}
    </div>
  );
}
