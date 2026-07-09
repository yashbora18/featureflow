import React, { useState } from "react";
import { 
  useListEnvironments,
  useCreateEnvironment,
  useDeleteEnvironment,
  getListEnvironmentsQueryKey
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { 
  Box, 
  CheckCircle2, 
  Copy, 
  Edit2, 
  Flag, 
  MoreVertical, 
  Plus, 
  Trash2 
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function EnvironmentsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: environments = [], 
    isLoading 
  } = useListEnvironments();

  const deleteEnvironment = useDeleteEnvironment({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          getListEnvironmentsQueryKey(),
          (oldEnvs: any) => {
            if (!oldEnvs) return oldEnvs;
            return oldEnvs.filter((e: any) => e.id !== variables.id);
          }
        );
        toast({
          title: "Environment Deleted",
          description: "Environment has been permanently removed.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete environment.",
          variant: "destructive"
        });
      }
    }
  });

  const handleDelete = (id: number, isDefault: boolean) => {
    if (isDefault) {
      toast({
        title: "Cannot delete",
        description: "The default environment cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this environment? This will delete ALL flags associated with it.")) {
      deleteEnvironment.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
            Environments
          </h1>
          <p className="text-muted-foreground">
            Manage your deployment environments and contexts
          </p>
        </div>
        <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border border-primary-border w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Environment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-card border-border overflow-hidden">
              <div className="h-2 w-full bg-muted/30" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/2 bg-muted/50 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-muted/50" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex gap-4 my-4">
                  <Skeleton className="h-10 w-20 rounded bg-muted/50" />
                  <Skeleton className="h-10 w-20 rounded bg-muted/50" />
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-border mt-2">
                <Skeleton className="h-4 w-full bg-muted/50" />
              </CardFooter>
            </Card>
          ))
        ) : environments.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-lg bg-card/50">
            <Box className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
            <h3 className="font-mono text-lg font-medium text-foreground mb-1">No Environments</h3>
            <p className="text-muted-foreground text-sm mb-4">Create your first environment to get started.</p>
            <Button variant="outline" className="font-mono text-xs">Create Environment</Button>
          </div>
        ) : (
          environments.map((env) => (
            <Card key={env.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden group flex flex-col">
              <div 
                className="h-1 w-full" 
                style={{ backgroundColor: env.color || "var(--primary)" }} 
              />
              <CardHeader className="pb-2 relative">
                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] font-mono text-xs border-border bg-popover">
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit2 className="mr-2 h-3.5 w-3.5" />
                        Edit Environment
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Copy className="mr-2 h-3.5 w-3.5" />
                        Clone Keys
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive cursor-pointer"
                        disabled={env.is_default}
                        onClick={() => handleDelete(env.id, env.is_default)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="font-mono text-xl">{env.name}</CardTitle>
                  {env.is_default && (
                    <Badge variant="secondary" className="font-mono text-[10px] bg-secondary text-secondary-foreground border-transparent">
                      DEFAULT
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono">slug: {env.slug}</p>
                {env.description && (
                  <p className="text-sm mt-2 text-foreground/80">{env.description}</p>
                )}
              </CardHeader>
              
              <CardContent className="pb-4 flex-1">
                <div className="grid grid-cols-2 gap-2 mt-4 bg-muted/20 rounded p-3 border border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1">
                      <Flag className="h-3 w-3" /> Total Flags
                    </span>
                    <span className="text-xl font-bold font-mono mt-1">{env.flag_count}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Enabled
                    </span>
                    <span className="text-xl font-bold font-mono mt-1 text-primary">{env.enabled_count}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-3 pb-3 border-t border-border/50 text-[10px] text-muted-foreground font-mono flex justify-between bg-muted/10">
                <span>Created {format(new Date(env.created_at), "MMM yyyy")}</span>
                <span>ID: ENV-{env.id.toString().padStart(4, '0')}</span>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
