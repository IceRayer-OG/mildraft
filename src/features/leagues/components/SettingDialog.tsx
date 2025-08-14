import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/_components/ui/dialog"
import { Button } from "~/_components/ui/button"
import { LeagueSettingsTabsCard } from "./SettingsCard"
import { LucideSettings } from "lucide-react"

export function SettingDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <LucideSettings/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Setting</DialogTitle>
                    <DialogDescription>
                        Setting for the League.
                    </DialogDescription>
                </DialogHeader>
                <LeagueSettingsTabsCard />
            </DialogContent>
        </Dialog>
    )
}