import { Link } from "wouter";
import {
  Beaker,
  Atom,
  Leaf,
  GraduationCap,
  BookOpen,
  Trophy,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const subjects = [
  {
    id: "biology",
    name: "Biology",
    icon: Leaf,
    color: "from-green-500 to-emerald-600",
    description: "Explore living organisms, cells, and ecosystems",
    topics: 42,
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: Beaker,
    color: "from-teal-500 to-cyan-600",
    description: "Discover elements, reactions, and compounds",
    topics: 38,
  },
  {
    id: "physics",
    name: "Physics",
    icon: Atom,
    color: "from-purple-500 to-violet-600",
    description: "Master forces, energy, and the universe",
    topics: 45,
  },
];

const levels = [
  {
    id: "ks3",
    name: "KS3",
    displayName: "Key Stage 3",
    description: "Foundation science for ages 11-14",
    badge: "Foundation",
  },
  {
    id: "gcse",
    name: "GCSE",
    displayName: "GCSE",
    description: "Exam preparation for ages 14-16",
    badge: "Intermediate",
  },
  {
    id: "a-level",
    name: "A-Level",
    displayName: "A-Level",
    description: "Advanced study for ages 16-18",
    badge: "Advanced",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              ScienceTutor
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master Biology, Chemistry, and Physics with interactive lessons and
            practice exercises
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics, lessons, or subjects..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
            Choose Your Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {levels.map((level) => (
              <Card
                key={level.id}
                className="hover-elevate active-elevate-2 transition-shadow"
                data-testid={`card-level-${level.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xl">
                      {level.displayName}
                    </CardTitle>
                    <Badge variant="secondary">{level.badge}</Badge>
                  </div>
                  <CardDescription className="leading-relaxed">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    className="w-full"
                    data-testid={`button-explore-${level.id}`}
                  >
                    <Link href={`/topics?level=${level.id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore Topics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
            Subjects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="overflow-hidden hover-elevate active-elevate-2 transition-shadow"
                data-testid={`card-subject-${subject.id}`}
              >
                <div
                  className={`h-32 bg-gradient-to-br ${subject.color} flex items-center justify-center`}
                >
                  <subject.icon className="h-16 w-16 text-white" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      {subject.topics} topics available
                    </span>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    data-testid={`button-view-${subject.id}`}
                  >
                    <Link href={`/topics?subject=${subject.id}`}>
                      View Topics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Track Your Progress</CardTitle>
                <CardDescription>
                  Complete lessons and exercises to master each topic
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card rounded-md">
                <div className="text-3xl font-bold text-primary mb-1">125+</div>
                <div className="text-sm text-muted-foreground">
                  Topics Covered
                </div>
              </div>
              <div className="text-center p-4 bg-card rounded-md">
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">
                  Practice Questions
                </div>
              </div>
              <div className="text-center p-4 bg-card rounded-md">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Free to Use</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
