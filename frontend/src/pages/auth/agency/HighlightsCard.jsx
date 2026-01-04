import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Star, Trash2 } from "lucide-react";
  
  export default function HighlightsCard({ highlights, onDelete }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Highlights
          </CardTitle>
          <CardDescription>Featured content</CardDescription>
        </CardHeader>
  
        <CardContent>
          {highlights.length > 0 ? (
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="flex justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{highlight.title}</h4>
                    <p className="text-sm text-gray-600">
                      {highlight.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onDelete("highlights", highlight.id, highlight.title)
                    }
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">
              No highlights yet
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  