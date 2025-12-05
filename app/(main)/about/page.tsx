import About from "@/components/about/About";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function page() {
  return (
    <div>
      <Navbar></Navbar>
      <About></About>
      <Footer></Footer>
    </div>
  );
}
