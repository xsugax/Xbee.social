import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// In-memory store (would be a database in production)
const posts: any[] = [];

export async function GET() {
  return NextResponse.json({ posts, total: posts.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, media, authorId } = body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  if (content.length > 25000) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 });
  }

  const post = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content: content.trim(),
    media: media || [],
    authorId: authorId || 'anonymous',
    likes: 0,
    reposts: 0,
    replies: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    credibility: {
      authorTrust: 80,
      contentScore: 75,
      engagementQuality: 1.0,
      viralityBrake: false,
    },
  };

  posts.unshift(post);
  return NextResponse.json({ post }, { status: 201 });
}
