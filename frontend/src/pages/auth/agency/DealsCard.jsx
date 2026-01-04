import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Tag, Trash2 } from "lucide-react";
  
  export default function DealsCard({ deals, onDelete }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Active Deals
          </CardTitle>
          <CardDescription>Special offers and discounts</CardDescription>
        </CardHeader>
  
        <CardContent>
          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.map((deal) => (
                <Card key={deal.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-bold text-lg">{deal.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onDelete("deals", deal.id, deal.title)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                      </Button>
                    </div>
  
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {deal.description}
                    </p>
  
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="line-through">
                        ${deal.original_price}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${deal.discounted_price}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No deals created yet
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
  