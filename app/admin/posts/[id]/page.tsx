import React from 'react';
import { getPostAction } from '@/lib/actions/posts';
import PostEditClient from '@/components/admin/PostEditClient';
import { notFound } from 'next/navigation';

interface PostEditPageProps {
  params: {
    id: string;
  };
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  const { id } = params;
  const response = await getPostAction(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return <PostEditClient initialPost={response.data} />;
}
