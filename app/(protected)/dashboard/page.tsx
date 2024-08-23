import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import Map from "@/components/dashboard/map";
// import MapJs from "@/components/dashboard/mapjs";
import NotSubscribed from "@/app/(protected)/dashboard/not-subscribed";

export const metadata = constructMetadata({
  title: "Dashboard – Green Urban",
  description: "Calculate your precise emission",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();

  let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } else {
    redirect("/login");
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="hidden font-heading text-2xl font-semibold md:block">
            Dashboard
          </h1>
          <p className="hidden text-base text-muted-foreground md:block">
            Find your route emission
          </p>
        </div>
      </div>
      {!!userSubscriptionPlan && userSubscriptionPlan?.isPaid ? (
        // !!userSubscriptionPlan && userSubscriptionPlan?.isPaid
        <div className="flex flex-1 flex-col gap-5">
          <Map />
          {/* <MapJs /> */}
        </div>
      ) : (
        <NotSubscribed />
      )}
    </>
  );
}
