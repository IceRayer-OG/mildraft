import { ClaimTeamDialog } from "~/app/_features/team/components/ClaimTeamDialog";
import { getLeagueUnclaimedTeamsAction } from "~/app/_features/team/actions/teamActions";
import { Suspense } from "react";

export default function HomePage() {
  const unclaimedLeagueTeams = getLeagueUnclaimedTeamsAction();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-white">
      <div className="container flex flex-col items-center justify-center gap-8 sm:gap-12 px-2 sm:px-4 py-8 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-[5rem] font-extrabold tracking-tight text-white leading-tight">
          SV Baseball{" "}
          <span className="text-[hsl(280,100%,70%)]">MiL Draft</span> App
        </h1>
        <div className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-white/10 text-white hover:bg-white/20 p-6 shadow-xl backdrop-blur-md border border-white/10">
          <Suspense>
            <ClaimTeamDialog unclaimedLeagueTeams={unclaimedLeagueTeams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

