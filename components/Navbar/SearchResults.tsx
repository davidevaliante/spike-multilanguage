import React, { FunctionComponent, useContext } from "react"
import styled from "styled-components"
import Divider from "../Ui/Divider"
import { AlgoliaSearchResult } from "../../graphql/schema"
import FadeInOut from "../Ui/FadeInOut"
import Router from "next/router"
import { injectCDN } from "./../../utils/Utils"
import { LocaleContext } from "../../context/LocaleContext"

interface Props {
    show: boolean
    searchResults: AlgoliaSearchResult[] | undefined
}

const SearchResults: FunctionComponent<Props> = ({ show, searchResults }) => {
    return (
        <div>
            <FadeInOut visible={show}>
                <SearchResultsContainer>
                    {searchResults ? (
                        searchResults?.map((r: AlgoliaSearchResult, index: number) => (
                            <div key={`search_res_${index}`}>
                                <SearchTile result={r} />
                                <Divider color="grey" />
                            </div>
                        ))
                    ) : (
                        <SuggestedSearchs />
                    )}
                </SearchResultsContainer>
            </FadeInOut>
        </div>
    )
}

const SearchTile: FunctionComponent<{ result: AlgoliaSearchResult }> = ({ result }) => {
    const typeToString = (type: "slot" | "producer" | "bonus") => {
        switch (type) {
            case "slot":
                return "Slot"
            case "producer":
                return "Software house"
            case "bonus":
                return "Guida al bonus"
            default:
                return "Unknown"
        }
    }

    const handleEntityClick = () => {
        console.log("click", result.type)
        if (result.type === "slot") Router.push(`/slot/${result.slug}/${result.country}`)
        if (result.type === "bonus") {
            if (result.slug) Router.push(`/guida/${result.slug}/${result.country}`)
            else window.open(result.link)
        }
        if (result.type === "producer") Router.push(`/producer/${result.slug}/${result.country}`)
        else console.log(result.type)
    }

    const getImageUrl = (): string => {
        if (result.image.url === undefined) return result.image.toString()
        return result.image.url
    }

    return (
        <ResultTileStyleProvider type={result.type}>
            <div className="tile-container" onClick={() => handleEntityClick()}>
                <img style={{ width: "36px", height: "36px" }} src={injectCDN(getImageUrl())} />
                <h3>{result.name}</h3>
                <h3 className="type">{typeToString(result.type)}</h3>
            </div>
        </ResultTileStyleProvider>
    )
}

