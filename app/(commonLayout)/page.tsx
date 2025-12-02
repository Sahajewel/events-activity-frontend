import { CallToAction } from "@/components/home/CallToActions";
import { Categories } from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <HowItWorks></HowItWorks>
      <Categories></Categories>
      <Testimonials></Testimonials>
      <Stats></Stats>
      <CallToAction></CallToAction>
      <Footer></Footer>
    </div>
  );
}
