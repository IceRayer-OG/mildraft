"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import { Textarea } from "~/_components/ui/textarea";
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
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField,
  FormItem,
  FormLabel,
} from "~/_components/ui/form";

import { createAPostAction } from "../database/postActions";

async function addPost(data: {title: string, body: string}) {
  try {
    await createAPostAction(data);
    toast.success("Post created");
  } catch (error) {
    console.log(error);
    toast.error("Error creating post");
  }
}

export function AddPostDialog() {

  const formSchema = z.object({
    title: z.string(),
    body: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  })

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addPost)}>
            <FormField 
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Title</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="col-span-1 text-right">Body</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea placeholder="Body" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="p-2">
              <DialogClose asChild>
                <Button type="submit" variant="outline">Post</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}