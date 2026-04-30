import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PlannerHero } from "@/features/planner/PlannerHero";
import { PlannerPage } from "@/features/planner/PlannerPage";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <PlannerHero />
        <div id="planner" className="scroll-mt-20">
          <PlannerPage />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
