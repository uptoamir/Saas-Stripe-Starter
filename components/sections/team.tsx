import Image from "next/image";
import Link from "next/link";

import { team } from "@/config/landing";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";

export default function Team() {
  return (
    <section>
      <div className="container flex max-w-6xl flex-col gap-10 py-32 sm:gap-y-16">
        <HeaderSection
          label=""
          title="We love to hear back from you 🥳"
          subtitle=""
        />
        <div className="column-1 gap-5 space-y-5 lg:mx-auto lg:columns-2">
          {team.map((member) => (
            <div className="break-inside-avoid" key={member.name}>
              <div className="relative rounded-xl border bg-muted/25">
                <div className="flex flex-col px-4 py-5 sm:p-6">
                  <div>
                    <div className="relative mb-4 flex items-center gap-3">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                        <Image
                          width={100}
                          height={100}
                          className="size-full rounded-full border"
                          src={member.image}
                          alt={member.name}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.postition}
                        </p>
                      </div>
                    </div>
                    <div className="-mb-5 flex gap-3 border-t border-muted py-4 md:-mb-7">
                      <Button
                        variant="secondary"
                        size="sm"
                        rounded="xl"
                        className="px-3"
                      >
                        <Link
                          href={`mailto:${member.mail}`}
                          className="flex items-center gap-2"
                        >
                          <Icons.mail className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        rounded="xl"
                        className="px-3"
                      >
                        <Link
                          href={member.linkedin}
                          className="flex items-center gap-2"
                        >
                          <Icons.linkedin className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
