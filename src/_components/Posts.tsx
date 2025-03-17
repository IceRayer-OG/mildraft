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
  <div className="flex flex-col gap-4">
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))} 
    </ul>
  </div>
  )
}