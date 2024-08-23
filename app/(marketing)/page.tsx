import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Team from "@/components/sections/team";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Powered />
      <Features />
      <Team />
    </>
  );
}
