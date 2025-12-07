import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
    const slug = resolvedParams.slug

    // Get course with lessons
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        lessons:course_lessons (
          id,
          title,
          description,
          video_url,
          content,
          duration_minutes,
          is_preview,
          order_index
        )
      `)
      .eq('slug', slug)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check subscription
    let hasSubscription = false
    if (user) {
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('profile_id', user.id)
        .eq('status', 'active')
        .single()
      
      hasSubscription = !!subscription
    }

    // Get user progress
    let progress: any = {}
    if (user) {
      const { data: userProgress } = await supabase
        .from('user_course_progress')
        .select('lesson_id, completed, progress_percentage')
        .eq('profile_id', user.id)
        .eq('course_id', course.id)
      
      if (userProgress) {
        userProgress.forEach((p: any) => {
          progress[p.lesson_id] = {
            completed: p.completed,
            progress: p.progress_percentage,
          }
        })
      }
    }

    // Sort lessons by order_index
    course.lessons = (course.lessons || []).sort((a: any, b: any) => 
      (a.order_index || 0) - (b.order_index || 0)
    )

    return NextResponse.json({
      course,
      hasSubscription,
      progress,
    })
  } catch (error: any) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

