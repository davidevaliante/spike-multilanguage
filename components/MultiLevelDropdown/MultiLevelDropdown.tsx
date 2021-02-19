import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react'
import Link from 'next/link'

interface Props {
    label: string
    items: DropdownItem[]
}

interface DropdownItem {
    label: string,
    linkTo: string
}

const MultiLevelDropdown: FunctionComponent<Props> = ({ items }) => {

    const [open, setOpen] = useState(false)
    
    useEffect(() => {
        console.log(open)
    }, [open])


    const DropdownItem: FunctionComponent<{ label: string, link: string }> = ({ label, link }) => {
        return <DropdownItemDiv>
            <a href={link} className='menu-item'>
                {label}
            </a>
        </DropdownItemDiv>
    }

    return (
        <StyleProvider onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>

            <Link href={`/pagamenti`}>
                <a>Altro</a>
            </Link>

            <div className='dropdown'  >
                {open && items.map(i => <DropdownItem label={i.label} link={i.linkTo} />)}
            </div>

        </StyleProvider>
    )
}

const StyleProvider = styled.div`
    position : relative;
    ul{
        list-style:none;
        margin : 0;
        padding: 0;
    }

    .dropdown{
        position :absolute;
        transform : translateX(-30%);
        top : 1rem;
        border-radius : 4px;
        border : 1px solid gray;
        background : white;
        color : ${(props) => props.theme.colors.primary};
        overflow : hidden;
    }
`

const DropdownItemDiv = styled.div`
    cursor : pointer;
    color : ${(props) => props.theme.colors.primary};
    width : 250px;
 
    a{
        display : inline-block;
        color : ${(props) => props.theme.colors.primary};
        padding : 1rem;
        width : 250px;
    }
     
    a:hover {
        display : inline-block;
        color : ${(props) => props.theme.colors.primary};
        padding : 1rem;
        width : 250px;
    }
`

export default MultiLevelDropdown
