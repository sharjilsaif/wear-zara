import HomePage from "@/pages/mainHomePage/home/home";
import FlashSale from "@/pages/mainHomePage/flashSale/flashSale";
import NewArrival from "@/pages/mainHomePage/newArrival/newArrival";
import Categories from "@/pages/mainHomePage/categories/categories";
import Description from "@/pages/mainHomePage/description/description";
import BestSelling from "@/pages/mainHomePage/bestSelling/bestSelling";
import ProductDetails from "@/pages/mainHomePage/productDetails/productDetails";
import ExploreProducts from "@/pages/mainHomePage/exploreProducts/exploreProducts";

export default function Home() {
  return (
    <>
      <section className="">
        <HomePage />
        <FlashSale />
        <Categories />
        <BestSelling />
        <ProductDetails />
        <ExploreProducts />
        <NewArrival />
        <Description />
      </section>
    </>
  );
}