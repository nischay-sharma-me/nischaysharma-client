import React from 'react';
import BookDetailClient from './BookDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <BookDetailClient bookId={id} />;
}
