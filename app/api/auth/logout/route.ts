import { NextResponse } from 'next/server';
import { clearSessionCookie } from '../../../../lib/member/auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/member-login', request.url), { status: 303 });
  return clearSessionCookie(response);
}
