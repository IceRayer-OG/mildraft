import { Button } from "~/_components/ui/button";
import { Label } from "~/_components/ui/label";
import { Input } from "~/_components/ui/input";
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
import { type Post } from "~/utils/posts";
import { createAPost } from "~/server/queries";
import { toast } from "sonner";

export async function addPost(postData: Post) {
  try {
    await createAPost(postData);
    toast.success("Post created");
  } catch (error) {
    console.log(error);
    toast.error("Error creating post");
  }
}

export function AddPostDialog() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Create</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
            <DialogDescription>
              What do you want to tell the league. Click Post when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value="Title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Body
              </Label>
              <Input id="body" value="Get Detailed" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Post</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }