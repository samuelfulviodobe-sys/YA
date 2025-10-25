import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Note } from "@shared/schema";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: notes } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getNotesForDate = (date: Date) => {
    return notes?.filter((note) =>
      isSameDay(new Date(note.createdAt), date)
    ) || [];
  };

  const selectedDateNotes = selectedDate ? getNotesForDate(selectedDate) : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Calendar</h1>
          <Link href="/notes/new">
            <Button size="default" data-testid="button-create-note">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="space-y-0 pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        data-testid="button-prev-month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(new Date())}
                        data-testid="button-today"
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        data-testid="button-next-month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-muted-foreground py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day) => {
                      const dayNotes = getNotesForDate(day);
                      const isCurrentMonth = isSameMonth(day, currentMonth);
                      const isDayToday = isToday(day);
                      const isSelected = selectedDate && isSameDay(day, selectedDate);

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            min-h-[80px] p-2 rounded-lg border transition-all
                            hover-elevate active-elevate-2
                            ${!isCurrentMonth ? "opacity-40" : ""}
                            ${isDayToday ? "border-primary" : ""}
                            ${isSelected ? "bg-accent" : ""}
                          `}
                          data-testid={`button-day-${format(day, "yyyy-MM-dd")}`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`
                                text-sm font-medium w-6 h-6 rounded-full flex items-center justify-center
                                ${isDayToday ? "bg-primary text-primary-foreground" : ""}
                              `}
                            >
                              {format(day, "d")}
                            </div>
                            {dayNotes.length > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-xs text-muted-foreground">
                                  {dayNotes.length}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Date Notes */}
            <div className="lg:col-span-1">
              <Card className="sticky top-0">
                <CardHeader className="space-y-0 pb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
                      : "Select a date"}
                  </h3>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    selectedDateNotes.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateNotes.map((note) => (
                          <Link key={note.id} href={`/notes/${note.id}`}>
                            <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-note-${note.id}`}>
                              <CardContent className="p-4 space-y-2">
                                <h4 className="font-medium line-clamp-1">
                                  {note.title || "Untitled"}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {note.content || "No content"}
                                </p>
                                {note.tags.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {note.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground mb-4">
                          No notes for this day
                        </p>
                        <Link href="/notes/new">
                          <Button size="sm" data-testid="button-create-note-calendar">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Note
                          </Button>
                        </Link>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        Click on a date to see notes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
