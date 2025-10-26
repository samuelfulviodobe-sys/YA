import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Moon, Sun, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { type Note } from "@shared/schema";
import { jsPDF } from "jspdf";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const { data: notes } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const exportAsText = () => {
    if (!notes || notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    const content = notes
      .map((note) => {
        const header = `Title: ${note.title}\nDate: ${new Date(note.createdAt).toLocaleString()}\nTags: ${note.tags.join(", ")}\n${"=".repeat(80)}\n`;
        return `${header}${note.content}\n\n`;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    toast({
      title: "Notes exported",
      description: "Your notes have been exported as a text file.",
    });
  };

  const exportAsMarkdown = () => {
    if (!notes || notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    const content = notes
      .map((note) => {
        const header = `# ${note.title}\n\n`;
        const meta = `**Date:** ${new Date(note.createdAt).toLocaleString()}  \n**Tags:** ${note.tags.join(", ")}\n\n`;
        const divider = "---\n\n";
        return `${header}${meta}${note.content}\n\n${divider}`;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    toast({
      title: "Notes exported",
      description: "Your notes have been exported as a Markdown file.",
    });
  };

  const exportAsPDF = () => {
    if (!notes || notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first before exporting.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      notes.forEach((note, index) => {
        if (index > 0) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(note.title || "Untitled", maxWidth);
        doc.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text(`Date: ${new Date(note.createdAt).toLocaleString()}`, margin, yPosition);
        yPosition += 6;

        if (note.tags.length > 0) {
          doc.text(`Tags: ${note.tags.join(", ")}`, margin, yPosition);
          yPosition += 6;
        }

        doc.setTextColor(0);
        yPosition += 4;

        if (note.content) {
          doc.setFontSize(11);
          const contentLines = doc.splitTextToSize(note.content, maxWidth);
          contentLines.forEach((line: string) => {
            if (yPosition > pageHeight - margin) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 6;
          });
        }
      });

      doc.save(`notes-${new Date().toISOString().split("T")[0]}.pdf`);

      setIsExporting(false);
      toast({
        title: "Notes exported",
        description: "Your notes have been exported as a PDF file.",
      });
    } catch (error) {
      setIsExporting(false);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting to PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your experience
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Customize how Note Be looks
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    data-testid="button-light-mode"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    data-testid="button-dark-mode"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Export Notes</h2>
              <p className="text-sm text-muted-foreground">
                Download your notes in different formats
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportAsText}
                disabled={isExporting || !notes || notes.length === 0}
                data-testid="button-export-txt"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as Text (.txt)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportAsMarkdown}
                disabled={isExporting || !notes || notes.length === 0}
                data-testid="button-export-md"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as Markdown (.md)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={exportAsPDF}
                disabled={isExporting || !notes || notes.length === 0}
                data-testid="button-export-pdf"
              >
                <File className="w-4 h-4 mr-2" />
                Export as PDF (.pdf)
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About Note Be</h2>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Note Be is a comprehensive productivity application that combines
                note-taking with proven productivity techniques.
              </p>
              <p>
                Built with privacy in mind - all your data stays on your device.
              </p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs">
                  Version 1.0.0 • Made with focus and clarity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
