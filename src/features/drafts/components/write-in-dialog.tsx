"use client"

// React Components
import { useForm } from "react-hook-form";

// UI Components
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogClose,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField,
  FormItem,
  FormLabel,
} from "~/_components/ui/form";

// Server Actions
import { draftWriteInPlayerAction } from "../actions/draftActions";
import { toast } from "sonner";


export function WriteInDialog() {
    const writeInForm = useForm({
        defaultValues: {
            writeInPlayerName: "",
        },
    });

    async function handleWriteInSubmit(data: {writeInPlayerName: string}) {
        try{
            await draftWriteInPlayerAction(data.writeInPlayerName);
            toast.success(`${data.writeInPlayerName} was drafted successfully`);
        } catch (error) {
            console.log(error);
            toast.error("Error with Write In submission")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">Write-In</Button>
            </DialogTrigger>
            <DialogContent className="p-4">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">Write-In</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                </DialogDescription>
                <Form {...writeInForm}>
                    <form onSubmit={writeInForm.handleSubmit(handleWriteInSubmit)}>
                        <FormField
                            control={writeInForm.control}
                            name="writeInPlayerName"
                            render={({field}) => (
                                <FormItem className="flex items-center space-y-1">
                                    <FormLabel htmlFor="writeInPlayer">Player Name</FormLabel>
                                    <FormControl>
                                        <Input
                                        id="writeInPlayerName"
                                        defaultValue={field.value}
                                        onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-2">
                            <DialogClose asChild>
                                <Button variant="default" type="submit">Submit</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button variant="destructive" type="button">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}