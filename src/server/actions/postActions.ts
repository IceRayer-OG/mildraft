'use server';

import { createAPost } from "~/server/queries";
import { type Post } from "~/utils/posts";

export async function createAPostAction(postData: Post) {
  const post = await createAPost(postData);
  return post;
}

// export async function deletePostAction(postId: number) {
//     await deletePost(postId);
// }

// export async function updatePostAction(postId: number, postData: Post) {
//     await updatePost(postId, postData);
// }