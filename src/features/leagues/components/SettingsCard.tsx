"use client"

// React Components
import { useForm } from "react-hook-form"
import { useState } from "react"

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card"
import { Button } from "~/_components/ui/button"
import { Input } from "~/_components/ui/input"
import { toast } from "sonner"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/_components/ui/tabs"
import { Checkbox } from "~/_components/ui/checkbox"
import { DatePicker } from "~/_components/DatePicker"
import { 
  Form, 
  FormControl, 
  FormField,
  FormItem,
  FormLabel,
} from "~/_components/ui/form";

// Actions
import {
  updateLeagueSettingsAction,
  updateDraftSettingsAction,
  updateTeamSettingsAction,
} from "../actions/leagueActions"

// Types
import { DraftSettings, LeagueSettings, TeamSettings, LeagueData } from "../utils/settings"

export function LeagueSettingsTabsCard() {
  // State for active tab
  const tabs = ["league", "draft", "team"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const leagueData = {
    leagueId: 1, // Example league ID, replace with actual logic to get league ID
    draftId: 1, // Example draft ID, replace with actual logic to get draft ID
  } as LeagueData;

  const leageForm = useForm({
    defaultValues: {
      name: "League Name",
      abbreviation: "SVBB",
    },
  });

  const draftForm = useForm({
    defaultValues: {
      draftEnabled: false,
      snakeDraft: false,
      draftStart: new Date().toDateString(),
      draftTime: "10:30",
      pickDuration: 4, // in hours
    },
  });

  const teamForm = useForm({
    defaultValues: {
      logoEnabled: false,
      teamsAllowed: 10,
    },
  });

  async function handleLeagueSubmit(data: LeagueSettings) {
    try {
      // Call the appropriate update function based on the tab
      await updateLeagueSettingsAction(data, leagueData);
      toast.success("League settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  }
  
  async function handleDraftSubmit(data: DraftSettings) {
    try {
      // Call the appropriate update function based on the tab
      await updateDraftSettingsAction(data, leagueData);
      toast.success("Draft settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  }

  async function handleTeamSubmit(data: TeamSettings) {
    try {
      // Call the appropriate update function based on the tab
      await updateTeamSettingsAction(data, leagueData);
      toast.success("Team settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="container">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map((value: string) => (
          <TabsTrigger key={value} value={value}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </TabsTrigger>
        ))}
        {/* <TabsTrigger value="league">League</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger> */}
      </TabsList>
      <TabsContent value="league">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>League</CardTitle>
            <CardDescription>
              Settings for the League.
            </CardDescription>
          </CardHeader>
          <Form {...leageForm}>
            <form onSubmit={leageForm.handleSubmit(handleLeagueSubmit)}>
              <CardContent className="space-y-2">
                <FormField
                  control={leageForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-1">
                      <FormLabel htmlFor="name">League Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={leageForm.control}
                  name="abbreviation"
                  render={({ field }) => (
                  <FormItem className="flex items-center space-y-1">
                    <FormLabel htmlFor="abbreviation">League Abbreviation</FormLabel>
                    <FormControl>
                      <Input
                        id="abbreviation"
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" type="submit">Save</Button>
                <Button variant="destructive" type="reset">Cancel</Button>
              </CardFooter> 
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="draft">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Draft</CardTitle>
            <CardDescription>
              Settings for the mil Draft.
            </CardDescription>
          </CardHeader>
          <Form {...draftForm}>
            <form onSubmit={draftForm.handleSubmit(handleDraftSubmit)}>
            <CardContent className="space-y-2">
              <FormField
                control={draftForm.control}
                name="draftEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-1">
                    <FormLabel htmlFor="draftEnabled">Draft Enabled</FormLabel>
                    <FormControl>
                      <Checkbox
                        id="draftEnabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={draftForm.control}
                name="snakeDraft"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-1">
                    <FormLabel htmlFor="snakeDraft">Snake Draft</FormLabel>
                    <FormControl>
                      <Checkbox
                        id="snakeDraft"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={draftForm.control}
                name="draftStart"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center space-y-1">
                    <FormLabel htmlFor="draftStart">Start Date</FormLabel>
                    <FormControl>
                      <DatePicker />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={draftForm.control}
                name="draftTime"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center space-y-1">
                    <FormLabel htmlFor="draftTime">Draft Time</FormLabel>
                    <FormControl>
                      <Input
                        id="draftTime"
                        type="time"
                        step="1"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-[150px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={draftForm.control}
                name="pickDuration"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center space-y-1">
                    <FormLabel htmlFor="pickDuration">Pick Duration</FormLabel>
                    <FormControl>
                      <Input
                        id="pickDuration"
                        type="number"
                        step="1"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-[150px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" type="submit">Save</Button>
              <Button variant="destructive" type="reset">Cancel</Button>
            </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="team">
        <Card>
          <CardHeader className="items-center">
            <CardTitle>Team</CardTitle>
            <CardDescription>
              Settings for the Teams.
            </CardDescription>
          </CardHeader>
          <Form {...teamForm}>
            <form onSubmit={teamForm.handleSubmit(handleTeamSubmit)}>
            <CardContent className="space-y-2">
              <FormField
                control={teamForm.control}
                name="logoEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-1">
                    <FormLabel htmlFor="logoEnabled">Team Logo Enabled</FormLabel>
                    <FormControl>
                      <Checkbox
                        id="logoEnabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={teamForm.control}
                name="teamsAllowed"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-1">
                    <FormLabel htmlFor="teamsallowed">Teams Allowed</FormLabel>
                    <FormControl>
                      <Input
                        id="teamsallowed"
                        type="number"
                        className="w-[100px]"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" type="submit">Save</Button>
              <Button variant="destructive" type="reset">Cancel</Button>
            </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
