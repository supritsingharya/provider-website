import Image from "next/image";
import { useEffect, useState } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle, BsXLg } from "react-icons/bs";
import imgArray from "./imgArray";

const Modal = ({ activeModal, setActiveModal, findImg }) => {
  const [indexCount, setIndexCount] = useState(0);
  const [modalItem, setModalItem] = useState();

  const handleNext = () => {
    if (indexCount >= imgArray.length - 1) {
      setIndexCount(0);
    } else {
      setIndexCount((prev) => prev + 1);
    }
    const findItem = imgArray[indexCount];
    setModalItem(findItem);
  };

  const handlePrev = () => {
    if (indexCount <= 0) {
      setIndexCount(imgArray.length - 1);
    } else {
      setIndexCount((prev) => prev - 1);
    }
    const findItem = imgArray[indexCount];
    setModalItem(findItem);
  };

  useEffect(() => {
    setModalItem(findImg);
  }, [findImg]);

  return (
    <div
      className={`w-100 h-100 position-fixed top-0 position-relative ${
        activeModal ? "d-block" : "d-none"
      }`}
      style={{ zIndex: "100", backgroundColor: "rgba(0,0,0,.90)" }}
    >
      <div
        className="text-end m-5"
        onClick={() => setActiveModal(!activeModal)}
      >
        <button type="button" className="bg-transparent text-white">
          <BsXLg className="fs-3" />
        </button>
      </div>

      <div className="w-75 bg-transparent position-absolute top-50 start-50 translate-middle p-5">
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="button button--effect"
            onClick={() => handlePrev()}
          >
            <BsArrowLeftCircle className="fs-5" />
          </button>
          <div className="w-50 text-center m-auto">
            {modalItem ? (
              <Image src={modalItem?.img} alt={modalItem?.id} />
            ) : (
              <h3>loading</h3>
            )}
          </div>
          <button
            type="button"
            className="button button--effect"
            onClick={() => handleNext()}
          >
            <BsArrowRightCircle className="fs-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
