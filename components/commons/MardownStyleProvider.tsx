import React, { FunctionComponent } from 'react'

interface IMardownStyleProvider {
    children: React.ReactNode
}

const MardownStyleProvider: FunctionComponent<IMardownStyleProvider> = ({ children }) => {
    return <div className='markdown-style-provider'>{children}</div>
}

export default MardownStyleProvider
