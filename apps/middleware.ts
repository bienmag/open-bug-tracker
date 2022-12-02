import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  if (url.pathname.startsWith('/apps')) {
    url.pathname = '/'
    // get the token out from cookies
    const token = request.cookies.get('token')
    // if not token then redirect
    if (!token) {
      return NextResponse.redirect(url)
    }


  }
}