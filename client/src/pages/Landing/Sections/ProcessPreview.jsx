import { Link } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import "./ProcessPreview.css";

const steps = [
  {
    number: "01",
    title: "Choose an artist",
    text: "Browse portfolios and reviews until you find the style that fits your idea.",
  },
  {
    number: "02",
    title: "Pick your slot",
    text: "Choose a day and time inside the artist's working hours. A slot that is already taken can't be booked twice.",
  },
  {
    number: "03",
    title: "Get confirmed",
    text: "Your artist confirms the request. Follow its status in your account, or cancel if plans change.",
  },
  {
    number: "04",
    title: "Get inked, then review",
    text: "Once the session is marked completed, you can rate your artist and tell others how it went.",
  },
];

// Ana sayfadaki kısa özet. Ayrıntılı anlatım /how-it-works sayfasında.
const ProcessPreview = () => {
  return (
    <section className="process-preview section">
      <span className="glow" aria-hidden="true" />

      <div className="container content">
        <SectionHeader
          eyebrow="How it works"
          title={
            <>
              From idea to
              <br />
              healed skin
            </>
          }
          text="Four simple steps from your first idea to your review."
        >
          <Link to="/how-it-works" className="textlink">
            See the full guide
          </Link>
        </SectionHeader>

        <ol className="steps">
          {steps.map((step) => (
            <li className="step" key={step.number}>
              <span className="step-line gline" />
              <span className="number disp gtext" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="step-title disp">{step.title}</h3>
              <p className="step-text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProcessPreview;