import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Topic, Lesson, TopicProgress } from "@shared/schema";

export default function TopicDetail() {
  const { id } = useParams();

  const { data: topic, isLoading: topicLoading } = useQuery<Topic>({
    queryKey: ['/api/topics', id],
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['/api/topics', id, 'lessons'],
  });

  const { data: topicProgress } = useQuery<TopicProgress>({
    queryKey: ['/api/progress/topic', id],
    enabled: !!id,
  });

  const { data: allProgress } = useQuery<Array<{ lessonId: string; completed: boolean }>>({
    queryKey: ['/api/progress'],
  });

  const isLoading = topicLoading || lessonsLoading;

  const isLessonComplete = (lessonId: string) => {
    return allProgress?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-24 bg-muted rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Topic not found</p>
            <Button asChild>
              <Link href="/topics">Back to Topics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedLessons = topicProgress?.completedLessons || 0;
  const totalLessons = topicProgress?.totalLessons || lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild data-testid="button-back">
            <Link href="/topics">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className="capitalize">
              {topic.subject}
            </Badge>
            <Badge variant="outline">
              {topic.level.toUpperCase().replace('-', ' ')}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{topic.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{topic.description}</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Lessons Completed</span>
                <span className="font-semibold" data-testid="text-progress">
                  {completedLessons} / {totalLessons}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" data-testid="progress-lessons" />
              {topicProgress && topicProgress.exercisesCompleted > 0 && (
                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-muted-foreground">Practice Score</span>
                  <span className="font-semibold">
                    {topicProgress.averageScore ? `${Math.round(topicProgress.averageScore)}%` : 'N/A'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Lessons
          </h2>

          {lessons && lessons.length > 0 ? (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const completed = isLessonComplete(lesson.id);
                return (
                  <Card 
                    key={lesson.id} 
                    className="hover-elevate active-elevate-2 transition-shadow"
                    data-testid={`card-lesson-${lesson.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <CardTitle className="text-lg leading-tight">{lesson.title}</CardTitle>
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" data-testid={`icon-completed-${lesson.id}`} />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                          {lesson.hasExercises && (
                            <Badge variant="secondary" className="text-xs">
                              Includes Practice Exercises
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full sm:w-auto" data-testid={`button-start-lesson-${lesson.id}`}>
                        <Link href={`/lesson/${lesson.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          {completed ? 'Review Lesson' : 'Start Lesson'}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No lessons available yet for this topic</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
