
import { useState, useEffect } from "react";
import { Product } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().positive("Original price must be positive"),
  discount: z.coerce.number().min(0).max(100, "Discount must be between 0 and 100"),
  image: z.string().url("Must be a valid URL"),
  isLimitedTimeDeal: z.boolean().default(false),
  affiliateLink: z.string().url("Must be a valid Amazon affiliate URL").or(z.string().length(0)),
});

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel?: () => void;
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const isEditing = !!product;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          title: product.title,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          image: product.image,
          isLimitedTimeDeal: product.isLimitedTimeDeal,
          affiliateLink: product.affiliateLink || "",
        }
      : {
          title: "",
          description: "",
          price: 0,
          originalPrice: 0,
          discount: 0,
          image: "",
          isLimitedTimeDeal: false,
          affiliateLink: "",
        },
  });

  // Automatically calculate discount when price or original price changes
  useEffect(() => {
    const subscription = form.watch((formValues, { name }) => {
      if (
        (name === "price" || name === "originalPrice") &&
        formValues.price &&
        formValues.originalPrice &&
        formValues.originalPrice > formValues.price
      ) {
        const discount = Math.round(
          ((formValues.originalPrice - formValues.price) / formValues.originalPrice) * 100
        );
        form.setValue("discount", discount);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      id: product?.id || crypto.randomUUID(),
      title: data.title,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      discount: data.discount,
      image: data.image,
      isLimitedTimeDeal: data.isLimitedTimeDeal,
      affiliateLink: data.affiliateLink || "",
    });
    
    if (!isEditing) {
      form.reset({
        title: "",
        description: "",
        price: 0,
        originalPrice: 0,
        discount: 0,
        image: "",
        isLimitedTimeDeal: false,
        affiliateLink: "",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amazon Affiliate Link</FormLabel>
              <FormControl>
                <Input placeholder="https://www.amazon.com/dp/XXXXX?tag=your-tag" {...field} />
              </FormControl>
              <FormDescription>Enter your Amazon affiliate link for this product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="100" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isLimitedTimeDeal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Limited Time Deal</FormLabel>
                <FormDescription>
                  Mark this as a special limited time offer
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
