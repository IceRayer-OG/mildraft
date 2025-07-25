"use client"

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
import { Label } from "~/_components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/_components/ui/tabs"
import { Checkbox } from "~/_components/ui/checkbox"
import { DatePicker } from "~/_components/DatePicker"

export function LeagueSettingsTabsCard() {
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
          <CardContent className="space-y-2">
            <div className="flex items-center space-y-1">
              <Label htmlFor="name"> League Name</Label>
              <Input id="name" defaultValue="League Name" />
            </div>
            <div className="flex items-center space-y-1">
              <Label htmlFor="abbr">League Abbreviation</Label>
              <Input id="abbr" defaultValue="SVBB" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline">Save</Button>
            <Button variant="destructive">Cancel</Button>
          </CardFooter>
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
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between space-y-1">
              <Label htmlFor="draften">Draft Enabled</Label>
              <Checkbox id="draften" />
            </div>
            <div className="flex items-center justify-between space-y-1">
              <Label htmlFor="snakedraft">Snake Draft</Label>
              <Checkbox id="snakedraft" />
            </div>
            <div className="flex justify-between items-center space-y-1">
              <Label htmlFor="date-picker" >Start Date/Time</Label>
              <DatePicker />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                defaultValue="10:30:00"
                className="w-[150px] bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline">Save</Button>
            <Button variant="destructive">Cancel</Button>
          </CardFooter>
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
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between space-y-1">
              <Label htmlFor="teamlogoen">Allow Logo&apos;s</Label>
              <Checkbox id="teamlogoen" />
            </div>
            <div className="flex items-center space-y-1">
              <Label htmlFor="teamsallowed">Teams Allowed</Label>
              <Input id="teamsallowed" type="draftStart" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="outline">Save</Button>
            <Button variant="destructive">Cancel</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
