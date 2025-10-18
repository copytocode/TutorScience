import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Beaker, Atom, Leaf, Search, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Topic } from "@shared/schema";

const subjectIcons = {
  biology: Leaf,
  chemistry: Beaker,
  physics: Atom,
};

const subjectColors = {
  biology: 'from-green-500 to-emerald-600',
  chemistry: 'from-teal-500 to-cyan-600',
  physics: 'from-purple-500 to-violet-600',
};

const levelLabels = {
  'ks3': 'Key Stage 3',
  'gcse': 'GCSE',
  'a-level': 'A-Level',
};

export default function Topics() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const subjectParam = params.get('subject') as 'biology' | 'chemistry' | 'physics' | null;
  const levelParam = params.get('level') as 'ks3' | 'gcse' | 'a-level' | null;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>(subjectParam || "all");
  const [selectedLevel, setSelectedLevel] = useState<string>(levelParam || "all");

  const { data: topics, isLoading } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const filteredTopics = topics?.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || topic.subject === selectedSubject;
    const matchesLevel = selectedLevel === "all" || topic.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  }) || [];

  const groupedBySubject = filteredTopics.reduce((acc, topic) => {
    if (!acc[topic.subject]) {
      acc[topic.subject] = [];
    }
    acc[topic.subject].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild data-testid="button-back">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Browse Topics</h1>
          <p className="text-muted-foreground leading-relaxed">
            Select a topic to start learning and practicing
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-topics"
            />
          </div>
        </div>

        <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="mb-6">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0" data-testid="tabs-level">
            <TabsTrigger value="all" data-testid="tab-all-levels">All Levels</TabsTrigger>
            <TabsTrigger value="ks3" data-testid="tab-ks3">KS3</TabsTrigger>
            <TabsTrigger value="gcse" data-testid="tab-gcse">GCSE</TabsTrigger>
            <TabsTrigger value="a-level" data-testid="tab-a-level">A-Level</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="mb-8">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0" data-testid="tabs-subject">
            <TabsTrigger value="all" data-testid="tab-all-subjects">All Subjects</TabsTrigger>
            <TabsTrigger value="biology" data-testid="tab-biology">
              <Leaf className="h-4 w-4 mr-2" />
              Biology
            </TabsTrigger>
            <TabsTrigger value="chemistry" data-testid="tab-chemistry">
              <Beaker className="h-4 w-4 mr-2" />
              Chemistry
            </TabsTrigger>
            <TabsTrigger value="physics" data-testid="tab-physics">
              <Atom className="h-4 w-4 mr-2" />
              Physics
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTopics.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No topics found matching your criteria</p>
              <Button onClick={() => { setSearchQuery(""); setSelectedSubject("all"); setSelectedLevel("all"); }} data-testid="button-clear-filters">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBySubject).map(([subject, subjectTopics]) => {
              const Icon = subjectIcons[subject as keyof typeof subjectIcons];
              const colorClass = subjectColors[subject as keyof typeof subjectColors];
              
              return (
                <div key={subject}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-md bg-gradient-to-br ${colorClass}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold capitalize text-foreground">{subject}</h2>
                    <Badge variant="secondary">{subjectTopics.length} topics</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjectTopics.map((topic) => (
                      <Card 
                        key={topic.id} 
                        className="hover-elevate active-elevate-2 transition-shadow border-l-4"
                        style={{ borderLeftColor: `hsl(var(--chart-${subject === 'biology' ? '3' : subject === 'chemistry' ? '2' : '1'}))` }}
                        data-testid={`card-topic-${topic.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg leading-tight">{topic.title}</CardTitle>
                            {topic.completed && (
                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" data-testid={`icon-completed-${topic.id}`} />
                            )}
                            {!topic.completed && (
                              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {levelLabels[topic.level]}
                            </Badge>
                          </div>
                          <CardDescription className="leading-relaxed line-clamp-2">
                            {topic.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">
                              {topic.lessonCount} {topic.lessonCount === 1 ? 'lesson' : 'lessons'}
                            </span>
                          </div>
                          <Button asChild className="w-full" data-testid={`button-start-${topic.id}`}>
                            <Link href={`/topic/${topic.id}`}>
                              Start Learning
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
