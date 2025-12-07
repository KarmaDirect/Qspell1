import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get all courses (premium check happens in frontend)
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons:course_lessons (
          id,
          title,
          duration_minutes,
          is_preview,
          order_index
        )
      `)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Get user subscription if logged in
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

    // Get user progress for each course if logged in
    let userProgress: Record<string, any> = {}
    if (user) {
      const { data: progress } = await supabase
        .from('user_course_progress')
        .select('course_id, completed, progress_percentage')
        .eq('profile_id', user.id)
      
      if (progress) {
        progress.forEach((p: any) => {
          userProgress[p.course_id] = {
            completed: p.completed,
            progress: p.progress_percentage,
          }
        })
      }
    }

    return NextResponse.json({
      courses: courses || [],
      hasSubscription,
      userProgress,
    })
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

