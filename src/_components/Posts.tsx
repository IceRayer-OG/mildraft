'use client';

import { type Post } from "~/utils/posts";
import { use } from "react";

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
          <p className="font-bold">{post.title}</p>
          <p>{post.body}</p>
        </li>
      ))} 
    </ul>
  </div>
  )
}