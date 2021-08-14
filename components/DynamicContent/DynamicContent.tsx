import React from "react";
import { ApolloSlotCard } from "../../data/models/Slot";
import { Bonus } from "../../graphql/schema";
import { FunctionComponent } from "react";
import ArticleToMarkdown from "../Markdown/ArticleToMarkdown";
import { injectCDN } from "../../utils/Utils";
import BonusStripe from "../Cards/BonusStripe";
import PrimaryBonusCard from "../Cards/PrimaryBonusCard";
import { appTheme } from "../../theme/theme";
import styled from "styled-components";
import SlotCardComponent from "./../Cards/SlotCardComponent";
import { useState } from "react";
import { useEffect } from "react";

export interface DynamicArticle {
  type: "article";
  article: string;
}

export interface DynamicBonusList {
  type: "bonusList";
  direction: "vertical" | "horizontal";
  bonus: { bonus: Bonus }[];
  tableLabel?: string;
  collapsable?: boolean;
}

export interface DynamicSlotList {
  type: "slotList";
  slot: { slot: ApolloSlotCard }[];
}

export interface DynamicVideo {
  type: "video";
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface DynamicContentProps {
  content: (
    | DynamicArticle
    | DynamicBonusList
    | DynamicSlotList
    | DynamicVideo
  )[];
  isBakeca?: boolean;
}

const DynamicContent: FunctionComponent<DynamicContentProps> = ({
  content,
  isBakeca,
}) => {
  const contentToBlocks = () => {
    return content?.map((dynamicContent, index) => {
      if (dynamicContent.type === "article")
        return articleBlockRenderer(`dynamic_${index}`, dynamicContent.article);
      if (dynamicContent.type === "bonusList")
        return bonusListRenderer(dynamicContent);
      if (dynamicContent.type === "video")
        return videoRenderer(`dynamic_${index}`, dynamicContent.videoUrl);
      if (dynamicContent.type === "slotList")
        return slotListRenderer(`dynamic_${index}`, dynamicContent.slot);
    });
  };

  const articleBlockRenderer = (key: string, article: string) => (
    <ArticleToMarkdown
      key={key}
      content={injectCDN(article)}
      isBakeca={isBakeca}
    />
  );

  // const bonusListRenderer: FunctionComponent<DynamicBonusList> = (key: string, bonusList: { bonus: Bonus }[], direction: 'vertical' | 'horizontal', tableLabel: string | undefined) => {

  const bonusListRenderer: FunctionComponent<DynamicBonusList> = ({
    bonus,
    direction,
    tableLabel,
    collapsable,
  }) => {
    const remapBonusLink = () =>
      bonus.map((b) => {
        if (b.bonus.name === "LeoVegas")
          b.bonus.link =
            "https://ads.leovegas.com/redirect.aspx?pid=3704891&bid=1496";
        if (b.bonus.name === "BetFlag")
          b.bonus.link =
            "https://adv.betflag.com/redirect.aspx?pid=5268&bid=2680";
        if (b.bonus.name === "888 Casino")
          b.bonus.link = "https://ic.aff-handler.com/c/43431?sr=1868494";
        if (b.bonus.name === "PokerStars Casino")
          b.bonus.link =
            "https://secure.starsaffiliateclub.com/C.ashx?btag=a_182820b_4095c_&affid=100976968&siteid=182820&adid=4095&c=";
        if (b.bonus.name === "Starcasinò")
          b.bonus.link =
            "http://record.affiliatelounge.com/_SEA3QA6bJTMP_fzV1idzxmNd7ZgqdRLk/132/";
        if (b.bonus.name === "GoldBet")
          b.bonus.link =
            "https://media.goldbetpartners.it/redirect.aspx?pid=4641&bid=1495";
        if (b.bonus.name === "Starvegas")
          b.bonus.link =
            "https://www.starvegas.it/gmg/refer/60a2b6ffcb4f5e0001afa975";
        if (b.bonus.name === "Eurobet")
          b.bonus.link =
            "https://record.betpartners.it/_E_C7XwxgprAZV93hC2dJ_GNd7ZgqdRLk/110/";
        if (b.bonus.name === "Gioco Digitale")
          b.bonus.link =
            "https://mediaserver.entainpartners.com/renderBanner.do?zoneId=2022788";
        return b;
      });

    const [collapsed, setCollapsed] = useState(collapsable === true);
    useEffect(() => {
      console.log(collapsed, "collapsed");
    }, [collapsed]);

    if (!collapsed && direction === "vertical")
      return (
        <div key={bonus[0].bonus.id} style={{ margin: "0rem 0rem" }}>
          {tableLabel && (
            <ComparisonContainer>
              <p>{tableLabel}</p>
            </ComparisonContainer>
          )}
          {isBakeca
            ? remapBonusLink().map((b) => (
                <BonusStripe key={b.bonus.name} bonus={b.bonus} />
              ))
            : bonus.map((b) => (
                <BonusStripe key={b.bonus.name} bonus={b.bonus} />
              ))}
          {collapsable && (
            <LoadMoreButtonStyle onClick={() => setCollapsed(!collapsed)}>
              Nascondi
            </LoadMoreButtonStyle>
          )}
        </div>
      );

    if (!collapsed && direction === "horizontal")
      return (
        <div key={bonus[0].bonus.id} style={{ margin: "3rem 0rem" }}>
          {tableLabel && (
            <HorizontalTableHeader> {tableLabel}</HorizontalTableHeader>
          )}

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {isBakeca
              ? remapBonusLink().map((b) => (
                  <PrimaryBonusCard
                    withSuggestion={false}
                    key={b.bonus.name}
                    bonus={b.bonus}
                  />
                ))
              : bonus.map((b) => (
                  <PrimaryBonusCard
                    withSuggestion={false}
                    key={b.bonus.name}
                    bonus={b.bonus}
                  />
                ))}
          </div>

          {collapsable && (
            <LoadMoreButtonStyle onClick={() => setCollapsed(!collapsed)}>
              Nascondi
            </LoadMoreButtonStyle>
          )}
        </div>
      );

    return (
      <LoadMoreButtonStyle onClick={() => setCollapsed(!collapsed)}>
        Mostra altri
      </LoadMoreButtonStyle>
    );
  };

  const slotListRenderer = (
    key: string,
    slotList: { slot: ApolloSlotCard }[]
  ) => {
    return (
      <div key={key}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            margin: "2rem  0rem",
            background: appTheme.colors.primary,
            padding: "2rem",
          }}
        >
          {slotList.map((slot) => (
            <SlotCardComponent key={slot.slot.name} slotCardData={slot.slot} />
          ))}
        </div>
      </div>
    );
  };

  const videoRenderer = (key: string, videoLink: string) => {
    return (
      <video key={key} controls style={{ width: "100%", margin: "1rem 0rem" }}>
        <source src={videoLink} type="video/mp4"></source>
      </video>
    );
  };

  return <div>{contentToBlocks()}</div>;
};

const HorizontalTableHeader = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;

const ComparisonContainer = styled.div`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  font-weight: bold;
  padding: 1rem;
  display: flex;
`;

const LoadMoreButtonStyle = styled.div`
  cursor: pointer;
  background: ${(props) => props.theme.colors.primary};
  padding: 1rem 2rem;
  text-align: center;
  color: white;
  font-family: ${(props) => props.theme.text.secondaryFont};
  margin: 1rem auto;
  border-radius: 8px;
  transition: all 0.3s ease-in;
  max-width: 330px;

  :hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }
`;

const HelloWorld = styled.div``;

export default DynamicContent;
