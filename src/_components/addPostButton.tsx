"use client";

import { Button } from "~/_components/ui/button";
import { createAPost } from "~/server/queries";

async function createPost() {
  const postData = {
    title: "New Post",
    body: "This is a new post",
  };
  await createAPost(postData);
}

export function addPostButton() {
  return (
    <Button variant="outline" className="ml-auto" onClick={() => createPost()}>
      Create
    </Button>
  );
}