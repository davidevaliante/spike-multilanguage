import React, { FunctionComponent, useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'

interface Props {
    
}

const socketEndPoint = 'http://crazytime.spike-realtime-api.eu:5001'

const index : FunctionComponent<Props> = ({}) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined)

    useEffect(() => {   
        console.log(socket)
        if(socket){
            socket.on('connect', () => {
                console.log('connected')

                socket.emit('1h')

                socket.on('1h', data => {
                    console.log(data)
                })
            })
        }
    }, [socket])

    useEffect(() => {
        setupSocket()
    }, [])

    const setupSocket = async () => {
        const socketInstance = io(socketEndPoint)
        setSocket(socketInstance)
    }

    return (
        <div>
            <h1>Hello world</h1>
        </div>
    )
}

export default index
