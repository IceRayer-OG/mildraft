import { Post, CreatePost } from "../utils/posts";

export async function createPostUseCase() {
    // Use case to create a post
}

export async function getPostsUseCase(leagueId: number): Promise<Post[]> {
    // Use case to get posts for a league
    return [];
}

export async function updatePostUseCase(postId: number, data: CreatePost): Promise<Post> {
    // Use case to update a post
    return {} as Post;
}

export async function deletePostUseCase(postId: number): Promise<void> {
    // Use case to delete a post
}



