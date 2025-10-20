import { About, Contact, Footer, Header, Portfolio } from "@/components";

export default function Home() {
  return (
    <>
      <main>
        <Header />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}