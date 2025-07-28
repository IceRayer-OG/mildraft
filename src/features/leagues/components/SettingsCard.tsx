"use client"

// React Components
import { useForm } from "react-hook-form"

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
  updateLeagueSettings,
  updateDraftSettings,
  updateTeamSettings,
} from "../database/leagueActions"

// Types
import { DraftSettings, LeagueSettings, TeamSettings } from "../utils/settings"

export function LeagueSettingsTabsCard() {

  const leageForm = useForm({
    defaultValues: {
      name: "League Name",
      abbr: "SVBB",
    },
  });

  const draftForm = useForm({
    defaultValues: {
      draftEnabled: false,
      snakeDraft: false,
      draftStart: new Date(),
      draftTime: "10:30",
    },
  });

  const teamForm = useForm({
    defaultValues: {
      teamLogoEnabled: false,
      teamsAllowed: 10,
    },
  });

  async function handleSubmit(data: any ) {
    try {
      // Call the appropriate update function based on the tab
      if (data.tab === "league") {
        await updateLeagueSettings(data);
      } else if (data.tab === "draft") {
        await updateDraftSettings(data);
      } else if (data.tab === "team") {
        await updateTeamSettings(data);
      }
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  }

  return (
    <Tabs defaultValue="account" className="container">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="league">League</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
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
            <form onSubmit={leageForm.handleSubmit(handleSubmit)}>
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
                  name="abbr"
                  render={({ field }) => (
                  <FormItem className="flex items-center space-y-1">
                    <FormLabel htmlFor="abbr">League Abbreviation</FormLabel>
                    <FormControl>
                      <Input
                        id="abbr"
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
            <form onSubmit={draftForm.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-2">
              <FormField
                control={draftForm.control}
                name="draftEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-1">
                    <FormLabel htmlFor="draften">Draft Enabled</FormLabel>
                    <FormControl>
                      <Checkbox
                        id="draften"
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
            <form onSubmit={teamForm.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-2">
              <FormField
                control={teamForm.control}
                name="teamLogoEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-1">
                    <FormLabel htmlFor="teamlogoen">Team Logo Enabled</FormLabel>
                    <FormControl>
                      <Checkbox
                        id="teamlogoen"
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
