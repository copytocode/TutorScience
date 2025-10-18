import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Exercise, Lesson, SubmitAnswer } from "@shared/schema";

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export default function Exercises() {
  const { lessonId } = useParams();
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  const { data: lesson } = useQuery<Lesson>({
    queryKey: ['/api/lessons', lessonId],
  });

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ['/api/lessons', lessonId, 'exercises'],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitAnswer) => {
      return await apiRequest('POST', '/api/exercises/submit', data) as Promise<AnswerResult>;
    },
    onSuccess: (data: AnswerResult) => {
      setResult(data);
      setShowResult(true);
      if (data.isCorrect) {
        setScore(score + 1);
      }
      setAttemptedCount(attemptedCount + 1);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" asChild className="mb-6" data-testid="button-back">
            <Link href={lesson ? `/lesson/${lesson.id}` : '/topics'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Link>
          </Button>
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No exercises available for this lesson</p>
              <Button asChild>
                <Link href={lesson ? `/lesson/${lesson.id}` : '/topics'}>
                  Back to Lesson
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const progressPercentage = ((currentExerciseIndex + 1) / exercises.length) * 100;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please select or enter an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate({
      exerciseId: currentExercise.id,
      userAnswer: userAnswer.trim(),
    });
  };

  const handleNext = () => {
    if (isLastExercise) {
      return;
    }
    setCurrentExerciseIndex(currentExerciseIndex + 1);
    setUserAnswer("");
    setShowResult(false);
    setResult(null);
  };

  const handleReset = () => {
    setCurrentExerciseIndex(0);
    setUserAnswer("");
    setShowResult(false);
    setResult(null);
    setScore(0);
    setAttemptedCount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild data-testid="button-back">
            <Link href={lesson ? `/lesson/${lesson.id}` : '/topics'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Practice Exercises</h1>
            <Badge variant="secondary" data-testid="text-score">
              Score: {score}/{attemptedCount}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold" data-testid="text-question-progress">
                Question {currentExerciseIndex + 1} of {exercises.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" data-testid="progress-exercises" />
          </div>
        </div>

        {attemptedCount === exercises.length && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Exercises Complete!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You've completed all exercises. Your score: <span className="font-semibold text-foreground">{score}/{exercises.length}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleReset} variant="outline" data-testid="button-retry">
                  Try Again
                </Button>
                <Button asChild data-testid="button-back-to-lesson">
                  <Link href={lesson ? `/lesson/${lesson.id}` : '/topics'}>
                    Back to Lesson
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card data-testid={`card-exercise-${currentExercise.id}`}>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed" data-testid="text-question">
              {currentExercise.question}
            </CardTitle>
            <CardDescription className="capitalize">
              {currentExercise.type.replace('-', ' ')} Question
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showResult && (
              <>
                {currentExercise.type === 'multiple-choice' && currentExercise.options && (
                  <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                    <div className="space-y-3">
                      {currentExercise.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-md hover-elevate border" data-testid={`radio-option-${index}`}>
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentExercise.type === 'true-false' && (
                  <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-md hover-elevate border" data-testid="radio-true">
                        <RadioGroupItem value="true" id="true" />
                        <Label htmlFor="true" className="flex-1 cursor-pointer font-normal">
                          True
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-md hover-elevate border" data-testid="radio-false">
                        <RadioGroupItem value="false" id="false" />
                        <Label htmlFor="false" className="flex-1 cursor-pointer font-normal">
                          False
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                )}

                {currentExercise.type === 'short-answer' && (
                  <Input
                    placeholder="Enter your answer..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    data-testid="input-answer"
                  />
                )}

                <Button 
                  onClick={handleSubmit} 
                  className="w-full" 
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? "Checking..." : "Submit Answer"}
                </Button>
              </>
            )}

            {showResult && result && (
              <div className="space-y-4">
                <Card className={result.isCorrect ? "border-green-500/50 bg-green-50 dark:bg-green-950/20" : "border-red-500/50 bg-red-50 dark:bg-red-950/20"}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {result.isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" data-testid="icon-correct" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" data-testid="icon-incorrect" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2 text-foreground">
                          {result.isCorrect ? "Correct!" : "Incorrect"}
                        </h3>
                        {!result.isCorrect && (
                          <p className="text-sm text-muted-foreground mb-2">
                            The correct answer is: <span className="font-semibold text-foreground">{result.correctAnswer}</span>
                          </p>
                        )}
                        <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-explanation">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleNext} 
                  className="w-full"
                  disabled={isLastExercise}
                  data-testid="button-next"
                >
                  {isLastExercise ? "Completed" : "Next Question"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
