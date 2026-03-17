import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";
import {FaClock, FaImages, FaMapMarkerAlt} from "react-icons/fa";
import faqdata from "../../data/faqs";
import KeyUpdatesCard from "../cards/KeyUpdatesCard";
import ReportsCard from "../cards/ReportsCard";
import TermSingleCard from "../cards/TermSingleCard";
import CountdownDisplay from "../common/CountdownDisplay";
import SingleFaq from "../common/SingleFaq";
import Social from "../social/Social";
import Funding from "./Funding";
import InvestForm from "./InvestForm";
import { FaAngleRight } from "react-icons/fa";
import check from "/public/images/check.png";
import charge from "/public/images/icons/charge.png";
import investor from "/public/images/icons/investor.png";
import loan from "/public/images/icons/loan.png";
import project from "/public/images/icons/project.png";
import reinvest from "/public/images/icons/reinvest.png";
import owner from "/public/images/owner.png";
import {useState} from 'react';
import Popup from "./VideoPopup";


const convertTextToParagraphs = (text) => {
    return text
      .split('\n')
      .filter(paragraph => paragraph.trim() !== '') // Filter out any empty paragraphs
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  };
  

const Details = ({singleData}) => {
    console.log(singleData);
    const [isPopupOpen,
        setIsPopupOpen] = useState(false);

    const [map_view,
        setMap_view] = useState('');

    const openPopup = () => {
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    }
    const scrollToGallery = () => {
        const gallerySection = document.getElementById("gallery");

        if (gallerySection) {
            gallerySection.scrollIntoView({behavior: "smooth"});
        }
    };
    console.log(singleData);

    const DescriptionDisplay = ({ description }) => {
        // Convert the description text to HTML with <p> tags
        const paragraphsHtml = convertTextToParagraphs(description);
      
        return (
            <div
              style={{
                padding: '10px',
              }}
              dangerouslySetInnerHTML={{ __html: paragraphsHtml }}
            />
        );
      };

    if (!singleData) {
        // If parsedData or attributes is undefined, you can render a loading state or
        // return null
        return <div>Loading...</div>;
    }
    let map;
    if (singleData.latlng._degLat) {
        map = `https://www.google.com/maps/search/?api=1&query=${singleData.latlng._degLat},${singleData.latlng._degLon}`

    } else {
        map = `https://www.google.com/maps/search/?api=1&query=${singleData.latlng._latitude},${singleData.latlng._longitude}`

    }


        const description = `This is a sample description text.
      It includes multiple lines,
      spaces, and other formatting.
      
      Indented lines are also preserved, and
      very long text strings should wrap properly
      without breaking formatting.`;

    return ( <> <div
        className="property__details__banner property__details__bg bg__img clear__top"
        style={{
        backgroundImage: `url(${singleData.main_image.data.attributes.url})`
    }}></div> < Popup isOpen = {
        isPopupOpen
    }
    onClose = {
        closePopup
    } /> < section className = "p__details faq section__space__bottom" > <div className="container">
        <div className="p__details__area">
            <div className="row">
                <div className="">
                    <div className="p__details__content">
                        <a
                            onClick={scrollToGallery}
                            className="button button--effect button--secondary">
                            <FaImages/>
                            Browse Gallery
                        </a>
                        <div className="intro">
                            <h3>{singleData?.name}</h3>
                            <p className="d-flex align-items-center gap-1">
                                <FaMapMarkerAlt/> {singleData?.address}
                            </p>
                        </div>
                        <div className="group__one">
                            <h4>Description</h4>
                            <DescriptionDisplay description={singleData?.description} />
                            </div>
                        
                        <div className="group__two">
                            <h5>Amenities Provided:</h5>

                            {singleData?.facilities && singleData?.facilities.data && singleData?.facilities.data.length > 0 && (
                                <ul>
                                    {singleData?.facilities
                                        .data
                                        .map((item, i) => (
                                            <li key={i}>
                                                {item.attributes.image && item.attributes.image.data && (<Image
                                                    src={item.attributes.image.data.attributes.url}
                                                    width={24}
                                                    height={24}
                                                    alt="Check"/>)}
                                                {" "}
                                                {item.attributes.value}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                        {/* <div className="terms">
                            <h5>Financial terms of the investment:</h5>
                            <div className="terms__wrapper">
                                <TermSingleCard img={loan} p="Maximum loan term" heading="36 Months"/>
                                <TermSingleCard img={charge} p="Security" heading="1st charge Mortgage"/>
                                <TermSingleCard img={project} p="Annual Return" heading="7%"/>
                            </div>
                        </div> */}

<img
          src="https://archive.org/download/placeholder-image/placeholder-image.jpg"
          alt="Placeholder"
          style={{borderRadius:'15px',border:'2px solid grey',height:'300px',width:'300px',marginTop:'20px'}}
          onClick={openPopup}
        />


                        {/* <div className="group__two">
                            <h5>When investing:</h5>
                            <ul>
                                <li>
                                    <Image src={check} alt="Check"/>
                                    Up to 4999 € - the annual return is 7%.
                                </li>
                                <li>
                                    <Image src={check} alt="Check"/>
                                    5000 € – 14999 € - the annual return is 7.1%.
                                </li>
                                <li>
                                    <Image src={check} alt="Check"/>
                                    15000 € – 29999 € - the annual return is 7.2%.
                                </li>
                                <li>
                                    <Image src={check} alt="Check"/>
                                    30000 € – 49999 € - the annual return is 7.35%.
                                </li>
                                <li>
                                    <Image src={check} alt="Check"/>
                                    50000 € and more - the annual return is 7.5%.
                                </li>
                            </ul>
                        </div> */}
                        <div className="terms">
                            {/* <h5>The capital growth distribution:</h5>
                            <div className="terms__wrapper">
                                <TermSingleCard img={investor} p="Investors" heading="40% - 60%"/>
                                <TermSingleCard img={project} p="Project" heading="40%"/>
                                <TermSingleCard img={reinvest} p="Revest" heading="Up to 20%"/>
                            </div> */}
                        </div>
                        
                        <div className="faq__group">
                            <h5 className="atr">Frequently asked questions</h5>
                            <div className="accordion" id="accordionExampleFund">
                                {faqdata.map((item, i) => (<SingleFaq key={item.id} i={i} item={item}/>))}
                            </div>
                        </div>
                        <div className="group__one">
                            {/* <h4>Key investment risks:</h4>
                            <p>
                                Risk of falling prices: The price of the property might fall due to the increase
                                in supply or decrease in demand in the area or other economic factors.Liquidity
                                risk: The borrower might be unable to find a buyer in order to sell the
                                property.Tenant risk: There is a risk that the asset can lose a tenant and it
                                can take time to find replacements, which can have impact on the property&#39;s
                                cash-flow.
                            </p> */}
                            <div className="map__wrapper">
                                    <iframe
                                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224407.57700113094!2d77.35118129343715!3d28.498562158226942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cea64b8f89aef%3A0xec0ccabb5317962e!2sGreater%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1699432744081!5m2!1sen!2sin'
                                        width="746"
                                        height="312"
                                        loading="lazy"></iframe>
                            </div>
                            <a  href={map} target="_blank" rel="noopener noreferrer" style={{marginTop:'10px',width:'20%',marginRight:'40%', marginLeft:'35%'}} className="button button--effect">
          Go <FaAngleRight/>
        </a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div> </section>
    <section className="p__gallery wow fadeInUp" id="gallery">
        <div className="container">
          <hr className="divider" / > <div className="p__gallery__area section__space">
        <div className="title__with__cta">
            <div className="row d-flex align-items-center">
                <div className="col-lg-8">
                    <h2>Property Gallery</h2>
                </div>
                <div className="col-lg-4">
                    <div className="text-start text-lg-end"></div>
                </div>
            </div>
        </div>
        <div className="row p__gallery__single">
            {singleData?.images
                .data
                .map((singleImg, i) => (
                    <div key={singleImg.id} className="col-md-6 col-lg-4 gallery__single__two">
                        <div>
                            <Image
                                src={singleImg.attributes.url}
                                height={242}
                                width={416}
                                alt='property image'/>
                        </div>
                    </div>
                ))}
        </div>
    </div> </div>
      </section > </>);
};

export default Details;
