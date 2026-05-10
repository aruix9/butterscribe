import Footer from "@/components/layout/cms/Footer";
import Header from "@/components/layout/cms/Header";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
