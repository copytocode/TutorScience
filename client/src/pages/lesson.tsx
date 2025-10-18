import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Lesson } from "@shared/schema";

export default function LessonView() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: ['/api/lessons', id],
  });

  const { data: allLessons } = useQuery<Lesson[]>({
    queryKey: lesson ? ['/api/topics', lesson.topicId, 'lessons'] : [],
    enabled: !!lesson,
  });

  const { data: lessonStatus } = useQuery<{ completed: boolean }>({
    queryKey: ['/api/progress/lesson', id],
    enabled: !!id,
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!lesson) return;
      return await apiRequest('POST', '/api/progress/lesson', {
        lessonId: lesson.id,
        topicId: lesson.topicId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress/lesson', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress/topic', lesson?.topicId] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({
        title: "Lesson Completed!",
        description: "Great work! Your progress has been saved.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Lesson not found</p>
            <Button asChild>
              <Link href="/topics">Back to Topics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentIndex = allLessons?.findIndex((l) => l.id === lesson.id) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && allLessons && currentIndex < allLessons.length - 1 
    ? allLessons[currentIndex + 1] 
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild data-testid="button-back">
            <Link href={`/topic/${lesson.topicId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topic
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <Badge variant="outline">
              Lesson {(currentIndex + 1)}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">{lesson.title}</h1>

          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-slate dark:prose-invert max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
                data-testid="lesson-content"
              />
            </CardContent>
          </Card>
        </div>

        {!lessonStatus?.completed && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <CardTitle>Mark as Complete</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Finished reading this lesson? Mark it as complete to track your progress.
              </p>
              <Button 
                onClick={() => markCompleteMutation.mutate()}
                disabled={markCompleteMutation.isPending}
                data-testid="button-mark-complete"
              >
                {markCompleteMutation.isPending ? "Saving..." : "Mark as Complete"}
              </Button>
            </CardContent>
          </Card>
        )}

        {lesson.hasExercises && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FlaskConical className="h-6 w-6 text-primary" />
                <CardTitle>Practice Exercises</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Test your understanding of this lesson with interactive practice questions
              </p>
              <Button asChild data-testid="button-start-exercises">
                <Link href={`/exercises/${lesson.id}`}>
                  Start Practice
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          {prevLesson ? (
            <Button 
              variant="outline" 
              onClick={() => setLocation(`/lesson/${prevLesson.id}`)}
              data-testid="button-previous-lesson"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Lesson
            </Button>
          ) : (
            <div></div>
          )}

          {nextLesson ? (
            <Button 
              onClick={() => setLocation(`/lesson/${nextLesson.id}`)}
              data-testid="button-next-lesson"
            >
              Next Lesson
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button asChild variant="outline" data-testid="button-back-to-topic">
              <Link href={`/topic/${lesson.topicId}`}>
                Back to Topic
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
