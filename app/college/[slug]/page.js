'use client'
import Gallery from "../GalleryCollege";
import Market from "../Market";
import AllProperties from "../AllColleges";
import Details from "../DetailsCollege";
import { useParams } from "next/navigation";
import Footer from "../../components/Footer";
// import AlertForm from "../../components/propertyAlert/AlertFormCollege";

const PropertyDetails = () => {
    const params = useParams();
    const slug = params.slug;

    return (
        <>
            {/* Details start here */}
            <Details slug={slug} />

            {/* Gallery start here */}

            {/* All Properties start here */}
            <AllProperties slug={slug} />

            {/* Alert Form for College */}
            <Footer />
        </>
    );
};

export default PropertyDetails;