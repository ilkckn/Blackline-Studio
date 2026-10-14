import { Link } from "react-router-dom";
import {
  MdArrowForward,
  MdExpandMore,
  MdOutlineAccessTime,
  MdOutlineCalendarMonth,
  MdOutlineCancel,
  MdOutlineCheckCircle,
  MdOutlineLock,
  MdOutlineStarOutline,
  MdOutlineVerified,
} from "react-icons/md";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import "./HowItWorks.css";

// 1) Yolculuk: dört adımın ayrıntılı anlatımı
const journey = [
  {
    number: "01",
    who: "You",
    title: "Create an account and choose your artist",
    intro: "An account lets you book, track and review in one place.",
    points: [
      "Sign up with your name, a username and your email. A phone number is optional.",
      "Open an artist's profile to see their bio, specialties, working days and hours.",
      "Look through their portfolio and reviews before you decide.",
    ],
  },
  {
    number: "02",
    who: "You",
    title: "Request a time slot",
    intro: "Pick a day and time that fits your artist's calendar.",
    points: [
      "Choose a date, a start time and an end time, then describe your idea.",
      "Days and hours outside the artist's working schedule are not available.",
      "A slot that is already booked can't be requested a second time.",
    ],
  },
  {
    number: "03",
    who: "Your artist",
    title: "Your artist confirms",
    intro: "Every request starts as pending until the artist responds.",
    points: [
      "Your artist looks at the request and either confirms it or cancels it.",
      "You can follow the status in your account at any time.",
      "Plans changed? You can cancel a pending or confirmed booking yourself.",
    ],
  },
  {
    number: "04",
    who: "You",
    title: "Get tattooed, then leave a review",
    intro: "After your session the artist marks the booking as completed.",
    points: [
      "Only completed bookings can be reviewed.",
      "Give a rating from 1 to 5 and write a few words about the experience.",
      "Each booking gets one review, shown publicly on the artist's page.",
    ],
  },
];

// 2) Randevu durumları (backend'deki gerçek durumlar)
const statuses = [
  {
    key: "pending",
    name: "Pending",
    text: "Your request was sent and is waiting for the artist to respond.",
    action: "You can cancel it.",
  },
  {
    key: "confirmed",
    name: "Confirmed",
    text: "The artist accepted your request. The slot is reserved for you.",
    action: "You can still cancel if plans change.",
  },
  {
    key: "completed",
    name: "Completed",
    text: "The session took place and the artist closed the booking.",
    action: "You can now write a review.",
  },
  {
    key: "cancelled",
    name: "Cancelled",
    text: "Cancelled by you or by the artist. The time slot is free again for others.",
    action: "You can request a new slot.",
  },
];

// 3) Bilmen gerekenler
const rules = [
  {
    icon: <MdOutlineAccessTime />,
    title: "Working hours apply",
    text: "A booking has to fall inside the artist's working days and hours, and it can't be in the past.",
  },
  {
    icon: <MdOutlineCalendarMonth />,
    title: "No double booking",
    text: "Two people can't hold the same time with one artist. Cancelled slots open up again.",
  },
  {
    icon: <MdOutlineCancel />,
    title: "Cancel anytime before the session",
    text: "You can cancel your own booking until it is marked as completed.",
  },
  {
    icon: <MdOutlineVerified />,
    title: "Reviews come from real sessions",
    text: "Only clients with a completed booking can review, so every review is genuine.",
  },
  {
    icon: <MdOutlineStarOutline />,
    title: "Simple ratings",
    text: "Ratings go from 1 to 5. Each artist's average is shown on their profile.",
  },
  {
    icon: <MdOutlineLock />,
    title: "Your details stay private",
    text: "Your contact details are visible only to you, your artist and the studio admins. Reviews show your name.",
  },
];

