import Hero from "./Sections/Hero";
import StyleStrip from "./Sections/StyleStrip";
import RecentWork from "./Sections/RecentWork";
import ArtistsPreview from "./Sections/ArtistsPreview";
import ProcessPreview from "./Sections/ProcessPreview";
import ReviewsPreview from "./Sections/ReviewsPreview";
import FinalCta from "./Sections/FinalCta";

// Ana sayfa: bölümleri sırayla dizer. Her bölüm Sections klasöründe.
const Landing = () => {
  return (
    <>
      <Hero />
      <StyleStrip />
      <RecentWork />
      <ArtistsPreview />
      <ProcessPreview />
      <ReviewsPreview />
      <FinalCta />
    </>
  );
};

export default Landing;