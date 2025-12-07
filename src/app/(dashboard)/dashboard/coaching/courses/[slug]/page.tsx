import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CourseHeader } from '@/components/coaching/course-header'
import { CourseLessons } from '@/components/coaching/course-lessons'
import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params))
  const slug = resolvedParams.slug

  // Get course
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
    notFound()
  }

  // Sort lessons
  if (course.lessons) {
    course.lessons = course.lessons.sort((a: any, b: any) => 
      (a.order_index || 0) - (b.order_index || 0)
    )
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('id')
    .eq('profile_id', user.id)
    .eq('status', 'active')
    .single()

  const hasSubscription = !!subscription

  // Get progress
  const { data: userProgress } = await supabase
    .from('user_course_progress')
    .select('lesson_id, completed, progress_percentage')
    .eq('profile_id', user.id)
    .eq('course_id', course.id)

  const progress: Record<string, any> = {}
  if (userProgress) {
    userProgress.forEach((p: any) => {
      progress[p.lesson_id] = {
        completed: p.completed,
        progress: p.progress_percentage,
      }
    })
  }

  const canAccess = !course.is_premium || hasSubscription

  return (
    <div className="container py-8">
      <CourseHeader course={course} hasSubscription={hasSubscription} progress={progress} />

      {!canAccess ? (
        <Card className="p-12 text-center mt-8">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-2xl font-bold mb-2">Formation Premium</h3>
          <p className="text-muted-foreground mb-6">
            Cette formation nécessite un abonnement QSPELL Premium
          </p>
          <Link href="/dashboard/coaching">
            <Button size="lg">
              Voir les abonnements
            </Button>
          </Link>
        </Card>
      ) : (
        <CourseLessons 
          course={course} 
          progress={progress}
          hasSubscription={hasSubscription}
        />
      )}
    </div>
  )
}

