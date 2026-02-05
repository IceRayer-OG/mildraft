// React Components
import { use } from "react";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { LeagueSettingsTabsCard } from "./SettingsCard";
import { LucideSettings } from "lucide-react";

// Types
import { 
  type LeagueData,
} from "../utils/settings";

// Action
import {
  getLeagueSettingsAction,
  getTeamSettingsAction,
  getDraftSettingsAction,
} from "../actions/leagueActions";

export function SettingDialog() {
  const leagueData = {
    leagueId: 1, // Example league ID, replace with actual logic to get league ID
    draftId: 2, // Example draft ID, replace with actual logic to get draft ID
  } as LeagueData;

  const teamData = use(getTeamSettingsAction(leagueData));
  const leagueSettingsData = use(getLeagueSettingsAction(leagueData));
  const draftSettingsData = use(getDraftSettingsAction(leagueData));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <LucideSettings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-center">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Setting's for the League.</DialogDescription>
        </DialogHeader>
        <LeagueSettingsTabsCard 
            teamSettingsData={teamData} 
            leagueData={leagueData} 
            leagueSettingsData={leagueSettingsData} 
            draftSettingsData={draftSettingsData}
        />
      </DialogContent>
    </Dialog>
  );
}
