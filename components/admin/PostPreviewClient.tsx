'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types/post';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface PostPreviewClientProps {
  initialPost: Post;
}

export default function PostPreviewClient({ initialPost }: PostPreviewClientProps) {
  const router = useRouter();

  return (
    <div className="articles-admin">
      <div className="dashboard__title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <i className="ph ph-arrow-left" />
          </Button>
          <h2>Post Preview</h2>
        </div>
        <p>Preview how your post will look across different surfaces.</p>
      </div>

      <div className="dashboard__grid-layout">
        <div className="dashboard__grid-main">
          <div className="space-y-8">
            {/* App Feed Preview */}
            <section>
              <h3 className="label mb-4">In-App Feed Preview</h3>
              <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <article className="post-card" style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '1.5rem' }}>
                  <div className="post-card__header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: '#a3a3a3' }}>
                    <span>{formatDate(initialPost.createdAt)}</span>
                  </div>
                  <div className="post-card__content" style={{ fontSize: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {initialPost.content}
                  </div>
                  {initialPost.attachedMedia && initialPost.attachedMedia.length > 0 && (
                    <div className="mt-4" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #f5f5f5' }}>
                      {initialPost.attachedMedia.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', aspectRatio: '16/9' }}>
                          <Image src={url} alt="Post media" fill style={{ objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            </section>

            {/* LinkedIn Preview Mockup */}
            <section>
              <h3 className="label mb-4">LinkedIn Preview Mockup</h3>
              <div style={{ maxWidth: '550px', margin: '0 auto', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#eee', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Nischay Sharma</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Software Engineer & Creator</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Just now • 🌐</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                  {initialPost.content}
                </div>
                {initialPost.attachedMedia && initialPost.attachedMedia.length > 0 && (
                  <div style={{ margin: '0 -12px -12px', borderTop: '1px solid #e0e0e0' }}>
                    <div style={{ position: 'relative', aspectRatio: '1.91/1' }}>
                      <Image src={initialPost.attachedMedia[0]} alt="LinkedIn media" fill style={{ objectFit: 'cover' }} />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="dashboard__grid-sidebar">
          <Card padded>
            <h3 className="label">Actions</h3>
            <div className="mt-4 space-y-4">
              <Button size="full" onClick={() => router.push(`/admin/posts/${initialPost.id}`)}>
                Back to Editor
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
