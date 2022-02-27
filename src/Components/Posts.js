import React, { useEffect, useState } from 'react'
import { database } from '../firebase'
import Video from '../Components/Video'
import CircularProgress from '@mui/material/CircularProgress';

function Posts({ userData }) {
    const [postArr, setPostArr] = useState(null);
    useEffect(() => {
        const unsub = database.posts.orderBy('createdAt', 'desc').onSnapshot((querySnapshot) => {
            let pArr = []
            querySnapshot.forEach((post) => {
                let data = { ...post.data(), postId: post.id }
                pArr.push(data)
            })
            setPostArr(pArr)
        })
        return unsub
    }, [])
    return (
        <div>
            {
                postArr == null ? <CircularProgress /> :
                    <div >
                        {
                            postArr.map((post, index) => {
                                return (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Video post={post} />
                                    </div>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default Posts