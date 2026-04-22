import { PlannerHero } from "@/features/planner/PlannerHero";
import { PlannerPage } from "@/features/planner/PlannerPage";

export default function Home() {
  return (
    <>
      <PlannerHero />
      <div id="planner" className="scroll-mt-20">
        <PlannerPage />
      </div>
    </>
  );
}
