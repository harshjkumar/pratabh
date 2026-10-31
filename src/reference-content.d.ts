declare module 'virtual:pratap-content' {
  export type ReferenceProduct = {
    slug: string;
    title: string;
    description: string;
    note: string;
    image: string;
    imageAlt: string;
  };
  const content: {
    pages: Record<'home' | 'about' | 'infrastructure' | 'products' | 'product' | 'contact', string>;
    footer: string;
    css: string;
    products: ReferenceProduct[];
  };
  export default content;
}
