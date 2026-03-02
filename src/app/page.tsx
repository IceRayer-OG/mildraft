import { ClaimTeamDialog } from "~/app/_features/team/components/ClaimTeamDialog";
import { getLeagueUnclaimedTeamsAction } from "~/app/_features/team/actions/teamActions";
import { Suspense } from "react";

export default function HomePage() {
  const unclaimedLeagueTeams = getLeagueUnclaimedTeamsAction();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          SV Baseball{" "}
          <span className="text-[hsl(280,100%,70%)]">MiL Draft</span> App
        </h1>
        <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 text-white hover:bg-white/20 p-6">
            <Suspense>
              <ClaimTeamDialog unclaimedLeagueTeams={unclaimedLeagueTeams} />
            </Suspense>
        </div>
      </div>
    </main>
  );
}

