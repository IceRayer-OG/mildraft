// going to be the settings page for the league
import { Input } from "~/_components/ui/input";
import { DatePicker } from "~/_components/DatePicker";
import { Checkbox } from "~/_components/ui/checkbox";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Label } from "~/_components/ui/label";
import { Button } from "~/_components/ui/button";
import { Separator } from "~/_components/ui/separator";

export default function LeagueSettingsPage() {
  return (
    <div className="flex flex-col w-full items-center min-h-screen p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div id="opt1" className="flex flex-col items-center">
        <div className="text-xl md:text-4xl p-4">Settings Option 1</div>
        <div className="text-lg md:text-3xl p-4"> League Settings</div>
        <div className="grid grid-cols-2 gap-4 shadow-slate-500 shadow-md rounded-lg p-4">
          <div className="flex grow">
            <p> League Name</p>
            <Input placeholder="League Name" />
          </div>
          <div className="flex grow">
            <p> League Abbreviation</p>
            <Input placeholder="League Abbr" />
          </div>
          
          <p> League Logo</p>
          <p> League Color</p>
        </div>
        <div className="text-lg md:text-3xl p-4"> Draft Settings </div>
        <div className="flex items-center gap-4">
          <p>Start Date/Time</p>
          <DatePicker />
        </div>
        <div className="flex items-center gap-4">
          <p>Pick Duration</p>
          <Input placeholder="Pick Duration" />
        </div>
        <div className="flex items-center gap-4">
          <p>Snake Draft</p>
          <Checkbox />
        </div>
        <div className="flex items-center gap-4">
          <p>Draft Order</p>

        </div>
        <div className="text-lg md:text-3xl p-4"> Team Settings </div>
        <div className="pb-2">
          <p>Details for the team settings</p>
        </div>
      </div>
      <Separator className="my-1" />
      <div id="opt2" className="flex flex-col items-center">
        <div className="text-xl md:text-4xl p-4">Settings Option 2</div>
        <div className="text-lg md:text-3xl p-4"> League Settings</div>
        <div className="flex items-center gap-4">
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
              <div className=" flex items-center space-y-1">
                <Label htmlFor="abbr">League Abbreviation</Label>
                <Input id="abbr" defaultValue="SVBB" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <CardTitle>Draft</CardTitle>
              <CardDescription>
                Settings for the mil Draft.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center space-y-1">
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
          
        </div>

      </div>
    </div>
  )
}