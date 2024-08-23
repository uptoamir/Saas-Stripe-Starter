import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getCurrentUser } from '@/lib/session';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { redirect } from 'next/navigation';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const user = await getCurrentUser();

  let userSubscriptionPlan;
  if (user && user.id && user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(user.id);
  } else {
    return redirect("/login");
  }

  // Define your own API endpoint using an environment variable
  const serverApiEndpoint = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/run_simulation`;
  const post_data = {
    ...body,
    userId: user.id,
    stripe_subscriptionId: userSubscriptionPlan?.stripeSubscriptionId,
    access_token: userSubscriptionPlan?.access_token,
  };

  try {
    const response = await axios.post(serverApiEndpoint, post_data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return new NextResponse(JSON.stringify(response.data), { status: response?.status });
  } catch (error) {
    const status = error.response?.status || 400;
    return new NextResponse(JSON.stringify({ error: 'Failed to reach the server', details: error.response?.data?.error || error.message}), 
    { status, statusText: error?.response?.data?.error });
  }
}
