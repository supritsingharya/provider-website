import Image from "next/image";
import Link from "next/link";


const Market = () => {
  return (
    <section className="market section__space over__hi">
      <div className="container">
        <div className="market__area">
          <div className="row d-flex align-items-center">
            <div className="col-lg-6 col-xl-5">
              <div className="market__thumb thumb__rtl column__space">
                <Image src={marketIllustration} alt="market illustration" />
              </div>
            </div>
            <div className="col-lg-6 col-xl-6 offset-xl-1">
              <div className="content">
                <h5 className="neutral-top">
                  A safe place in an unsafe world.
                </h5>
                <h2>You Select. Provider Does the Rest</h2>
                <p>
                  You can have more than one home. You can carry your roots with
                  you, and decide where they grow
                </p>
                <Link href="https://play.google.com/store/search?q=provider&c=apps" className="button button--effect">
                  Start Exploring
                </Link>
                <Image src={arrow} alt="Go To" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Market;
