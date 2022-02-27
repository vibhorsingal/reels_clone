import React from 'react'

function Video(props) {
    return (
        <div>
            <video src={props.post.videoUrl} controls></video>
        </div>
    )
}

export default Video