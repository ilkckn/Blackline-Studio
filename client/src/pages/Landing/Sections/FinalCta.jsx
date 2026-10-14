import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import "./FinalCta.css";

const FinalCta = () => {
  return (
    <section className="final-cta on-gradient">
      <div className="container content">
        <h2 className="title disp">
          Find your artist.
          <br />
          Book your session.
        </h2>

        <p className="text">
          Create a free account, choose an artist and send your request. It
          takes about two minutes.
        </p>

        <div className="buttons">
          <Link to="/register" className="btn btn-dark">
            <span>Create account</span>
            <MdArrowForward size={20} />
          </Link>
          <Link to="/artists" className="textlink browse-link">
            Browse artists first
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;