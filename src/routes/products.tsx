import { createFileRoute } from '@tanstack/react-router';
import { ReferenceSite, referenceHead } from '@/components/site/reference-site';

export const Route = createFileRoute('/products')({
  head: () => referenceHead('products'),
  component: () => <ReferenceSite page="products" />,
});
