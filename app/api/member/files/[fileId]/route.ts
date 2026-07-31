import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '../../../../../lib/member/auth';
import { createSignedObjectUrl } from '../../../../../lib/member/supabase';
import { getPrivateFileRecord } from '../../../../../lib/member/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ fileId: string }> };

export async function GET(request: NextRequest, { params }: Props) {
  const context = await getAuthContext();
  if (!context) return NextResponse.redirect(new URL('/member-login', request.url));

  const { fileId } = await params;
  const kind = request.nextUrl.searchParams.get('kind');
  const file = await getPrivateFileRecord(kind, fileId);
  if (!file) {
    return NextResponse.json({ ok: false, error: 'ไม่พบไฟล์' }, { status: 404 });
  }

  const isAdmin = context.user.role === 'admin';
  const ownsFile = file.userId === context.user.id;
  const canViewPreview = file.publicForActiveMembers && context.membership?.status === 'active';
  if (!isAdmin && !ownsFile && !canViewPreview) {
    return NextResponse.json({ ok: false, error: 'ไม่มีสิทธิ์เข้าถึงไฟล์นี้' }, { status: 403 });
  }

  const url = await createSignedObjectUrl(file.bucket, file.path, 90);
  return NextResponse.redirect(url);
}
