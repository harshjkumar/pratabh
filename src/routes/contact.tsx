import { createFileRoute } from '@tanstack/react-router';
import { ReferenceSite, referenceHead } from '@/components/site/reference-site';

export const Route = createFileRoute('/contact')({
  head: () => referenceHead('contact'),
  component: () => <ReferenceSite page="contact" />,
});
