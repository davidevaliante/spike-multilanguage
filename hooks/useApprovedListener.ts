import React, { useEffect, useState } from 'react'
import { mapJsonToArray } from '../utils/Utils'
import { plainToClass } from 'class-transformer'
import { AwsVideoApproved } from './../data/models/AwsVideoApproved';

export default function useApprovedVideosListener(onListUpdate: (approvedVideos: AwsVideoApproved[]) => void) {

    // const [onceDone, setOnceDone] = useState(false)

    // useEffect(() => {
    //     firebaseDatabase.ref(`AwsVideosApproved`).on('value', snapshot => {
    //         const updatedList = mapJsonToArray(snapshot.val(), true)
    //         const approvedVideos = plainToClass(AwsVideoApproved, updatedList)
    //         const raw = approvedVideos.filter((v: AwsVideoApproved) => v.title === undefined)
    //         const filled = approvedVideos.filter((v: AwsVideoApproved) => v.title !== undefined)
    //         // console.log(`approved videos -> ${approvedVideos.length}`)
    //         // console.log(approvedVideos)
    //         onListUpdate([...raw, ...filled])

    //         // per farlo andare solo una volta invece simulando il dispatch del listener

    //         // if (!onceDone) {
    //         //     onListUpdate(mapJsonToArray([...raw, ...filled]), true)
    //         //     setOnceDone(true)
    //         // }
    //     })
    //     return () => firebaseDatabase.ref(`AwsVideosApproved`).off()
    // }, [])
}