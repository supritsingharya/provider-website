import Image from "next/image";
import Hero from "./components/Hero";
import CardSlider from "./components/CardSlider";
import Solutions from "./components/Solutions";
import SearchBarHero from "./components/SearchBarHero";
import AppPromotionSection from "./components/AppPromotionSection";
import AchievementsSection from "./components/AchievementsSection"
import TrustBadgesSection from "./components/TrustBadgesSection"
import ComparisonTableSection from "./components/ComparisonTableSection"
import StudentTestimonial from "./components/StudentTestimonial"
import GuidesAndResources from "./components/GuidesAndResources"
import FAQSection from "./components/FAQSection"
import MeetOurMentors from "./components/MeetOurMentors"
import JoinCommunity from "./components/JoinCommunity"
import NewsHeadlinesSection from "./components/NewsHeadlinesSection"
import Footer from "./components/Footer"
import Booking3DExplainer from "./components/Booking3DExplainer";
import PosterSection from "./components/PosterSection";

export default function Home() {
  return (
    <>
    <Hero/>
    <SearchBarHero/>
    <AppPromotionSection/>
    <CardSlider/>
    <AchievementsSection/>
    <Booking3DExplainer/>
    <PosterSection/>
    {/* <Solutions/> */}
    <StudentTestimonial/><TrustBadgesSection/>
    <ComparisonTableSection/>
    {/* <MeetOurMentors/> */}
    <FAQSection/>
    <GuidesAndResources/>
    <NewsHeadlinesSection/>
    <JoinCommunity/>
    <Footer/>
    </>
  );
}
