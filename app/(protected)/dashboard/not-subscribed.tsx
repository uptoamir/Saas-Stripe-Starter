import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export default function NotSubscribed() {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="post" />
      <EmptyPlaceholder.Title>No Subscribtion</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You have to subscribe.
      </EmptyPlaceholder.Description>
      <Button>
        <Link href={"/pricing"}>Subscribe</Link>
      </Button>
    </EmptyPlaceholder>
  );
}
