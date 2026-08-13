import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";
import "./Hero.css";

function Hero(){

    return(
        <section className="hero">

            <div className="hero-container">

                <HeroContent/>

                <HeroPreview/>

            </div>

        </section>
    );
}

export default Hero;