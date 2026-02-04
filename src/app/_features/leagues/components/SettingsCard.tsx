"use client";

// React Components
import { useState, Suspense, use } from "react";

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
  const tabs = ["league", "draft", "team"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const leagueInfo = leagueData;
  const leagueSettingsInfo = leagueSettingsData;
  const draftSettingsInfo = draftSettingsData;
  const teamSettingsInfo = teamSettingsData;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="container">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((value: string) => (
          <TabsTrigger key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="league">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>League</CardTitle>
            <CardDescription>Settings for the League.</CardDescription>
            <Separator />
          </CardHeader>
          <Suspense>
            <LeagueSettingsForm leagueSettingsData={leagueSettingsInfo} leagueDetailsData={leagueInfo} />
          </Suspense>
        </Card>
      </TabsContent>
      <TabsContent value="draft">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Draft</CardTitle>
            <CardDescription>Settings for the mil Draft.</CardDescription>
          </CardHeader>
          <Suspense>
            <DraftSettingsForm draftSettingsData={draftSettingsInfo} leagueSettingsData={leagueInfo} />
          </Suspense>
        </Card>
      </TabsContent>
      <TabsContent value="team">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Team</CardTitle>
            <CardDescription>Settings for the Teams.</CardDescription>
          </CardHeader>
          <Suspense>
            <TeamSettingsForm teamSettingsData={teamSettingsInfo} leagueSettingsData={leagueInfo} />
          </Suspense>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
