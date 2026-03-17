import Image from "next/image";


const SingleFaq = ({ i, item }) => {
  return (
    <div className="accordion-item content__space">
      <h5 className="accordion-header" id={`headingFundOne${i}`}>
        <span className="icon_box">
          <Image src={message} alt="message" />
        </span>
        <button
          className={`accordion-button ${i === 0 ? "" : "collapsed"}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapseFundOne${i}`}
          aria-expanded="true"
          aria-controls={`collapseFundOne${i}`}
        >
          {item.title}
        </button>
      </h5>
      <div
        id={`collapseFundOne${i}`}
        className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
        aria-labelledby={`headingFundOne${i}`}
        data-bs-parent="#accordionExampleFund"
      >
        <div className="accordion-body">
          <p>{item.details}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleFaq;
