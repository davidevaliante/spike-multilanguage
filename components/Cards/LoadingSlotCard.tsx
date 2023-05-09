import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FunctionComponent } from "react";
import { ApolloSlotCard } from "../../data/models/Slot";
import { injectCDN } from "../../utils/Utils";
import FadeBorderButton from "../Buttons/FadeBorderButton";
import snakeCase from "lodash/snakeCase";
import Router from "next/router";
import { countryContext } from "../../context/CountryContext";
import LazyLoad from "react-lazyload";
import LazyImage from "../Lazy/LazyImage";
import AquaClient from "./../../graphql/aquaClient";
import { SLOT_BY_NAME } from "../../graphql/queries/slots";
import { LocaleContext } from "../../context/LocaleContext";

interface Props {
  slotName: string;
}

const LoadingSlotCard: FunctionComponent<Props> = ({ slotName }) => {
  const { t, contextCountry, setContextCountry, userCountry, setUserCountry } =
    useContext(LocaleContext);

  const [slotCardData, setSlotCardData] = useState<ApolloSlotCard | undefined>(
    undefined,
  );

  const aquaClient = new AquaClient();

  useEffect(() => {
    getSlotData();
  }, []);

  const getSlotData = async () => {
    const slotResponse = await aquaClient.query({
      query: SLOT_BY_NAME,
      variables: {
        name: slotName,
      },
    });

    slotResponse.data.data.slots.length > 0 &&
      setSlotCardData(slotResponse.data.data.slots[0]);
  };

  const goToSlotPage = () => {
    slotCardData && Router.push(`/slot/${slotCardData.slug}/${contextCountry}`);
  };

  const injectCdnOrFallback = (): string => {
    if (!slotCardData || slotCardData.image === null) {
      return "https://spikeapi.eu/icons/app_icon.svg";
    }
    return injectCDN(slotCardData.image.url, "thumbnail_");
  };

  return (
    <div>
      {slotCardData && (
        <CardStyleProvider>
          <CardContainer onClick={() => goToSlotPage()}>
            <LazyImage
              className="image-border swiper-lazy"
              fromTop={100}
              width={250}
              height={140}
              alt={`${snakeCase(slotCardData.name)}_image`}
              src={injectCdnOrFallback()}
            />

            <div className="card-content">
              <h3>{slotCardData.name.toUpperCase()}</h3>
              <div style={{ position: "absolute", bottom: "0", width: "100%" }}>
                <FadeBorderButton
                  href={`/slot/[slug]/[countryCode]`}
                  as={`/slot/${slotCardData.slug}/${contextCountry}`}
                />
                <LazyLoad offset={100}>
                  <StarContainer>
                    {[...Array(slotCardData.rating).keys()].map((s, i) => (
                      <img
                        key={`${snakeCase(slotName)}_${i}_start_full`}
                        alt="full_star_icon"
                        className="star"
                        src="/icons/star_full.svg"
                      />
                    ))}
                    {[...Array(5 - slotCardData.rating).keys()].map((s, i) => (
                      <img
                        key={`${snakeCase(slotName)}_${i}_start_empty`}
                        alt="empty_star_icon"
                        className="star"
                        src="/icons/star_empty.svg"
                      />
                    ))}
                  </StarContainer>
                </LazyLoad>
              </div>
            </div>
          </CardContainer>
        </CardStyleProvider>
      )}
    </div>
  );
};

const CardStyleProvider = styled.div`
    user-select: none;
    position : relative;
    display:flex;
    justify-content:center;     

    .card-content{
        display : flex;
        flex-direction : column;
    }
`;

const CardContainer = styled.div`
    cursor : pointer;
    width : 250px;
    height : 330px;
    background : white;
    position : relative;
    border : 1px solid grey;
    box-shadow: 10px 10px 10px -8px rgba(0,0,0,0.75);
    .image-border{
        border-top-left-radius : 4px;
        border-top-right-radius : 4px;
    }

    img {
       
        width : 250px;
        height:140px;
    }

   

    h3{
        font-size : 1rem !important;
        font-family : ${(props) => props.theme.text.secondaryFont};
        color : ${(props) => props.theme.text.color};
        padding : .7rem;
        vertical-align : center;
    }

    border-radius : 4px;
    border-bottom-left-radius : 36px;
`;
const StarContainer = styled.div`
    display : flex;
    justify-content : center !important;
    padding-bottom : 2rem;
    width: 100%;

    .star {
        width : 16px !important;
        height :16px !important;
        margin : 0 !important;
    }
`;

export default LoadingSlotCard;
