
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductList from "@/components/ProductList";
import ProductForm from "@/components/ProductForm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  isLimitedTimeDeal: boolean;
  affiliateLink: string;
}

const Index = () => {
  const [products, setProducts] = useLocalStorage<Product[]>("amazon-deals", []);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>("amazon-deals-admin", false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const adminPassword = "admin123"; // Simple password for demo purposes

  const handleLogin = () => {
    if (password === adminPassword) {
      setIsAdmin(true);
      setError("");
      toast({
        title: "Admin Login Successful",
        description: "You now have access to admin features",
      });
    } else {
      setError("Incorrect password");
      toast({
        title: "Login Failed",
        description: "Incorrect password provided",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPassword("");
    toast({
      title: "Logged Out",
      description: "You have been logged out of admin mode",
    });
  };

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
    toast({
      title: "Product Added",
      description: "Your product has been added successfully",
    });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast({
      title: "Product Updated",
      description: "Your changes have been saved",
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been removed",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-500">
            Today's Best Amazon Deals
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Handpicked discounts and limited-time offers
          </p>
          
          {isAdmin ? (
            <div className="mt-4 text-right">
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout Admin
              </Button>
            </div>
          ) : (
            <div className="mt-6 max-w-xs mx-auto">
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin Password"
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin();
                      }
                    }}
                  />
                </div>
                <Button onClick={handleLogin}>Login</Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Add or edit Amazon deals</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm onSubmit={handleAddProduct} />
            </CardContent>
          </Card>
        )}

        <ProductList 
          products={products} 
          isAdmin={isAdmin} 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteProduct}
        />
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">
              <strong>Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. 
              The products displayed on this page are carefully selected deals that offer great value. 
              Prices and availability are subject to change.
            </p>
            <p>© {new Date().getFullYear()} Amazon Affiliate Deals | All prices are accurate at the time of publishing</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
