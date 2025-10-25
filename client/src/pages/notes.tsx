import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Search, Star, Tag, Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Note } from "@shared/schema";
import { format } from "date-fns";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const filteredNotes = notes?.filter((note) => {
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set(notes?.flatMap((note) => note.tags) || [])
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold">Notes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Capture your thoughts and ideas
            </p>
          </div>
          <Link href="/notes/new">
            <Button size="default" data-testid="button-create-note">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              data-testid="button-filter-all"
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                data-testid={`button-filter-${tag}`}
              >
                {tag}
                {selectedTag === tag && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No notes found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || selectedTag
                ? "Try adjusting your filters"
                : "Create your first note to get started"}
            </p>
            {!searchQuery && !selectedTag && (
              <Link href="/notes/new">
                <Button data-testid="button-create-first-note">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes?.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="hover-elevate active-elevate-2 transition-all cursor-pointer h-full" data-testid={`card-note-${note.id}`}>
                  <CardHeader className="space-y-0 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-medium line-clamp-2 flex-1">
                        {note.title || "Untitled"}
                      </h3>
                      {note.isFavorite && (
                        <Star className="w-4 h-4 fill-primary text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content || "No content"}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-3 h-3 text-muted-foreground" />
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="w-3 h-3" />
                      {format(new Date(note.updatedAt), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
