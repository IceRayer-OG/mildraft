"use client";

// React Components
import { useState, Suspense } from "react";

// UI Components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/_components/ui/tabs";

// Types
import {
  type DraftSettings,
  type LeagueSettings,
  type TeamSettings,
  type LeagueData,
} from "../utils/settings";
import { TeamSettingsForm } from "./settings_forms/TeamSettignsForm";
import { LeagueSettingsForm } from "./settings_forms/LeagueSettingForm";
import { DraftSettingsForm } from "./settings_forms/DraftSettingsForm";
import { SeasonRolloverDialog } from "~/app/_features/drafts/components/SeasonRolloverDialog";
import { Separator } from "~/_components/ui/separator";

export function LeagueSettingsTabsCard({
  leagueSettingsData,
  teamSettingsData,
  draftSettingsData,
  leagueData,
}: {
  leagueSettingsData: LeagueSettings;
  teamSettingsData: TeamSettings;
  draftSettingsData: DraftSettings;
  leagueData: LeagueData;
}) {
  // State for active tab
  const tabs = ["league", "draft", "team", "season"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const leagueInfo = leagueData;
  const leagueSettingsInfo = leagueSettingsData;
  const draftSettingsInfo = draftSettingsData;
  const teamSettingsInfo = teamSettingsData;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="container">
      <TabsList className="grid w-full grid-cols-4">
        {tabs.map((value: string) => (
          <TabsTrigger key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="league">
        <Card>
          <Suspense>
            <LeagueSettingsForm leagueSettingsData={leagueSettingsInfo} leagueDetailsData={leagueInfo} />
          </Suspense>
        </Card>
      </TabsContent>
      <TabsContent value="draft">
        <Card>
          <CardHeader className="items-center">
            <CardDescription>Times are displayed in League&apos;s Timezone</CardDescription>
          </CardHeader>
          <Suspense>
            <DraftSettingsForm draftSettingsData={draftSettingsInfo} leagueSettingsData={leagueInfo} />
          </Suspense>
        </Card>
      </TabsContent>
      <TabsContent value="team">
        <Card>
          <Suspense>
            <TeamSettingsForm teamSettingsData={teamSettingsInfo} leagueSettingsData={leagueInfo} />
          </Suspense>
        </Card>
      </TabsContent>
      <TabsContent value="season">
        <Card className="p-4 space-y-4">
          <CardHeader className="items-center pb-2">
            <CardTitle>Season Management</CardTitle>
            <CardDescription className="text-center">
              Conclude the active season and roll over to next year.
            </CardDescription>
          </CardHeader>
          <Separator />
          <div className="pt-2">
            <SeasonRolloverDialog leagueId={leagueInfo.leagueId} />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
