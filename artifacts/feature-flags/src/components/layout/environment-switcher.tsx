import React from "react";
import { useEnvironment } from "../../context/useEnvironment";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function EnvironmentSwitcher() {
  const { environments, selectedEnvironmentId, setSelectedEnvironmentId, selectedEnvironment } = useEnvironment();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between bg-card text-foreground border-border hover:bg-muted"
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedEnvironment ? selectedEnvironment.name : "All Environments"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 border-border bg-popover text-popover-foreground">
        <Command>
          <CommandInput placeholder="Search environments..." className="border-none" />
          <CommandList>
            <CommandEmpty>No environment found.</CommandEmpty>
            <CommandGroup heading="Global">
              <CommandItem
                onSelect={() => {
                  setSelectedEnvironmentId(null);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedEnvironmentId === null ? "opacity-100" : "opacity-0"
                  )}
                />
                All Environments
              </CommandItem>
            </CommandGroup>
            {environments.length > 0 && (
              <CommandGroup heading="Environments">
                {environments.map((env) => (
                  <CommandItem
                    key={env.id}
                    onSelect={() => {
                      setSelectedEnvironmentId(env.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedEnvironmentId === env.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: env.color || "var(--primary)" }}
                      />
                      {env.name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
