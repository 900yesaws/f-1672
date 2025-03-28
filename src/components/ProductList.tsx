
import { useState } from "react";
import { Product } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/ProductForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";

interface ProductListProps {
  products: Product[];
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductList = ({ products, isAdmin, onEdit, onDelete }: ProductListProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    onEdit(updatedProduct);
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-500">No deals available yet</h2>
        <p className="text-gray-400">Check back soon for amazing Amazon deals!</p>
      </div>
    );
  }

  return (
    <div>
      {editingProduct && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm 
                product={editingProduct} 
                onSubmit={handleSaveEdit} 
                onCancel={handleCancelEdit} 
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              {product.isLimitedTimeDeal && (
                <Badge variant="default" className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-500">
                  LIMITED TIME DEAL
                </Badge>
              )}
              <Badge variant="destructive" className="absolute top-2 right-2">
                -{product.discount}%
              </Badge>
              <div className="h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2 h-14">{product.title}</CardTitle>
              <CardDescription className="line-clamp-2 h-10">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600"
                onClick={() => {
                  if (product.affiliateLink) {
                    window.open(product.affiliateLink, '_blank');
                  }
                }}
              >
                Buy on Amazon
              </Button>
              
              {isAdmin && (
                <div className="flex gap-2 ml-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
