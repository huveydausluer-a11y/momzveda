import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '../../../../lib/supabase-server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Courses and their lesson counts. freeLessons lists the lessons playable
// without Premium (empty = the whole course is Premium-only).
// `file` overrides the default `lesson-N.mp4` storage path (single-video courses).
const COURSES = {
  'baby-sleep-guide': { lessons: 5, freeLessons: [1] },
  'first-week-home': { lessons: 1, freeLessons: [], file: 'first-week-home.mp4' },
};

const BUCKET = 'course-videos';
const SIGNED_URL_TTL = 60 * 60; // 1 hour

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course');
    const lesson = parseInt(searchParams.get('lesson'), 10);

    const course = COURSES[courseId];
    if (!course || !Number.isInteger(lesson) || lesson < 1 || lesson > course.lessons) {
      return NextResponse.json({ error: 'Invalid course or lesson' }, { status: 400 });
    }

    // Must be logged in
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Lessons beyond the free ones require Premium
    if (!course.freeLessons.includes(lesson)) {
      const { data: profile } = await admin
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();
      if (!profile?.is_premium) {
        return NextResponse.json({ error: 'Premium required' }, { status: 403 });
      }
    }

    // Signed URL from the private bucket
    const path = course.file ? `${courseId}/${course.file}` : `${courseId}/lesson-${lesson}.mp4`;
    const { data, error } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL);

    if (error || !data?.signedUrl) {
      // Video not uploaded yet (or wrong path)
      return NextResponse.json({ error: 'Video not available yet' }, { status: 404 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
