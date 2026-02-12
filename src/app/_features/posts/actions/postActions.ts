'use server';

import { revalidatePath } from 'next/cache';
import { createAPost, getLeaguePosts } from "../database/queries";
import { auth, currentUser } from '@clerk/nextjs/server';
import { type CreatePost, type Post } from "~/app/_features/posts/utils/posts";

export async function createAPostAction(formPostData: { title: string; body: string }) {
  const user = await currentUser();
  if (!user) throw new Error("Not logged in")

  const postData = {
    title: formPostData.title,
    body: formPostData.body,
    leagueId: 1,
  } as CreatePost;

  await createAPost(postData, user.id);
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

  const user = await currentUser();
  if (!user) throw new Error("Not logged in");
  
  const postData: CreatePost = {
    title: formPostData.get('title') as string,
    body: formPostData.get('body') as string,
    // text: formPostData.get("text") as string,
    leagueId: 1,
  };

  await createAPost(postData, user.id);
  revalidatePath("league");
  return;

}

export async function getLeaguePostsAction(): Promise<Post[]> {
  const user = await auth();
  if (!user.userId) throw new Error("Not logged in");

  const leaguePosts = await getLeaguePosts();
  if (!leaguePosts) {
    throw new Error("Error getting league posts");
  }
  return leaguePosts as Post[];
}

// export async function deletePostAction(postId: number) {
//     await deletePost(postId);
// }

// export async function updatePostAction(postId: number, postData: Post) {
//     await updatePost(postId, postData);
// }