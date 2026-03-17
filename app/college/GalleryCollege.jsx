import Image from "next/image";
import { useState } from "react";
import imgArray from "./imgArray";
import Modal from "./Modal";
import faqData from "./faqData";

const Gallery = ({ id }) => {
  const data = faqData.find((item) => item.id === id);

  const [findImg, setFindImg] = useState(null);
  const [activeModal, setActiveModal] = useState(false);

  const handleModal = (itemId) => {
    setActiveModal(!activeModal);
    const find = imgArray.find((e) => e.id === itemId);
    setFindImg(find);
  };

  return (
    <>
      <Modal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        findImg={findImg}
      />

      <section className="p__gallery wow fadeInUp" id="gallery">
        <div className="container">
          <hr className="divider" />
          <div className="p__gallery__area section__space">
            <div className="title__with__cta">
              <div className="row d-flex align-items-center">
                <div className="col-lg-8">
                  <h2>College Gallery</h2>
                </div>
                <div className="col-lg-4">
                  <div className="text-start text-lg-end"></div>
                </div>
              </div>
            </div>
            <div className="row p__gallery__single">
              {data && data.gallery ? (
                data.gallery.map((singleImg, i) => (
                  <div
                    key={singleImg.id}
                    className="col-md-6 col-lg-4 gallery__single__two"
                    onClick={() => handleModal(singleImg.id)}
                  >
                    <div>
                      <img
                        width={416}
                        height={242}
                        src={singleImg.img}
                        alt={singleImg.img}
                      />
                    </div>
                  </div>
                ))
              ) : (
                imgArray.map((singleImg, i) => (
                  <div
                    key={singleImg.id}
                    className="col-md-6 col-lg-4 gallery__single__two"
                    onClick={() => handleModal(singleImg.id)}
                  >
                    <div>
                     
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
