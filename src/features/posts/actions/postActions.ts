'use server';

import { revalidatePath } from 'next/cache';
import { createAPost } from "~/server/queries";
import { type CreatePost } from "~/features/posts/utils/posts";

export async function createAPostAction(formPostData: { title: string; body: string }) {
  const postData = {
    title: formPostData.title,
    body: formPostData.body,
    leagueId: 1,
  } as CreatePost;

  await createAPost(postData);
  revalidatePath("league");

}

// export async function deletePostAction(postId: number) {
//     await deletePost(postId);
// }

// export async function updatePostAction(postId: number, postData: Post) {
//     await updatePost(postId, postData);
// }