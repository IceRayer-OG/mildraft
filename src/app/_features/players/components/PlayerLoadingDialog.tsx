'use client';

import { useActionState, useEffect, useState } from 'react';
// Changed from 'next/form' to standard HTML form for better file handling
import { 
  Upload, 
  Loader2, 
  CheckSquare, 
  Settings as LucideSettings, 
  AlertCircle
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "~/_components/ui/dialog";
import { Button } from "~/_components/ui/button";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";

import { loadProspectPlayersAction } from '../actions/playerActions';
import { toast } from 'sonner';

const initialState = {
  status: '',
  message: '',
};

export function PlayerLoadingDialog() {
  const [state, formAction, isPending] = useActionState(loadProspectPlayersAction, initialState);
  const [open, setOpen] = useState(false);
  // Key used to force-reset the file input after a successful upload
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Prospect players loaded successfully!");
      setInputKey(Date.now()); // Clear the file input
      // Optional: Close dialog after a delay
      // setTimeout(() => setOpen(false), 2000);
    } else if (state.status === "error") {
      toast.error(state.message || "Error loading players.");
    }
  }, [state]);

  return (
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size="icon">
          <LucideSettings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
        <DialogContent className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg bg-background border">
          
          {/* Using standard form for multipart/form-data support */}
          <form action={formAction}>
            <DialogHeader className="mb-4">
              <DialogTitle>Load Draftable MiL Players</DialogTitle>
              <DialogDescription>
                Select the Excel file used to load Top 100 prospect players.
              </DialogDescription>
            </DialogHeader>

            <div className="grid w-full items-center gap-1.5 py-4">
              <Label htmlFor="excelFile">Upload Excel or CSV File</Label>
              <Input 
                key={inputKey}
                id="excelFile" 
                name="excelFile" 
                type="file" 
                accept=".xlsx, .xls, .csv"
                disabled={isPending}
                required
                className="cursor-pointer"
              />
              {state.status === "error" && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {state.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-4">
              {isPending ? (
                <Button disabled variant="outline" className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing Database...
                </Button>
              ) : state.status === "success" ? (
                <Button 
                  type="submit"
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Update Again
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Process
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}




// "use client";

// // Import React
// import { useState } from "react";
// import Form from "next/form";

// // Import UI Components
// import { CheckSquare, LoaderIcon, LucideSettings, Upload } from "lucide-react";
// import { Button } from "~/_components/ui/button";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogDescription,
//   DialogTitle,
//   DialogPortal,
//   DialogContent,
//   DialogFooter,
//   DialogOverlay,
//   DialogHeader,
// } from "~/_components/ui/dialog";
// import { Label } from "~/_components/ui/label";

// // Functions
// export function PlayerLoadingDialog() {
//   const [content, setContent] = useState({ status: "pending" });

//   return (
//     <Dialog modal={true}>
//       <DialogTrigger asChild>
//         <Button variant={"ghost"}>
//           <LucideSettings />
//         </Button>
//       </DialogTrigger>
//       <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
//       <DialogPortal>
//         <DialogContent className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-lg">
//           <Form action={async () => {}}>
//             <DialogHeader>
//               <DialogTitle>Load Draftable MiL Players</DialogTitle>
//               <DialogDescription>
//                 Please select the excel used to load Top 100 prospect players.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="flex p-3">
//               <div className="pb-4">
//                 <Label htmlFor="excelFile" className="mb-2 block">
//                   Upload Excel or CSV File
//                 </Label>
//                 <input
//                   type="file"
//                   name="excelFile"
//                   accept=".xlsx, .xls, .csv"
//                   className="block border-2"
//                 />

//               </div>
//             </div>

//             <DialogFooter>
//               {content.status === "loading" ? (
//                 <Button
//                   variant="outline"
//                   type="button"
//                   onClick={() => setContent({ status: "loaded" })}
//                 >
//                   <LoaderIcon className="animate-spin" />
//                 </Button>
//               ) : content.status === "loaded" ? (
//                 <Button
//                   variant="outline"
//                   type="reset"
//                   onClick={() => setContent({ status: "pending" })}
//                 >
//                   <CheckSquare color="green" />
//                 </Button>
//               ) : (
//                 <Button
//                   variant="outline"
//                   type="submit"
//                   onClick={() => setContent({ status: "loading" })}
//                 >
//                   <Upload />
//                 </Button>
//               )}
//             </DialogFooter>
//           </Form>
//         </DialogContent>
//       </DialogPortal>
//     </Dialog>
//   );
// }
