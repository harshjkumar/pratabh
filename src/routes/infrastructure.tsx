import { createFileRoute } from '@tanstack/react-router';
import { ReferenceSite, referenceHead } from '@/components/site/reference-site';

export const Route = createFileRoute('/infrastructure')({
  head: () => referenceHead('infrastructure'),
  component: () => <ReferenceSite page="infrastructure" />,
});
