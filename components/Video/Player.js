import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import videojs from 'video.js'
import qualitySelector from 'videojs-hls-quality-selector'
import qualityLevels from 'videojs-contrib-quality-levels'
import styled from 'styled-components'
import { AnimatePresence, motion } from "framer-motion"
import delay from 'lodash/delay'
import axios from 'axios'
import snakeCase from 'lodash/snakeCase'
import Divider from '../Ui/Divider'
import useWindowSize from '../../hooks/useWindowSize'
import { isMobile, isAndroid } from 'react-device-detect'
import { useDoubleTap } from 'use-double-tap'
import useKey from '../../hooks/useKey'

const fromLaptop = 'only screen and (min-width : 992px)'

const fromTablet = 'only screen and (min-width: 768px)'

const Player = ({ highLights, videoLink, bonusId, autoplay, mainBonus, onPlayerReady, _bonuses }) => {
   
    const videoRef = useRef()
    
    const windowSize = useWindowSize()

    useEffect(() => {
        if (windowSize[0] > windowSize[1] && isMobile) {
            // document.getElementById('toggler').click()
        }
    }, [windowSize])

    const [player, setPlayer] = useState(undefined)

    useEffect(() => {
        if (player) {
            player.hlsQualitySelector({ displayCurrentQuality: true })
            player.on('timeupdate', timeupdateListener)
        }

        return () => {
            if (player) player.off('timeupdate', timeupdateListener)
        }
    }, [player])

    const [highlightTollerationDelta, setHighlightTollerationDelta] = useState(.3)
    const [_highLights, setHighLights] = useState(highLights)
    const [isShowingBonus, setIsShowingBonus] = useState(false)
    const [highlightToShowIndex, setHighlightToShowIndex] = useState(undefined)
    const [bonusData, setBonusData] = useState(mainBonus)
    const [forwardingIncrement, setForwardingIncrement] = useState(10)
    const [bonuses, setBonuses] = useState(_bonuses)
    const [forwardingDelta, setForwardingDelta] = useState(0)
    const [canForward, setCanForward] = useState(false)
    const [fastMode, setFastMode] = useState('forward')

    useEffect(() => {
        if (canForward) {
            if (fastMode === 'forward') player.currentTime(player.currentTime() + forwardingDelta)
            if (fastMode === 'backward') player.currentTime(player.currentTime() - forwardingDelta)
            setCanForward(false)
        }
    }, [canForward])

    const [forwardingTimer, setForwardingTimer] = useState(undefined)

    const rightArrowKey = useKey('right')

    const [cursorPos, setCursorPos] = useState({})
    const [doubleTap, setDoubleTap] = useState(false)
    const [playing, setPlaying] = useState(true)

    const [showFullScreenButton, setShowFullScreenButton] = useState(true)

    useEffect(() => {
        if (rightArrowKey) {
            fastForward()
        }

    }, [rightArrowKey])


    const getMainBonus = async () => {
        const bonus = await axios.get(`https://spike-2481d.firebaseio.com/Bonus/it/${bonusId}.json`)
        setBonusData(bonus.data)
    }

    useEffect(() => {
        // getMainBonus()
        const videoJsOptions = {
            bigPlayButton: false,
            playbackRates: [0.5, 1, 1.5, 2],
            autoplay: autoplay,
            controls: true,
            fluid: true,
            muted: false,
            responsive: true,
            sources: [{
                src: videoLink,
            }],
            html5: {
                hls: {
                    overrideNative: true
                },
                nativeVideoTracks: false,
                nativeAudioTracks: false,
                nativeTextTracks: false
            },
            controlBar: {
                fullscreenToggle: isMobile ? false : true,
                volumePanel: false,
                muteToggle: true
            }
        }

        videojs.registerPlugin('hlsQualitySelector', qualitySelector)

        const p = videojs(videoRef.current, videoJsOptions, function onPlayerReaady() {
            onPlayerReady && onPlayerReady()
        })

        setPlayer(p)

        p.on('fullscreenchange', async function () {
            if (p.isFullscreen()) {
                document.getElementById('vjs_video_3').appendChild(document.getElementById('player-overlay'))
            } else {
                setShowFullScreenButton(true)
            }
        });

        return () => {
            player && player.dispose()
        };

    }, [])



    const showBonus = index => {
        setIsShowingBonus(true)
        setHighlightToShowIndex(index)

        delay(() => hideBonus(), 5000, 'bonus hidden')
    }

    const hideBonus = () => {
        setIsShowingBonus(false)
        setHighlightToShowIndex(undefined)
    }

    const timeupdateListener = () => {
        const currentTime = player.currentTime()

        if (_highLights && _highLights.length > 0) {
            const indexFound = _highLights.findIndex(h => {
                const { minute, second } = h
                const convertedHighlightTime = parseInt(minute) * 60 + parseInt(second)
                return convertedHighlightTime <= currentTime + highlightTollerationDelta &&
                    convertedHighlightTime >= currentTime - highlightTollerationDelta
            })

            if (indexFound !== -1 && !isShowingBonus && highlightToShowIndex === undefined) {
               
                showBonus(indexFound)
            }
        }
    }

    const seekTo = highlight => {
        player.currentTime(parseInt(highlight.minute) * 60 + parseInt(highlight.seconds))
    }

    const goToBonus = () => {
        window.open(`${bonusData.link}`)
    }

    const goToTargetBonus = (link) => {
        window.open(link)
    }

    const getCircularImage = name => `https://firebasestorage.googleapis.com/v0/b/spike-2481d.appspot.com/o/CircularBonusImages%2Fbonus_circular_${snakeCase(name)}?alt=media`

    const goFirstBonus = () => {
        const { minute, second } = _highLights[0]
        const b = parseInt(minute) * 60 + parseInt(second) - 1

        player.currentTime(b)
    }

    // const fastForward = useDoubleTap((event) => {

    //     event.preventDefault()
    //     setForwardingDelta(forwardingDelta + forwardingIncrement)
    //     setFastMode('forward')

    //     setDoubleTap(true)

    //     if (forwardingTimer !== undefined) {
    //         // console.log(`cancelling timer with id ${forwardingTimer}`)
    //         clearTimeout(forwardingTimer)
    //     }

    //     const timer = delay(() => {
    //         setCanForward(true)
    //         setForwardingTimer(undefined)
    //         setForwardingDelta(0)
    //     }, 700)
    //     // console.log(`initiated timer with id ${timer}`)
    //     setForwardingTimer(timer)
    // })

    // const fastBackward = useDoubleTap((event) => {
    //     event.preventDefault()
    //     setForwardingDelta(forwardingDelta + forwardingIncrement)
    //     setFastMode('backward')

    //     if (forwardingTimer !== undefined) {
    //         // console.log(`cancelling timer with id ${forwardingTimer}`)
    //         clearTimeout(forwardingTimer)
    //     }

    //     const timer = delay(() => {
    //         setCanForward(true)
    //         setForwardingTimer(undefined)
    //         setForwardingDelta(0)
    //     }, 700)
    //     // console.log(`initiated timer with id ${timer}`)
    //     setForwardingTimer(timer)
    // })

    const fastForward = () => {

        event.preventDefault()
        setForwardingDelta(forwardingDelta + forwardingIncrement)
        setFastMode('forward')

        setDoubleTap(true)

        if (forwardingTimer !== undefined) {
            
            clearTimeout(forwardingTimer)
        }

        const timer = delay(() => {
            setCanForward(true)
            setForwardingTimer(undefined)
            setForwardingDelta(0)
        }, 700)
        
        setForwardingTimer(timer)
    }

    const fastBackward = () => {
        event.preventDefault()
        setForwardingDelta(forwardingDelta + forwardingIncrement)
        setFastMode('backward')

        if (forwardingTimer !== undefined) {
            clearTimeout(forwardingTimer)
        }

        const timer = delay(() => {
            setCanForward(true)
            setForwardingTimer(undefined)
            setForwardingDelta(0)
        }, 700)
        
        setForwardingTimer(timer)
    }

    const togglePlayPause = () => {
        if (player.paused()) {
            setPlaying(true)
            player.play()
        } else {
            setPlaying(false)
            player.pause()
        }
    }

    const toggleFullScreen = () => {
        if (!player.isFullscreen()) {
            player.requestFullscreen()
        } else {
            player.exitFullscreen()
        }
    }

    return (
        <div id='spike-player'>
            <div data-vjs-player style={{ borderRadius: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <StyleProvider windowSize={windowSize} windowHeight={windowSize[1]} isMobile={isMobile}>
                        <div style={{ position: 'relative' }} id='live_player'>
                            <video ref={videoRef} className="video-js hu-css" playsInline>

                            </video>

                            <OnlyLandscape>
                                <AnimatePresence>
                                    {isAndroid && showFullScreenButton && <motion.div
                                        key={`hilight`}
                                        transition={{ duration: .4 }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}>
                                        <FullScreenButton onClick={() => toggleFullScreen()}>Riproduci a schermo intero</FullScreenButton>
                                    </motion.div>}
                                </AnimatePresence>
                            </OnlyLandscape>


                            <div id='player-overlay'>
                                <AddHilightColumn>
                                    <AnimatePresence>
                                        {isShowingBonus && <motion.div
                                            key={`hilight`}
                                            transition={{ duration: .4 }}
                                            initial={{ x: -120, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 120, opacity: 0 }}>
                                            {bonuses  && bonuses.map(bonusData =>  {
                                                return(
                                                    <BonusCard onClick={() => goToTargetBonus(bonusData.link)} glowColor={bonusData.borderColor}>
                                                        <CircularImage borderColor={bonusData.borderColor} src={getCircularImage(bonusData.name)} />
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
                                                            <h1 style={{ marginBottom: '.5rem', color: 'white' }}>{bonusData.name}</h1>
                                                            <Divider style={{ marginBottom: '.5rem' }} color={bonusData && bonusData.borderColor} />
                                                            <p style={{ fontSize: '.7rem' }}>{bonusData.description}</p>
                                                        </div>
                                                        <div style={{ maxWidth: '50px' }}>
                                                            <img height='20px' width='20px' src='/icons/arrow_right.svg' />
                                                        </div>
                                                    </BonusCard>
                                                )
                                            })}
                                        </motion.div>}
                                    </AnimatePresence>
                                </AddHilightColumn>

                                {/* <BigPlayPauseButton /> */}
                                <CenterDetector onClick={() => togglePlayPause()}>
                                    <AnimatePresence>
                                        {!playing && <motion.div
                                            transition={{ duration: .4 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}>
                                            <img src='/icons/play_button.svg' />
                                        </motion.div>}
                                    </AnimatePresence>
                                </CenterDetector>


                                <FastForward onClick={() => fastForward()}>
                                    <AnimatePresence>
                                        {forwardingTimer && fastMode === 'forward' && <motion.div
                                            transition={{ duration: .4 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}>
                                            <div className='circle'>
                                                <h1>+ {forwardingDelta}</h1>
                                            </div>
                                        </motion.div>}
                                    </AnimatePresence>
                                </FastForward>

                                <FastBackward onClick={() => fastBackward()}>
                                    <AnimatePresence>
                                        {forwardingTimer && fastMode === 'backward' && <motion.div
                                            transition={{ duration: .4 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}>
                                            <div className='circle'>
                                                <h1>- {forwardingDelta}</h1>
                                            </div>
                                        </motion.div>}
                                    </AnimatePresence>
                                </FastBackward>
                            </div>
                        </div>
                    </StyleProvider>
                </div>
            </div>
        </div>
    );
};

const OnlyLandscape = styled.div`
    display : none;

    @media (orientation : landscape) and (max-height : 450px){
        display : ${({ isMobile }) => 'block'};
    }
`

const FullScreenButton = styled.div`
    display : flex;
    position : absolute;
    top : 0;
    left : 0;
    background : rgba(0,0,0,0.7);
    color : white;
    padding : 1rem;
    border-radius : 4px;
    margin : .5rem;
    border : 2px solid #db2828;
    user-select : none;
`

const StyleProvider = styled.div`
    font-family : ${(props) => props.theme.text.primaryFont};

    .vjs-fluid{
        @media (orientation : landscape){
            padding-top : ${({ isMobile }) => isMobile && '0%'};
            height : ${({ windowHeight, isMobile }) => isMobile && `${windowHeight}px`};        
        }
        
    }

    #player-overlay{
        font-size : 100% !important;
        font-family : ${(props) => props.theme.text.primaryFont};
    } 

    .custom-ripple{
        pointer-events:none;
    }
`

const CenterDetector = styled.div`
    display : flex;
    position : absolute;
    background : transparent;
    width : 30%;
    height : 50%;
    top : 50%;
    left : 50%;
    transform : translate(-50%, -50%);
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;

    img{
        width : 100px;
        height : 100px;
    }
`

const FastForward = styled.div`
    user-select : none;
    display : flex;
    justify-content : center;
    width : 30%;
    height : 70%;
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    right : 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    z-index : 80;
    background-position: center;
    transition: background 0.8s;
    background : transparent;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;

   
    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        font-size: 46px;
        text-align: center;
        background:  rgba(0, 0, 0, 0.5);
        display : flex;
        flex-direction : column;
        justify-content : center;
        align-items : center;
    }

    h1{
        color : white;
        font-weight : bold;
        font-size : 1.3rem;
    }
`

const FastBackward = styled.div`
    user-select : none;
    display : flex;
    justify-content : center;
    width : 30%;
    height : 70%;
    position : absolute;
    top : 50%;
    transform : translateY(-50%);
    left : 0;
    background : transparent;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    background : transparent;
    display : flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
    z-index : 80;

    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        font-size: 46px;        
        text-align: center;
        background:  rgba(0, 0, 0, 0.5);
        display : flex;
        flex-direction : column;
        justify-content : center;
        align-items : center;
    }

    h1{
        color : white;
        font-weight : bold;
        font-size : 1.3rem;
    }
`

const CircularImage = styled.img`
    border-radius : 50%;
    height : 56px;
    width : 56px;
    border : ${({ borderColor }) => `${borderColor} 2px solid`};

    @media (max-width : 1000px) {
        height : 36px;
        width : 36px;
    }
`

const InfoContainer = styled.div`
    display : flex;
    flex-direction : column;

    h1{
        text-align : center;
        font-weight: bold;
        color : ${({ theme }) => theme.colors.primary};
        padding : 1rem;
    }

    h2{
        text-align : center;
        font-weight: bold;
        color : ${({ theme }) => theme.colors.primary};;
        padding : 1rem;
    }
`

const InputWrapper = styled.div`
    position : absolute;
    z-index : 99;
    left: 50%;
    top : 50%;
    transform: translateX(-50%) translateY(-50%);
`

const Box = styled.div`
    width : 250px;
    height : 250px;
    background : red;
    z-index : 99;
    position : absolute;
`

const InputCardContainer = styled.div`
    z-index:99;

`

const BonusCard = styled.div`
    cursor : pointer;
    display : flex;
    align-items : center;
    justify-content : space-around;
    padding : .5rem 1rem;
    margin-bottom : .5rem;
    border-top-left-radius : 5px;
    border-bottom-left-radius : 5px;
    background-color : rgba(0,0,0, .8);
    color : white;
    user-select : none;
    position : relative;
    right : 150;
    animation: glow .7s ease-in-out infinite alternate;
    z-index :  90;

    img{
        cursor: pointer;
    }

    @media (max-width : 1000px) {
        padding : .2rem .5rem;
        margin-bottom : .3rem;
        font-size : 0.7rem;
    }

    @keyframes glow {
        from {
            box-shadow: ${({ glowColor }) => `-12px 12px 15px -5px ${glowColor}`};
        }
        to {
            box-shadow: ${({ glowColor }) => `-12px 12px 15px -5px ${glowColor}`};
        }
    }
`

const BonusList = styled.div`
`

const AddHilightButton = styled.div`
    cursor: pointer;
    background-color : ${({ theme }) => theme.colors.primary};
    padding : .5rem;
    border-radius : 5px;
    user-select : none;
    margin:.5rem;
    font-size : 1rem;
    z-index : 99;

    @media ${fromTablet} {
        display : block;
        margin:1rem;
        padding : 1rem;
    }
`

const AddHilightColumn = styled.div`
    position : absolute;
    top : 0;
    right : 0;
    z-index : 99;
    color : white;
    font-weight : bold;
    display : block;

    @media ${fromTablet} {
        display : block;
    }

`

export default Player;