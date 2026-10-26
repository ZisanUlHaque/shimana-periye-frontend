import HeroSection from "@/components/home/Hero";
import ApplicationCommandCenter from "@/components/sections/ApplicationCommandCenter";
import ComparisonSection from "@/components/sections/comparison/comparison-section";
import CountriesSection from "@/components/sections/CountriesSection";
import LiveActivitySection from "@/components/sections/LiveActivitySection";
import MentorCardsSection from "@/components/sections/MentorCardsSection";
import { Roadmap, studyAbroadMilestones } from "@/components/sections/roadmap";

const page = () => {
  return (
    <>
      <HeroSection></HeroSection>

      <LiveActivitySection></LiveActivitySection>

      <CountriesSection></CountriesSection>
      <ComparisonSection></ComparisonSection>
      <Roadmap milestones={studyAbroadMilestones} />
      <ApplicationCommandCenter></ApplicationCommandCenter>
      <MentorCardsSection></MentorCardsSection>
    </>
  );
};

export default page;
