import Header from "@/components/Header";
import HeaderSlider from "@/components/HeaderSlider";
import FeaturedProducts from "@/components/FeaturedProducts";
import GamingSection from "@/components/GamingSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HomeProducts from "@/components/HomeProducts";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeaderSlider/>
        <HomeProducts/>
        <FeaturedProducts />
        <GamingSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
