import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateEnvironment,
  getListEnvironmentsQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

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
import { Loader2 } from "lucide-react";

interface EnvironmentFormValues {
  name: string;
  slug: string;
  description: string;
  color: string;
  is_default: boolean;
}

interface EnvironmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_COLOR = "#6366f1";
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function EnvironmentFormDialog({
  open,
  onOpenChange,
}: EnvironmentFormDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnvironmentFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: DEFAULT_COLOR,
      is_default: false,
    },
  });

  // Auto-derive slug from name until the user edits the slug directly.
  // Reset whenever the dialog opens so each new environment starts fresh.
  const slugTouchedRef = React.useRef(false);

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        slug: "",
        description: "",
        color: DEFAULT_COLOR,
        is_default: false,
      });
      slugTouchedRef.current = false;
    }
  }, [open, reset]);

  const name = watch("name");
  const slug = watch("slug");
  const color = watch("color");
  const isDefault = watch("is_default");

  useEffect(() => {
    if (!slugTouchedRef.current) {
      setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [name, setValue]);

  const createEnvironment = useCreateEnvironment({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListEnvironmentsQueryKey() });
        toast({
          title: "Environment Created",
          description: `${data.name} was created successfully.`,
        });
        onOpenChange(false);
      },
      onError: (err: any) => {
        const detail = err?.data?.detail ?? "Failed to create environment.";
        toast({ title: "Error", description: detail, variant: "destructive" });
      },
    },
  });

  const onSubmit = (values: EnvironmentFormValues) => {
    createEnvironment.mutate({
      data: {
        name: values.name,
        slug: values.slug,
        description: values.description || undefined,
        color: values.color || undefined,
        is_default: values.is_default,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground font-mono">
        <DialogHeader>
          <DialogTitle className="text-lg font-mono">CREATE_ENVIRONMENT</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-mono">
            Define a new deployment context. Slug must be unique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-mono text-muted-foreground">
              NAME <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Staging"
              className="font-mono text-sm bg-background border-border"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-mono">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <Label htmlFor="slug" className="text-xs font-mono text-muted-foreground">
              SLUG <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="e.g. staging"
              className="font-mono text-sm bg-background border-border"
              {...register("slug", {
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9][a-z0-9-]*$/,
                  message: "Lowercase letters, numbers, and hyphens only",
                },
                onChange: () => {
                  slugTouchedRef.current = true;
                },
              })}
            />
            {errors.slug && (
              <p className="text-xs text-destructive font-mono">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs font-mono text-muted-foreground">
              DESCRIPTION
            </Label>
            <Textarea
              id="description"
              placeholder="What is this environment used for?"
              rows={2}
              className="font-mono text-sm bg-background border-border resize-none"
              {...register("description")}
            />
          </div>

          {/* Color */}
          <div className="space-y-1">
            <Label htmlFor="color" className="text-xs font-mono text-muted-foreground">
              COLOR
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="color"
                type="color"
                value={color || DEFAULT_COLOR}
                onChange={(e) => setValue("color", e.target.value)}
                className="h-9 w-10 rounded border border-border bg-background cursor-pointer p-0.5"
              />
              <Input
                aria-label="Color hex value"
                value={color}
                onChange={(e) => setValue("color", e.target.value)}
                placeholder="#6366f1"
                className="font-mono text-sm bg-background border-border"
              />
            </div>
          </div>

          {/* Default toggle */}
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
            <div>
              <p className="text-xs font-mono text-muted-foreground">DEFAULT ENVIRONMENT</p>
              <p className="text-[11px] text-muted-foreground/60 font-mono mt-0.5">
                {isDefault
                  ? "This will become the default environment"
                  : "Use as fallback when no environment is selected"}
              </p>
            </div>
            <Switch
              checked={isDefault}
              onCheckedChange={(v) => setValue("is_default", v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-mono text-xs border-border"
              disabled={createEnvironment.isPending}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="font-mono text-xs bg-primary text-primary-foreground"
              disabled={createEnvironment.isPending}
            >
              {createEnvironment.isPending && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              CREATE ENVIRONMENT
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
