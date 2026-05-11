import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isTrackerPath = request.nextUrl.pathname.startsWith('/tracker')
  const isLoginPath = request.nextUrl.pathname === '/tracker/login'

  if (isTrackerPath && !isLoginPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/tracker/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/tracker'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/tracker/:path*'],
}
