import { ScrollToTop } from '@/components/portfolio/ScrollToTop';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ScrollToTop />
    </>
  );
}
