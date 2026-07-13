import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateFlag,
  useUpdateFlag,
} from "@workspace/api-client-react";
import type { Flag } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useListEnvironments } from "@workspace/api-client-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface FlagFormValues {
  key: string;
  name: string;
  description: string;
  flag_type: string;
  default_value: string;
  enabled: boolean;
  owner: string;
  environment_id: string;
}

interface FlagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flag?: Flag;
  defaultEnvironmentId?: number | null;
}

export function FlagFormDialog({
  open,
  onOpenChange,
  flag,
  defaultEnvironmentId,
}: FlagFormDialogProps) {
  const isEdit = !!flag;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: environments = [] } = useListEnvironments();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FlagFormValues>({
    defaultValues: {
      key: "",
      name: "",
      description: "",
      flag_type: "boolean",
      default_value: "",
      enabled: false,
      owner: "",
      environment_id: String(defaultEnvironmentId ?? ""),
    },
  });

  useEffect(() => {
    if (open) {
      if (flag) {
        reset({
          key: flag.key,
          name: flag.name,
          description: flag.description ?? "",
          flag_type: flag.flag_type,
          default_value: flag.default_value ?? "",
          enabled: flag.enabled,
          owner: flag.owner ?? "",
          environment_id: String(flag.environment_id),
        });
      } else {
        reset({
          key: "",
          name: "",
          description: "",
          flag_type: "boolean",
          default_value: "",
          enabled: false,
          owner: "",
          environment_id: String(defaultEnvironmentId ?? ""),
        });
      }
    }
  }, [open, flag, defaultEnvironmentId, reset]);

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/flags"] });
    queryClient.invalidateQueries({ queryKey: ["/api/flags/summary"] });
  };

  const createFlag = useCreateFlag({
    mutation: {
      onSuccess: (data) => {
        invalidateQueries();
        toast({
          title: "Flag Created",
          description: `${data.key} was created successfully.`,
        });
        onOpenChange(false);
      },
      onError: (err: any) => {
        const detail = err?.data?.detail ?? "Failed to create flag.";
        toast({ title: "Error", description: detail, variant: "destructive" });
      },
    },
  });

  const updateFlag = useUpdateFlag({
    mutation: {
      onSuccess: (data) => {
        invalidateQueries();
        toast({ title: "Flag Updated", description: `${data.key} was updated.` });
        onOpenChange(false);
      },
      onError: (err: any) => {
        const detail = err?.data?.detail ?? "Failed to update flag.";
        toast({ title: "Error", description: detail, variant: "destructive" });
      },
    },
  });

  const isPending = createFlag.isPending || updateFlag.isPending;
  const flagType = watch("flag_type");
  const enabledValue = watch("enabled");

  const onSubmit = (values: FlagFormValues) => {
    if (isEdit) {
      updateFlag.mutate({
        id: flag!.id,
        data: {
          name: values.name,
          description: values.description || undefined,
          flag_type: values.flag_type as any,
          default_value: values.default_value || undefined,
          enabled: values.enabled,
          owner: values.owner || undefined,
        },
      });
    } else {
      const envId = parseInt(values.environment_id, 10);
      createFlag.mutate({
        data: {
          key: values.key,
          name: values.name,
          description: values.description || undefined,
          flag_type: values.flag_type as any,
          default_value: values.default_value || undefined,
          enabled: values.enabled,
          owner: values.owner || undefined,
          environment_id: envId,
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-card border-border text-foreground font-mono">
        <DialogHeader>
          <DialogTitle className="text-lg font-mono">
            {isEdit ? `EDIT_FLAG :: ${flag!.key}` : "CREATE_FLAG"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-mono">
            {isEdit
              ? "Modify flag metadata. Key and environment are immutable."
              : "Define a new feature flag. Key must be unique within its environment."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Key — create mode only */}
          {!isEdit && (
            <div className="space-y-1">
              <Label htmlFor="key" className="text-xs font-mono text-muted-foreground">
                FLAG KEY <span className="text-destructive">*</span>
              </Label>
              <Input
                id="key"
                placeholder="e.g. new-checkout-flow"
                className="font-mono text-sm bg-background border-border"
                {...register("key", {
                  required: "Key is required",
                  pattern: {
                    value: /^[a-z0-9][a-z0-9-_.]*$/,
                    message: "Lowercase letters, numbers, hyphens, underscores, dots only",
                  },
                })}
              />
              {errors.key && (
                <p className="text-xs text-destructive font-mono">{errors.key.message}</p>
              )}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-mono text-muted-foreground">
              DISPLAY NAME <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. New Checkout Flow"
              className="font-mono text-sm bg-background border-border"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-mono">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs font-mono text-muted-foreground">
              DESCRIPTION
            </Label>
            <Textarea
              id="description"
              placeholder="What does this flag control?"
              rows={2}
              className="font-mono text-sm bg-background border-border resize-none"
              {...register("description")}
            />
          </div>

          {/* Type + Owner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-mono text-muted-foreground">TYPE</Label>
              <Select
                value={flagType}
                onValueChange={(v) => setValue("flag_type", v)}
              >
                <SelectTrigger className="font-mono text-sm bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono bg-popover border-border">
                  <SelectItem value="boolean">boolean</SelectItem>
                  <SelectItem value="string">string</SelectItem>
                  <SelectItem value="number">number</SelectItem>
                  <SelectItem value="json">json</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="owner" className="text-xs font-mono text-muted-foreground">
                OWNER TEAM
              </Label>
              <Input
                id="owner"
                placeholder="e.g. platform-team"
                className="font-mono text-sm bg-background border-border"
                {...register("owner")}
              />
            </div>
          </div>

          {/* Default value */}
          <div className="space-y-1">
            <Label htmlFor="default_value" className="text-xs font-mono text-muted-foreground">
              DEFAULT VALUE
              <span className="ml-2 text-muted-foreground/60">
                ({flagType === "boolean"
                  ? "true / false"
                  : flagType === "number"
                  ? "numeric"
                  : "any"})
              </span>
            </Label>
            <Input
              id="default_value"
              placeholder={
                flagType === "boolean" ? "false" : flagType === "number" ? "0" : ""
              }
              className="font-mono text-sm bg-background border-border"
              {...register("default_value")}
            />
          </div>

          {/* Enabled toggle */}
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
            <div>
              <p className="text-xs font-mono text-muted-foreground">ENABLED</p>
              <p className="text-[11px] text-muted-foreground/60 font-mono mt-0.5">
                {enabledValue ? "Flag is active in this environment" : "Flag is inactive (safe off)"}
              </p>
            </div>
            <Switch
              checked={enabledValue}
              onCheckedChange={(v) => setValue("enabled", v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Environment — create mode only */}
          {!isEdit && (
            <div className="space-y-1">
              <Label className="text-xs font-mono text-muted-foreground">
                ENVIRONMENT <span className="text-destructive">*</span>
              </Label>
              <input
                type="hidden"
                {...register("environment_id", {
                  required: "Environment is required",
                  validate: (v) =>
                    !isNaN(parseInt(v, 10)) || "Select a valid environment",
                })}
              />
              <Select
                value={watch("environment_id")}
                onValueChange={(v) =>
                  setValue("environment_id", v, { shouldValidate: true })
                }
              >
                <SelectTrigger className="font-mono text-sm bg-background border-border">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent className="font-mono bg-popover border-border">
                  {environments.map((env) => (
                    <SelectItem key={env.id} value={String(env.id)}>
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
              {errors.environment_id && (
                <p className="text-xs text-destructive font-mono">
                  {errors.environment_id.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-mono text-xs border-border"
              disabled={isPending}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="font-mono text-xs bg-primary text-primary-foreground"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "SAVE CHANGES" : "CREATE FLAG"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
