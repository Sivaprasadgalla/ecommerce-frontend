import ProductGrid from "@/components/products/ProductGrid";
import { ssrGetProducts } from "@/services/products.server.service";


export default async function ProductsPage() {
  const products = await ssrGetProducts(); // ⬅ Server-side call to your API

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <ProductGrid products={products} />
    </main>
  );
}
