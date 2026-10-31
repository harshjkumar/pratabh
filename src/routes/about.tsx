import { createFileRoute } from '@tanstack/react-router';
import { ReferenceSite, referenceHead } from '@/components/site/reference-site';

export const Route = createFileRoute('/about')({
  head: () => referenceHead('about'),
  component: () => <ReferenceSite page="about" />,
});
