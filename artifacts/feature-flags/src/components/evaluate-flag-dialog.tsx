import React, { useState } from "react";
import { useEvaluateFlag } from "@workspace/api-client-react";
import type { Flag } from "@workspace/api-client-react";
import { useEnvironment } from "@/context/useEnvironment";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface EvaluateFlagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flag: Flag;
}

const reasonLabel: Record<string, string> = {
  flag_enabled: "Flag is active in this environment",
  flag_disabled: "Flag is disabled in this environment",
  flag_not_found: "Flag not found in this environment",
  environment_not_found: "Environment not found",
};

export function EvaluateFlagDialog({ open, onOpenChange, flag }: EvaluateFlagDialogProps) {
  const { environments } = useEnvironment();

  // Default to the flag's own environment
  const [selectedEnv, setSelectedEnv] = useState(
    environments.find((e) => e.id === flag.environment_id)?.name ?? ""
  );

  const evaluateMutation = useEvaluateFlag({
    mutation: {},
  });

  const handleEvaluate = () => {
    if (!selectedEnv) return;
    evaluateMutation.mutate({
      data: { flag_key: flag.key, environment: selectedEnv },
    });
  };

  const result = evaluateMutation.data;
  const isPending = evaluateMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) evaluateMutation.reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-[440px] bg-card border-border text-foreground font-mono">
        <DialogHeader>
          <DialogTitle className="text-lg font-mono">EVALUATE_FLAG</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-mono">
            Run the evaluation engine for{" "}
            <span className="text-foreground font-semibold">{flag.key}</span> against a selected
            environment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Flag key (read-only display) */}
          <div className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground">FLAG KEY</Label>
            <div className="rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-foreground">
              {flag.key}
            </div>
          </div>

          {/* Environment selector */}
          <div className="space-y-1">
            <Label className="text-xs font-mono text-muted-foreground">ENVIRONMENT</Label>
            <Select value={selectedEnv} onValueChange={setSelectedEnv}>
              <SelectTrigger className="font-mono text-sm bg-background border-border">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent className="font-mono bg-popover border-border">
                {environments.map((env) => (
                  <SelectItem key={env.id} value={env.name}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: env.color }}
                      />
                      {env.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result panel */}
          {result && (
            <div
              className={`rounded-md border px-4 py-3 space-y-2 ${
                result.enabled
                  ? "border-primary/40 bg-primary/5"
                  : "border-muted-foreground/30 bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">RESULT</span>
                <div className="flex items-center gap-2">
                  {result.enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge
                    variant={result.enabled ? "default" : "secondary"}
                    className={`font-mono text-xs ${
                      result.enabled
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {result.enabled ? "ENABLED" : "DISABLED"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-border/50">
                <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs font-mono text-muted-foreground">
                  {reasonLabel[result.reason] ?? result.reason}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50 text-[11px] font-mono text-muted-foreground/70">
                <span>key: {result.flag_key}</span>
                <span>env: {result.environment}</span>
              </div>
            </div>
          )}

          {evaluateMutation.isError && (
            <p className="text-xs text-destructive font-mono">
              Evaluation failed. Please try again.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-mono text-xs border-border"
          >
            CLOSE
          </Button>
          <Button
            type="button"
            onClick={handleEvaluate}
            disabled={!selectedEnv || isPending}
            className="font-mono text-xs bg-primary text-primary-foreground"
          >
            {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            RUN EVALUATE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
