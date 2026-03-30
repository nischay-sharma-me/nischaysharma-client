'use server';

import { postsService } from '@/services/posts.service';
import { ActionResponse } from '@/lib/types/common';
import { cookies } from 'next/headers';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('firebase-token')?.value;
}

export async function listPostsAction(): Promise<ActionResponse> {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };
    return await postsService.listPosts({}, token);
  } catch (error: any) {
    console.error('Server Action Error (listPosts):', error);
    return { success: false, error: error.message || 'Failed to list posts' };
  }
}

export async function deletePostAction(id: string): Promise<ActionResponse> {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };
    return await postsService.deletePost(id, token);
  } catch (error: any) {
    console.error('Server Action Error (deletePost):', error);
    return { success: false, error: error.message || 'Failed to delete post' };
  }
}

export async function publishPostAction(id: string, platforms: string[]): Promise<ActionResponse> {
  try {
    const token = await getAuthToken();
    if (!token) return { success: false, error: 'Unauthorized' };
    return await postsService.publishPost(id, platforms, token);
  } catch (error: any) {
    console.error('Server Action Error (publishPost):', error);
    return { success: false, error: error.message || 'Failed to publish post' };
  }
}
