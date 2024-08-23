"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchLocationProps {
  onChange: () => void;
  type: string;
  value: string;
  results: any[];
  onSelect: (selectedAddress: string, lng: number[]) => void;
  onClear: () => void;
}

export const SearchLocation = forwardRef<HTMLInputElement, SearchLocationProps>(
  ({ onChange, onSelect, onClear, type = "Origin", value, results }, ref) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (item: any) => {
      try {
        if (
          item.geometry &&
          item.geometry.coordinates &&
          item.geometry.coordinates.length > 1
        ) {
          const [lng, lat] = item.geometry.coordinates;
          onSelect(item.place_name, [lng, lat]);
        }
      } catch (error) {}

      setOpen(false);
    };

    const onOpen = (e) => {
      setOpen(true);
    };

    const handlClear = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onClear();
    };

    return (
      <>
        <Button
          variant="outline"
          className={cn(
            "relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-full",
          )}
          onClick={(e) => onOpen(e)}
        >
          <span className="inline-flex">
            {value.length > 0 ? value : `Search ${type}...`}
          </span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.45rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
          <div
            className={cn(
              "sm:flexl absolute right-[0.3rem] top-[0.45rem] h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100",
            )}
            onClick={(e) => handlClear(e)}
          >
            clear
          </div>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Type a location..."
            onValueChange={onChange}
            ref={ref}
            // value={inputValue}
            onClear={onClear}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={""}>
              {results.map((item) => {
                return (
                  <CommandItem
                    key={item.place_name}
                    onSelect={() => handleSelect(item)}
                  >
                    {item.place_name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
);

SearchLocation.displayName = "SearchLocation";
