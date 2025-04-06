'use client';

import { type Post } from "~/utils/posts";
import { use } from "react";
import { Separator } from "~/_components/ui/separator";

export default function Posts({
  posts,
}: {
  posts: Promise<Post[]>;
}) {
  const allPosts = use(posts);
  
  return (
  <div className="flex flex-col">
    <ul className="grow">
      {allPosts.map((post) => (
        <li key={post.id} className="flex-col p-2">
          <p className="text-center font-bold">{post.title}</p>
          <Separator />
          <p>{post.body}</p>
        </li>
      ))} 
    </ul>
  </div>
  )
}