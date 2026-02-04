import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Trash2, Percent, Clock, Zap } from "lucide-react";

export default function DealsCard({ deals, onDelete }) {
  const calculateDiscount = (original, discounted) => {
    const discount = ((original - discounted) / original) * 100;
    return Math.round(discount);
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Tag className="h-5 w-5 text-emerald-600" />
              </div>
              Active Deals
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Special offers and discounts to attract customers
            </CardDescription>
          </div>
          <div className="px-3 py-1 bg-white border border-emerald-200 rounded-full text-sm font-medium text-emerald-700">
            {deals.filter(d => d.status === 'active').length} Active
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const discount = calculateDiscount(deal.original_price, deal.discounted_price);
              const isActive = deal.status === 'active';
              
              return (
                <div
                  key={deal.id}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Status Badge */}
                  <div className={`px-3 py-1 text-xs font-medium ${isActive ? 'bg-emerald-600' : 'bg-gray-400'} text-white w-fit`}>
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                  
                  {/* Image */}
                  {deal.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/deals/${deal.image}`}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{discount}%
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                        {deal.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete("deals", deal.id, deal.title)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {deal.description || "No description provided"}
                    </p>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-emerald-700">
                          ${deal.discounted_price}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${deal.original_price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600 font-medium">
                        <Percent className="h-4 w-4" />
                        <span>Save ${deal.original_price - deal.discounted_price}</span>
                      </div>
                    </div>
                    
                    {/* Additional Info */}
                    {deal.valid_until && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <Clock className="h-4 w-4" />
                        <span>Valid until {new Date(deal.valid_until).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {deal.remaining_spots > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Zap className="h-4 w-4" />
                        <span>{deal.remaining_spots} spots left</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyDealsState />
        )}
      </CardContent>
    </Card>
  );
}

function EmptyDealsState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
          <Tag className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          No deals created yet
        </h3>
        <p className="text-gray-600 mb-6 text-sm">
          Create special offers to attract more customers and increase bookings
        </p>
      </div>
    </div>
  );
}