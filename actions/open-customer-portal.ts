"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { env } from "@/env.mjs"
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/dashboard/billing");

export async function openCustomerPortal(
  userStripeId: string,
): Promise<responseAction> {
  let redirectUrl: string = "";
  console.log(userStripeId, env.STRIPE_API_KEY, env.STRIPE_WEBHOOK_SECRET);
  try {
    const session = await auth();

    console.log(userStripeId, session)
    if (!session?.user || !session?.user.email) {
      throw new Error("Unauthorized");
    }
    console.log(userStripeId, session)

    if (userStripeId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userStripeId,
        return_url: billingUrl,
      });

      redirectUrl = stripeSession.url as string;
    }
  } catch (error) {
    throw new Error("Failed to generate user stripe session", error);
  }

  redirect(redirectUrl);
}