const SuggestedSearchs: FunctionComponent = () => {
    const { t, contextCountry } = useContext(LocaleContext)

    const getSuggestResultsForCountry = () => {
        switch (contextCountry) {
            case "it":
                return (
                    <div>
                        <ResultTileStyleProvider type="slot">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/slot/book-of-ra-deluxe/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/book_of_ra_6_68e4a453f1.png"
                                    )}
                                />
                                <h3>{t("Book of Ra Deluxe")}</h3>
                                <h3 className="type">{"Slot"}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="producer">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/producer/netent/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/netent-producer-producer-logo_09eff18553.jpeg"
                                    )}
                                />
                                <h3>{"NetEnt"}</h3>
                                <h3 className="type">{"Software House"}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="bonus">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/guida/bonus-benvenuto-casino-starvegas/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/starvegas-thumb_5a76bddf4f.jpeg"
                                    )}
                                />
                                <h3>{t("Starvegas")}</h3>
                                <h3 className="type">{t("Bonus Guide")}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="bonus">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/guida/bonus-benvenuto-starcasino/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/starcasino-logo_3f590e21e0.png"
                                    )}
                                />
                                <h3>{"Starcasinò"}</h3>
                                <h3 className="type">{t("Bonus Guide")}</h3>
                            </div>
                        </ResultTileStyleProvider>
                    </div>
                )

            case "row":
                return (
                    <div>
                        <ResultTileStyleProvider type="slot">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/slot/book-of-ra-deluxe/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/book_of_ra_6_68e4a453f1.png"
                                    )}
                                />
                                <h3>{"Book of Ra Deluxe"}</h3>
                                <h3 className="type">{"Slot"}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="producer">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/producer/netent/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/netent-producer-producer-logo_09eff18553.jpeg"
                                    )}
                                />
                                <h3>{"NetEnt"}</h3>
                                <h3 className="type">{"Software House"}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="bonus">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/guida/cobra-casino-review/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/cobracasino-circular-image_c3d7484779.jpeg"
                                    )}
                                />
                                <h3>{"Cobra Casino"}</h3>
                                <h3 className="type">{t("Bonus Guide")}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="bonus">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/guida/buran-casino-review/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/buran-casino-circular-image_48f4dba870.jpeg"
                                    )}
                                />
                                <h3>{"Buran Casino"}</h3>
                                <h3 className="type">{t("Bonus Guide")}</h3>
                            </div>
                        </ResultTileStyleProvider>
                    </div>
                )

            default:
                return (
                    <div>
                        <ResultTileStyleProvider type="slot">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/slot/book-of-ra-deluxe/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/book_of_ra_6_68e4a453f1.png"
                                    )}
                                />
                                <h3>{t("Book of Ra Deluxe")}</h3>
                                <h3 className="type">{"Slot"}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="producer">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/producer/netent/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/netent-producer-producer-logo_09eff18553.jpeg"
                                    )}
                                />
                                <h3>{"NetEnt"}</h3>
                                <h3 className="type">{"Software House"}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="bonus">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/guida/bonus-benvenuto-casino-starvegas/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/starvegas-thumb_5a76bddf4f.jpeg"
                                    )}
                                />
                                <h3>{t("Starvegas")}</h3>
                                <h3 className="type">{t("Bonus Guide")}</h3>
                            </div>
                        </ResultTileStyleProvider>

                        <ResultTileStyleProvider type="bonus">
                            <div
                                className="tile-container"
                                onClick={() => Router.push(`/guida/bonus-benvenuto-starcasino/${contextCountry}`)}
                            >
                                <img
                                    style={{ width: "36px", height: "36px" }}
                                    src={injectCDN(
                                        "https://spike-images.s3.eu-central-1.amazonaws.com/starcasino-logo_3f590e21e0.png"
                                    )}
                                />
                                <h3>{"Starcasinò"}</h3>
                                <h3 className="type">{t("Bonus Guide")}</h3>
                            </div>
                        </ResultTileStyleProvider>
                    </div>
                )
        }
    }

    return (
        <SearchSuggestionStyleProvider>
            <div className="search-result">
                <h3 className="search-suggestions">{t("Popular searches")} :</h3>

                {getSuggestResultsForCountry()}
            </div>
        </SearchSuggestionStyleProvider>
    )
}

interface ITile {
    type: "slot" | "bonus" | "producer"
}

const SearchSuggestionStyleProvider = styled.div`
    a {
        background: white;
        color: ${(props) => props.theme.colors.primary};
        padding: 1rem;
        display: block;

        :hover {
            background: white;
            color: ${(props) => props.theme.colors.primary};
            padding: 1rem;
            display: block;
        }
    }
`

const ResultTileStyleProvider = styled.div`
    .tile-container {
        cursor: pointer;
        display: flex;
        align-items: center;
        color: black;
        padding: 1rem;
    }

    .type {
        color: white;
        padding: 0.3rem 0.5rem;
        letter-spacing: 0.05rem;
        font-family: ${(props) => props.theme.text.secondaryFont};
        border-radius: 6px;
        font-size: 65%;
        margin-left: auto;
        background: ${(props: ITile) => {
            if (props.type === "bonus") return "#22e34c"
            if (props.type === "producer") return "#b922e3"
            if (props.type === "slot") return "#5070f2"
        }};
    }
`

const SearchResultsContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    background: white;
    overflow-y: scroll;
    max-height: 400px;
    width: 100%;
    left: 0;
    top: 54px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 999;

    .search-suggestions {
        color: ${(props) => props.theme.colors.primary};
        padding: 1rem;
        font-family: ${(props) => props.theme.text.secondaryFont};
        font-size: 80%;
    }

    h3 {
        text-align: start;
    }

    img {
        border-radius: 50%;
        margin-right: 1rem;
        object-fit: cover;
    }
`

export default SearchResults
