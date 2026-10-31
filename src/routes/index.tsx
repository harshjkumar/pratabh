import { createFileRoute } from '@tanstack/react-router';
import { ReferenceSite, referenceHead } from '@/components/site/reference-site';

export const Route = createFileRoute('/')({
  head: () => referenceHead('home'),
  component: () => <ReferenceSite page="home" />,
});
