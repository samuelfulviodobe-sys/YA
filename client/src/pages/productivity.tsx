import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Play, Pause, RotateCcw, Plus, Trash2, Check, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  type PomodoroSession,
  type InsertPomodoroSession,
  type KaizenGoal,
  type InsertKaizenGoal,
  type EisenhowerTask,
  type InsertEisenhowerTask,
} from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export default function ProductivityPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-semibold">Productivity</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Focus, improve, and prioritize
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="pomodoro" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pomodoro" data-testid="tab-pomodoro">
              Pomodoro
            </TabsTrigger>
            <TabsTrigger value="kaizen" data-testid="tab-kaizen">
              Kaizen
            </TabsTrigger>
            <TabsTrigger value="eisenhower" data-testid="tab-eisenhower">
              Eisenhower Matrix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pomodoro" className="mt-6">
            <PomodoroTimer />
          </TabsContent>

          <TabsContent value="kaizen" className="mt-6">
            <KaizenTracker />
          </TabsContent>

          <TabsContent value="eisenhower" className="mt-6">
            <EisenhowerMatrix />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const { toast } = useToast();

  const { data: sessions } = useQuery<PomodoroSession[]>({
    queryKey: ["/api/pomodoro-sessions"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: InsertPomodoroSession) => {
      return await apiRequest("POST", "/api/pomodoro-sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pomodoro-sessions"] });
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            const sessionType = isBreak ? "break" : "work";
            const duration = isBreak ? breakDuration : workDuration;
            
            createSessionMutation.mutate({
              duration,
              type: sessionType,
            });

            toast({
              title: isBreak ? "Break complete!" : "Work session complete!",
              description: isBreak
                ? "Time to get back to work"
                : "Take a break to recharge",
            });

            if (typeof Audio !== "undefined") {
              const audio = new Audio("/notification.mp3");
              audio.play().catch(() => {});
            }

            setIsBreak(!isBreak);
            setMinutes(isBreak ? workDuration : breakDuration);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, minutes, seconds, isBreak, workDuration, breakDuration]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(workDuration);
    setSeconds(0);
  };

  const todaySessions = sessions?.filter((session) => {
    const today = new Date();
    const sessionDate = new Date(session.completedAt);
    return (
      sessionDate.toDateString() === today.toDateString() &&
      session.type === "work"
    );
  }).length || 0;

  const progress = ((workDuration * 60 - (minutes * 60 + seconds)) / (workDuration * 60)) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center">
              {/* Timer Display */}
              <div className="relative w-64 h-64 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - (isRunning ? progress / 100 : 0))}`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-mono font-bold" data-testid="text-timer">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {isBreak ? "Break Time" : "Focus Time"}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {!isRunning ? (
                  <Button
                    size="lg"
                    onClick={handleStart}
                    className="w-32"
                    data-testid="button-start"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handlePause}
                    className="w-32"
                    data-testid="button-pause"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Settings</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Work Duration (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 25;
                  setWorkDuration(val);
                  if (!isRunning && !isBreak) {
                    setMinutes(val);
                  }
                }}
                disabled={isRunning}
                data-testid="input-work-duration"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Break Duration (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 5;
                  setBreakDuration(val);
                  if (!isRunning && isBreak) {
                    setMinutes(val);
                  }
                }}
                disabled={isRunning}
                data-testid="input-break-duration"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Today's Progress</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary" data-testid="text-sessions-count">
                {todaySessions}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Sessions Completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KaizenTracker() {
  const [newGoal, setNewGoal] = useState("");
  const { toast } = useToast();

  const { data: goals } = useQuery<KaizenGoal[]>({
    queryKey: ["/api/kaizen-goals"],
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: InsertKaizenGoal) => {
      return await apiRequest("POST", "/api/kaizen-goals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kaizen-goals"] });
      setNewGoal("");
      toast({
        title: "Goal created",
        description: "Your daily improvement goal has been set.",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return await apiRequest("PATCH", `/api/kaizen-goals/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kaizen-goals"] });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/kaizen-goals/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kaizen-goals"] });
    },
  });

  const handleCreateGoal = () => {
    if (newGoal.trim()) {
      createGoalMutation.mutate({
        goal: newGoal.trim(),
        date: new Date(),
        completed: false,
      });
    }
  };

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  const thisWeekGoals = goals?.filter((goal) =>
    isWithinInterval(new Date(goal.date), { start: weekStart, end: weekEnd })
  ) || [];

  const completedThisWeek = thisWeekGoals.filter((g) => g.completed).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Create Goal */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Today's Improvement Goal</h3>
            <p className="text-sm text-muted-foreground">
              What will you improve by 1% today?
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Read 10 pages, Practice coding for 30 minutes..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateGoal();
                  }
                }}
                data-testid="input-kaizen-goal"
              />
              <Button
                onClick={handleCreateGoal}
                disabled={!newGoal.trim() || createGoalMutation.isPending}
                data-testid="button-create-goal"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent Goals</h3>
          </CardHeader>
          <CardContent>
            {goals && goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 10).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg border hover-elevate"
                    data-testid={`card-goal-${goal.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={goal.completed}
                        onCheckedChange={(checked) => {
                          updateGoalMutation.mutate({
                            id: goal.id,
                            completed: checked as boolean,
                          });
                        }}
                        data-testid={`checkbox-goal-${goal.id}`}
                      />
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            goal.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {goal.goal}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(goal.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoalMutation.mutate(goal.id)}
                      data-testid={`button-delete-goal-${goal.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No goals yet. Create your first improvement goal!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">This Week</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary" data-testid="text-weekly-progress">
                {completedThisWeek}/{thisWeekGoals.length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Goals Completed
              </div>
            </div>

            {thisWeekGoals.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">Daily Progress</div>
                {thisWeekGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {format(new Date(goal.date), "EEE")}
                    </span>
                    {goal.completed ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EisenhowerMatrix() {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: tasks } = useQuery<EisenhowerTask[]>({
    queryKey: ["/api/eisenhower-tasks"],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertEisenhowerTask) => {
      return await apiRequest("POST", "/api/eisenhower-tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eisenhower-tasks"] });
      setNewTaskTitle("");
      setSelectedQuadrant(null);
      toast({
        title: "Task created",
        description: "Your task has been added to the matrix.",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return await apiRequest("PATCH", `/api/eisenhower-tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eisenhower-tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/eisenhower-tasks/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eisenhower-tasks"] });
    },
  });

  const quadrants = [
    {
      id: "urgent-important",
      title: "Urgent & Important",
      description: "Do First",
      color: "bg-destructive/10 border-destructive/20",
    },
    {
      id: "not-urgent-important",
      title: "Not Urgent & Important",
      description: "Schedule",
      color: "bg-primary/10 border-primary/20",
    },
    {
      id: "urgent-not-important",
      title: "Urgent & Not Important",
      description: "Delegate",
      color: "bg-chart-2/10 border-chart-2/20",
    },
    {
      id: "not-urgent-not-important",
      title: "Not Urgent & Not Important",
      description: "Eliminate",
      color: "bg-muted border-muted",
    },
  ];

  const getTasksByQuadrant = (quadrant: string) => {
    return tasks?.filter((task) => task.quadrant === quadrant) || [];
  };

  return (
    <div className="space-y-6">
      {/* Add Task */}
      {selectedQuadrant && (
        <Card className="border-primary">
          <CardHeader className="space-y-0 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Add Task to {quadrants.find((q) => q.id === selectedQuadrant)?.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedQuadrant(null);
                  setNewTaskTitle("");
                }}
                data-testid="button-cancel-task"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTaskTitle.trim()) {
                    createTaskMutation.mutate({
                      title: newTaskTitle.trim(),
                      quadrant: selectedQuadrant,
                      completed: false,
                      noteId: null,
                    });
                  }
                }}
                autoFocus
                data-testid="input-task-title"
              />
              <Button
                onClick={() => {
                  if (newTaskTitle.trim()) {
                    createTaskMutation.mutate({
                      title: newTaskTitle.trim(),
                      quadrant: selectedQuadrant,
                      completed: false,
                      noteId: null,
                    });
                  }
                }}
                disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
                data-testid="button-add-task"
              >
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((quadrant) => {
          const quadrantTasks = getTasksByQuadrant(quadrant.id);
          return (
            <Card key={quadrant.id} className={quadrant.color} data-testid={`card-quadrant-${quadrant.id}`}>
              <CardHeader className="space-y-0 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{quadrant.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {quadrant.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedQuadrant(quadrant.id)}
                    data-testid={`button-add-${quadrant.id}`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quadrantTasks.length > 0 ? (
                  <div className="space-y-2">
                    {quadrantTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background/50 hover-elevate"
                        data-testid={`task-${task.id}`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => {
                              updateTaskMutation.mutate({
                                id: task.id,
                                completed: checked as boolean,
                              });
                            }}
                            data-testid={`checkbox-task-${task.id}`}
                          />
                          <span
                            className={`text-sm truncate ${
                              task.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 w-6 h-6"
                          onClick={() => deleteTaskMutation.mutate(task.id)}
                          data-testid={`button-delete-task-${task.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No tasks yet
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
