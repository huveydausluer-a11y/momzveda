import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const BOT_USER_AGENTS = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
    'whatsapp', 'telegrambot', 'applebot', 'semrushbot', 'ahrefsbot',
  ];

function isBot(request) {
    const ua = request.headers.get('user-agent')?.toLowerCase() || '';
    return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
}

export async function middleware(request) {
    // Allow bots to access all pages without auth redirect
  if (isBot(request)) {
        return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
            cookies: {
                      getAll() {
                                  return request.cookies.getAll();
                      },
                      setAll(cookiesToSet) {
                                  cookiesToSet.forEach(({ name, value }) =>
                                                request.cookies.set(name, value)
                                                                 );
                                  supabaseResponse = NextResponse.next({ request });
                                  cookiesToSet.forEach(({ name, value, options }) =>
                                                supabaseResponse.cookies.set(name, value, options)
                                                                 );
                      },
            },
    }
      );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in and trying to access protected route -> redirect to login
  if (!user && request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
  }

  // Logged in and trying to access auth pages -> redirect to home
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
    matcher: ['/', '/login', '/signup'],
};
