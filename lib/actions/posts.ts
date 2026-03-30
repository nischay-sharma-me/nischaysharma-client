'use server';

import { postsService } from '@/services/posts.service';
import { Post } from '@/lib/types/post';
import { ActionResponse } from '@/lib/types/common';
import { getAuthToken } from '@/lib/auth';

export async function listPostsAction(options = {}): Promise<ActionResponse<Post[]>> {
  try {
    return await postsService.listPosts(options);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function getPostAction(postId: string): Promise<ActionResponse<Post>> {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('Unauthorized');
    return await postsService.getPost(postId, token);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
