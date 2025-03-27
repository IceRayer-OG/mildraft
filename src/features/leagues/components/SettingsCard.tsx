import { Button } from "~/_components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card"
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
          <CardFooter>
            <Button>Save</Button>
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
            <div className="flex items-center space-y-1">
              <Label htmlFor="new" >Start Date/Time</Label>
              <DatePicker />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save</Button>
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
          <CardFooter>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
