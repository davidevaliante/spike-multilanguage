import React, { FunctionComponent, Fragment } from 'react'
import styled from 'styled-components'
import {PinterestShareButton, WhatsappShareButton, FacebookShareButton, } from 'react-share'
import Image from 'next/image'

interface IShareButtons {
    title? : string,
    url : string,
    image : string,
    description? : string
}

const ShareButtons : FunctionComponent<IShareButtons> = ({title, url, image, description}) => {

    return (
        <Container>
            <PinterestShareButton title={title} url={url} media={image} description={description}>
                <Image width={46} height={46} src={`/icons/pinterest.svg`}/>
            </PinterestShareButton>  

            <WhatsappShareButton className='image' title={title} url={url}>
                <Image width={46} height={46} src={`/icons/whatsapp.svg`}/>
            </WhatsappShareButton>   

            <FacebookShareButton quote={title} url={url} >
                <Image width={46} height={46} src={`/icons/facebook.svg`}/>
            </FacebookShareButton>        
        </Container>
    )
}

export const TopRowContainer = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : space-between;
`



const Container = styled.div`
    display : inline-block;
    margin : 1rem;
    
    .image{
        margin : 0rem 1rem;
    }
`

export default ShareButtons