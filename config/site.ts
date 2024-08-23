import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Green Urban",
  description:
    "Get your project off to an explosive start with Green Urban! Harness the power of Next.js 14, Prisma, Neon, Auth.js v5, Resend, React Email, Shadcn/ui and Stripe to build your next big thing.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/greenurbanca",
    github: "https://github.com/GreenUrban",
    linkedin: 'https://www.linkedin.com/company/greenurbanca'
  },
  mailSupport: "support@greenurban.ca",
};

export const footerLinks: SidebarNavItem[] = [];
