export default function LoadingAnimation() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            {/* Spinning globe */}
            <div className="w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-blue-500 animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-purple-500 border-l-yellow-500 animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🌍</span>
              </div>
            </div>
            
            {/* Loading text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Exploring Algerian Wonders
              </h2>
              <p className="text-gray-600">
                Loading quiz questions...
              </p>
              
              {/* Dots animation */}
              <div className="flex justify-center space-x-2 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        <style jsx>{`
          @keyframes spin-reverse {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
          .animate-spin-reverse {
            animation: spin-reverse 2s linear infinite;
          }
        `}</style>
      </div>
    );
  }