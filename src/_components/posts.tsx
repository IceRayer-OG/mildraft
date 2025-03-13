
import { getLeaguePosts } from "~/server/queries";

async function getPosts() {
  const leaguePosts = await getLeaguePosts(1);
  return leaguePosts;
}

export async function Posts() {
  // Get Posts
  const posts = await getPosts();

  return (
  <div className="grid grid-cols-1 grid-rows-3 gap-4">
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  </div>
  )
}