import { FunctionComponent, ReactNode } from 'react'

export const BodyContainer: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    return <div className='relative flex justify-around flex-wrap'>{children}</div>
}

export const MainColumnScroll: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    return <div className='max-w-[900px]'>{children}</div>
}

export const MainColumn: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    return <div className='max-w-[900px] lg:w-[900px] flex flex-col min-h-[2400px]'>{children}</div>
}

export const RightColumn: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    return <div className='hidden w-[200px] relative lg:flex lg:flex-col lg:min-w-[300px] items-center'>{children}</div>
}
