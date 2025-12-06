'use server';

import { revalidatePath } from 'next/cache';
import { createAPost } from "~/server/queries";
import { type CreatePost, type Post } from "~/app/_features/posts/utils/posts";

export async function createAPostAction(formPostData: { title: string; body: string }) {
  const postData = {
    title: formPostData.title,
    body: formPostData.body,
    leagueId: 1,
  } as CreatePost;

  await createAPost(postData);
  revalidatePath("league");

}

export async function createPostAction(
  previousState: {
    status: string,
    message: string,
    data: CreatePost,
  },
  formPostData: FormData
){
  
  const postData: CreatePost = {
    title: formPostData.get('title') as string,
    body: formPostData.get('body') as string,
    // text: formPostData.get("text") as string,
    leagueId: 1,
  };

  await createAPost(postData);
  revalidatePath("league");
  return;

}

// export async function deletePostAction(postId: number) {
//     await deletePost(postId);
// }

// export async function updatePostAction(postId: number, postData: Post) {
//     await updatePost(postId, postData);
// }