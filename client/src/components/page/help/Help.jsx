import React, { Component, useState } from 'react'

import YouTube from 'react-youtube';

import './help.css'

export default function Help(props) {
    // may be try vieo react
    let [w, setW] = useState(window.innerWidth)
    let [h, setH] = useState(window.innerHeight)
    let n = Math.min(h * 0.8 / 390, w * 0.8 / 640)
    const opts = {
        height: 390 * n,
        width: 640 * n,
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    return (
        <div className='hp-root'
            onClick={() => {
                props.cancelCB()
            }}
        >
            <div className='hp-movie-container'>
                {/* <iframe width="560" height="315"
                src="https://www.youtube.com/embed/4FVgbmBuJlY" frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe> */}
                <YouTube videoId="4FVgbmBuJlY" opts={opts}
                // onReady={(event) => {
                //     event.target.pauseVideo();
                // }}
                />
            </div>
        </div>
    )
}