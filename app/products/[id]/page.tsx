import ProductDetail from "@/components/products/ProductDetail";
import { ssrGetProductById } from "@/services/products.server.service";
import { Product } from "@/services/products.service";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function ProductPage(props: Props) {
  const { id } = (await props.params) as { id: string };
  let product: Product | null = null;
  try {
    product = await ssrGetProductById(id);
  } catch (err) {
    console.error("Failed to fetch product:", err);
    // Show 404 if not found or error
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm mb-6 text-gray-500">
        <a href="/products" className="hover:underline">Products</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <ProductDetail product={product} />
    </main>
  );
}
