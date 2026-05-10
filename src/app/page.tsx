import Footer from "@/components/layout/cms/Footer";
import Header from "@/components/layout/cms/Header";

export default function Home() {
  return (
    <>
    <Header />
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        Editor Home Page
      </h1>
    </div>
    <Footer />
    </>
  );
}
