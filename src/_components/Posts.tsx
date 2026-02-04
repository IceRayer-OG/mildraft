// React
import { use } from "react";

// UI Components
import { Separator } from "~/_components/ui/separator";

// Types
import { type Post } from "~/app/_features/posts/utils/posts";


export default function Posts({
  posts,
}: {
  posts: Promise<Post[]>;
}) {
  const allPosts = posts ? use(posts) : [];
  
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