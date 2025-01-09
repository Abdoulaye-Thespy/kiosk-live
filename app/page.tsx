import { AuthTabs } from "@/components/auth-tabs";
import { Store } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="grid w-full max-w-5xl lg:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className="relative hidden lg:block"
          style={{
            backgroundImage: "url('/total.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[90%] max-w-[500px] bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Gestion de vos kiosque
              </h2>
              <p className="text-sm text-gray-600">
                Simplifiez la gestion de vos kiosques et optimisez vos opérations au quotidien. 
                Accédez aux statistiques pour maximiser vos résultats
              </p>
              <div className="flex justify-center mt-6">
                <div className="flex gap-1">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i === 0 ? "bg-[#ff6b4a]" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <AuthTabs />
        </div>
      </div>
    </div>
  );
}