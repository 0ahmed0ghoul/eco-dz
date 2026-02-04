import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Eye, ChevronRight } from "lucide-react";

export default function HighlightsCard({ highlights, onDelete }) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
              Highlights
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Featured content to showcase your best offerings
            </CardDescription>
          </div>
          <div className="px-3 py-1 bg-white border border-emerald-200 rounded-full text-sm font-medium text-emerald-700">
            {highlights.length} {highlights.length === 1 ? 'Highlight' : 'Highlights'}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {highlights.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image Section */}
                  {highlight.image && (
                    <div className="sm:w-1/3 relative overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/highlights/${highlight.image}`}
                        alt={highlight.title}
                        className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                        Featured
                      </div>
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className={`${highlight.image ? 'sm:w-2/3' : 'w-full'} p-5 flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg text-gray-900 line-clamp-1">
                          {highlight.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onDelete("highlights", highlight.id, highlight.title)
                          }
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {highlight.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                        <Eye className="h-4 w-4" />
                        <span>Featured Content</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyHighlightsState />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyHighlightsState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <Star className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          No highlights created yet
        </h3>
        <p className="text-gray-600 mb-6 text-sm">
          Create highlights to showcase your best content and attract more attention
        </p>
      </div>
    </div>
  );
}