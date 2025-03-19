"use client"

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

export function WriteInDialog() {
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
                <Input placeholder="Write-In" />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Submit</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}