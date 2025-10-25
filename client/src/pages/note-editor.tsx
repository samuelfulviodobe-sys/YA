import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Star, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { type Note, type InsertNote } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function NoteEditorPage() {
  const [, params] = useRoute("/notes/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isNewNote = params?.id === "new";
  const noteId = isNewNote ? undefined : params?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: note, isLoading } = useQuery<Note>({
    queryKey: ["/api/notes", noteId],
    enabled: !isNewNote && !!noteId,
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setIsFavorite(note.isFavorite);
    }
  }, [note]);

  useEffect(() => {
    if (!isNewNote && note) {
      const changed =
        title !== note.title ||
        content !== note.content ||
        JSON.stringify(tags) !== JSON.stringify(note.tags) ||
        isFavorite !== note.isFavorite;
      setHasChanges(changed);
    } else if (isNewNote) {
      setHasChanges(title.trim() !== "" || content.trim() !== "");
    }
  }, [title, content, tags, isFavorite, note, isNewNote]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertNote) => {
      return await apiRequest("POST", "/api/notes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
      setLocation("/");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertNote>) => {
      return await apiRequest("PATCH", `/api/notes/${noteId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes", noteId] });
      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
      });
      setHasChanges(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/notes/${noteId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
      setLocation("/");
    },
  });

  const handleSave = () => {
    const noteData: InsertNote = {
      title: title.trim() || "Untitled",
      content,
      tags,
      isFavorite,
    };

    if (isNewNote) {
      createMutation.mutate(noteData);
    } else {
      updateMutation.mutate(noteData);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (isLoading && !isNewNote) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-sm text-muted-foreground">
            {isNewNote ? "New Note" : "Edit Note"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            data-testid="button-favorite"
          >
            <Star
              className={`w-5 h-5 ${
                isFavorite ? "fill-primary text-primary" : ""
              }`}
            />
          </Button>
          {!isNewNote && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              data-testid="button-delete"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={
              !hasChanges ||
              createMutation.isPending ||
              updateMutation.isPending
            }
            data-testid="button-save"
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Title */}
          <Input
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-semibold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            data-testid="input-title"
          />

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1"
                  data-testid={`badge-tag-${tag}`}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover-elevate rounded-full"
                    data-testid={`button-remove-tag-${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="max-w-xs"
                data-testid="input-new-tag"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                data-testid="button-add-tag"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Tag
              </Button>
            </div>
          </div>

          {/* Content */}
          <Textarea
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none border-0 px-0 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
            data-testid="textarea-content"
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
