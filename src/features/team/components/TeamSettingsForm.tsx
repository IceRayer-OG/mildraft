"use client";
// React
import { useForm } from "react-hook-form";

// UI Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { 
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "~/_components/ui/form";
import { toast } from "sonner";

// Actions
import { updateTeamSettingsAction, getTeamSettingsAction } from "../actions/teamSettingsActions";

// Utils
import { TeamSettings } from "../utils/team";


export function TeamSettingsForm({teamSettingsData}: {teamSettingsData: TeamSettings}) {
    
    const teamSettingsForm = useForm({
        defaultValues: {
            teamName: "",
            teamAbbreviation: "",
            teamLogo: "",
        },
        values: teamSettingsData ?? {
            teamName: "",
            teamAbbreviation: "",
            teamLogo: "",
        },
    });

    async function teamSettingsFormSubmit(formData: TeamSettings) {
        try {
            await updateTeamSettingsAction(formData);
            toast.success("Team settings updated successfully!");
        } catch (error) {
            console.error("Error updating team settings:", error);
            toast.error("Failed to update team settings. Please try again.");
        }
    }

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline">Settings</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="items-center">
                <DialogTitle>Team Settings</DialogTitle>
                <DialogDescription>
                    Settings for the Team.
                </DialogDescription>
            </DialogHeader>
                <Form {...teamSettingsForm}>
                    <form onSubmit={teamSettingsForm.handleSubmit(teamSettingsFormSubmit)} className="space-y-4">
                        <FormField
                            control={teamSettingsForm.control}
                            name="teamName"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-y-1">
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl className="w-[75%]">
                                        <Input placeholder="Enter team name" className="text-right" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={teamSettingsForm.control}
                            name="teamAbbreviation"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-y-1">
                                    <FormLabel>Team Abbreviation</FormLabel>
                                    <FormControl className="w-[75%]">
                                        <Input placeholder="Enter team abbreviation" className="text-right" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={teamSettingsForm.control}
                            name="teamLogo"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-y-1">
                                    <FormLabel>Team Logo</FormLabel>
                                    <FormControl className="w-[75%]">
                                        <Input placeholder="Enter team logo URL" className="text-right" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <DialogFooter className="mt-3">
                        <DialogClose asChild>
                            <Button type="submit" variant="outline">Save</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="destructive">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}