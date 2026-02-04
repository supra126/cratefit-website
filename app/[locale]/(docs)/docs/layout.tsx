import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Sidebar } from "@/components/docs/Sidebar";
import { getDocsNavigation } from "@/lib/docs";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const navigation = getDocsNavigation(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 py-8 pr-8 lg:block">
          <div className="sticky top-24">
            <Sidebar navigation={navigation} />
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
