"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Button variant="ghost" size="sm" className="size-8 px-0">
      <Icons.sun
        onClick={() => setTheme("dark")}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Icons.moon
        onClick={() => setTheme("light")}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
}
