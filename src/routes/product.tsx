import { createFileRoute } from '@tanstack/react-router';
import { ReferenceSite, referenceHead, content } from '@/components/site/reference-site';

export const Route = createFileRoute('/product')({
  validateSearch: (search: Record<string, unknown>) => ({
    type: content.products.some(p => p.slug === search.type) ? String(search.type) : 'block-bottom-bags',
  }),
  loaderDeps: ({ search }) => ({ type: search.type }),
  loader: ({ deps }) => content.products.find(p => p.slug === deps.type)!,
  head: ({ loaderData }) => referenceHead('product', loaderData),
  component: Product,
});

function Product() {
  const product = Route.useLoaderData();
  return <ReferenceSite page="product" product={product} />;
}