// 4) Sık sorulan sorular
const faqs = [
  {
    question: "Do I need an account to book?",
    answer:
      "Yes. A free account lets you request slots, follow their status, cancel if needed and review your artist after the session.",
  },
  {
    question: "Can I change the date or time of a booking?",
    answer:
      "Not directly. Cancel the booking and request a new slot with the date and time you prefer.",
  },
  {
    question: "What happens if my artist doesn't respond?",
    answer:
      "Your request stays pending until the artist confirms or cancels it. [ADD YOUR USUAL RESPONSE TIME]",
  },
  {
    question: "How much does a tattoo cost?",
    answer:
      "[ADD YOUR PRICING POLICY HERE] Describe your idea in the booking form so your artist can give you an accurate quote.",
  },
  {
    question: "Can I edit or delete my review?",
    answer:
      "Reviews can't be edited after sending. If something needs to be fixed, contact the studio and an admin can remove it.",
  },
  {
    question: "Why can't I review right away?",
    answer:
      "To keep reviews honest, you can only write one after your artist has marked the session as completed.",
  },
];

const HowItWorks = () => {
  return (
    <div className="how-page">
      {/* ---------- Sayfa girişi ---------- */}
      <section className="page-intro">
        <span className="glow glow-violet" aria-hidden="true" />
        <span className="glow glow-coral" aria-hidden="true" />

        <div className="container intro-content">
          <span className="label glabel">How it works</span>
          <h1 className="intro-title disp">
            From first idea
            <br />
            to <span className="gtext">healed skin</span>
          </h1>
          <p className="intro-text">
            Everything you need to know about booking with us: how the process
            works, what each booking status means and the simple rules that keep
            it fair for clients and artists.
          </p>
          <div className="intro-buttons">
            <Link to="/artists" className="btn btn-primary">
              <span>Browse artists</span>
              <MdArrowForward size={20} />
            </Link>
            <Link to="/booking" className="textlink">
              Book a session
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Yolculuk ---------- */}
      <section className="journey section">
        <div className="container">
          <SectionHeader
            eyebrow="The journey"
            title={
              <>
                Four steps,
                <br />
                explained
              </>
            }
            text="What you do, what your artist does and what to expect at every stage."
          />

          <ol className="journey-list">
            {journey.map((step) => (
              <li className="journey-step" key={step.number}>
                <span className="journey-number disp gtext" aria-hidden="true">
                  {step.number}
                </span>

                <div className="journey-body">
                  <span className="who label">{step.who}</span>
                  <h3 className="journey-title disp">{step.title}</h3>
                  <p className="journey-intro">{step.intro}</p>

                  <ul className="points">
                    {step.points.map((point) => (
                      <li className="point" key={point}>
                        <MdOutlineCheckCircle />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Randevu durumları ---------- */}
      <section className="statuses section">
        <div className="container">
          <SectionHeader
            eyebrow="Booking statuses"
            title={
              <>
                What each
                <br />
                status means
              </>
            }
            text="A booking moves forward step by step. Completed and cancelled are final, they can't change afterwards."
          />

          <div className="status-grid">
            {statuses.map((status) => (
              <article className={`status-card ${status.key}`} key={status.key}>
                <span className="badge label">{status.name}</span>
                <h3 className="status-title disp">{status.name}</h3>
                <p className="status-text">{status.text}</p>
                <p className="status-action">{status.action}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Bilmen gerekenler ---------- */}
      <section className="rules section">
        <div className="container">
          <SectionHeader
            eyebrow="Good to know"
            title={
              <>
                Simple rules,
                <br />
                fair for everyone
              </>
            }
          />

          <div className="rule-grid">
            {rules.map((rule) => (
              <div className="rule" key={rule.title}>
                <span className="rule-icon">{rule.icon}</span>
                <h3 className="rule-title">{rule.title}</h3>
                <p className="rule-text">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Sık sorulan sorular ---------- */}
      <section className="faq section">
        <div className="container">
          <SectionHeader
            eyebrow="FAQ"
            title={
              <>
                Questions
                <br />
                we hear a lot
              </>
            }
          />

          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <MdExpandMore className="faq-icon" />
                </summary>
                <p className="faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Kapanış ---------- */}
      <section className="closing section on-gradient">
        <div className="container">
          <div className="closing-card">
            <h2 className="closing-title disp">Ready when you are.</h2>
            <p className="closing-text">
              Pick the artist who fits your idea and send your first request.
            </p>
            <div className="closing-buttons">
              <Link to="/artists" className="btn btn-dark">
                <span>Browse artists</span>
                <MdArrowForward size={20} />
              </Link>
              <Link to="/booking" className="textlink closing-link">
                Book a session
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;