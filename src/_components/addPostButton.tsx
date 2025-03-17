"use client";

import { Button } from "~/_components/ui/button";
import { createAPost } from "~/server/queries";

export function AddPostButton() {
  return (
    <Button variant="outline" onClick={() => createAPost()}>
      Create
    </Button>
  );
}