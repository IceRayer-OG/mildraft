import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "~/_components/ui/dialog"
import { Button } from "~/_components/ui/button"
import { LeagueSettingsTabsCard } from "./SettingsCard"

export function SettingDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Settings</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Setting</DialogTitle>
                    <DialogDescription>
                        Setting for the League.
                    </DialogDescription>
                </DialogHeader>
                <LeagueSettingsTabsCard />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Save</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button>Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}