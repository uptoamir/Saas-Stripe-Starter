import Link from "next/link";

import { features } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section>
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>
          <HeaderSection
            label="Features"
            title="Discover all features."
            subtitle=""
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = Icons[feature.icon || "nextjs"];
              return (
                <div
                  className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"
                  key={feature.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-muted-foreground">
                        {feature.title}
                      </p>
                      <div className="relative flex size-12 justify-between rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6">
                        <Icon />
                      </div>
                    </div>
                    <p className="mt-4 pb-2 text-muted-foreground">
                      {feature.description}
                    </p>
                    <ul className="mt-4 list-inside space-y-3">
                      {feature.features?.map((link) => (
                        <li className="flex items-start gap-x-3" key={link}>
                          <Icons.check className="size-5 shrink-0 text-purple-500" />
                          <p className="">{link}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
