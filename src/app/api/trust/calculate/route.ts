import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface TrustInput {
  accountAge: number; // days
  postsCount: number;
  verified: boolean;
  reportCount: number;
  engagementRate: number; // 0-1
  contentQuality: number; // 0-100
  consistencyScore: number; // 0-100
}

function calculateTrustScore(input: TrustInput): {
  score: number;
  tier: string;
  breakdown: Record<string, number>;
  reachMultiplier: number;
} {
  // Multi-factor trust algorithm
  const ageScore = Math.min(input.accountAge / 365, 1) * 20;
  const activityScore = Math.min(input.postsCount / 100, 1) * 15;
  const verificationBonus = input.verified ? 15 : 0;
  const reportPenalty = Math.min(input.reportCount * 5, 30);
  const engagementScore = input.engagementRate * 20;
  const qualityScore = (input.contentQuality / 100) * 15;
  const consistencyScore = (input.consistencyScore / 100) * 15;

  const rawScore = ageScore + activityScore + verificationBonus + engagementScore + qualityScore + consistencyScore - reportPenalty;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const tier = score >= 90 ? 'authority' :
               score >= 75 ? 'trusted' :
               score >= 50 ? 'established' :
               score >= 25 ? 'building' : 'new';

  const reachMultiplier = score >= 90 ? 3.0 :
                          score >= 75 ? 2.0 :
                          score >= 50 ? 1.5 :
                          score >= 25 ? 1.0 : 0.5;

  return {
    score,
    tier,
    breakdown: {
      accountAge: Math.round(ageScore),
      activity: Math.round(activityScore),
      verification: verificationBonus,
      engagement: Math.round(engagementScore),
      contentQuality: Math.round(qualityScore),
      consistency: Math.round(consistencyScore),
      reportPenalty: -Math.round(reportPenalty),
    },
    reachMultiplier,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const input: TrustInput = {
    accountAge: body.accountAge ?? 30,
    postsCount: body.postsCount ?? 0,
    verified: body.verified ?? false,
    reportCount: body.reportCount ?? 0,
    engagementRate: body.engagementRate ?? 0.5,
    contentQuality: body.contentQuality ?? 50,
    consistencyScore: body.consistencyScore ?? 50,
  };

  const result = calculateTrustScore(input);
  return NextResponse.json(result);
}
