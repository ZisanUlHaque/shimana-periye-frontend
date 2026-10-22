import HeroSection from '@/components/home/Hero';
import ApplicationCommandCenter from '@/components/sections/ApplicationCommandCenter';
import ComparisonSection from '@/components/sections/ComparisonSection';
//import ComparisonSection from '@/components/sections/ComparisonSection';
import CountriesSection from '@/components/sections/CountriesSection';
import LiveActivitySection from '@/components/sections/LiveActivitySection';
import MentorCardsSection from '@/components/sections/MentorCardsSection';
//import UniversityMarquee from '@/components/sections/UniversityMarquee';
import React from 'react';

const page = () => {
    return (
<>
<HeroSection></HeroSection>

<LiveActivitySection></LiveActivitySection>

<CountriesSection></CountriesSection>
<ComparisonSection></ComparisonSection>
<ApplicationCommandCenter></ApplicationCommandCenter>
<MentorCardsSection></MentorCardsSection>
</>
    );
};

export default page;