import React, { Component, useState, useEffect } from 'react'
import {
    Tooltip
} from 'antd';
import 'antd/dist/antd.css'


export default function TimeoutTooltip(props) {
    const [show, setShow] =useState(false)
    useEffect(()=>{
        // console.log('tiemout:',props)
        const e_start_id = setTimeout(setShow, 200||props.startTime, true)//start aft 200ms
        const e_exit_id = setTimeout( setShow , props.delayTime, false)
        return ()=>{
            clearInterval(e_start_id)
            clearInterval(e_exit_id)
        }
    }, [] )
    return (
        //defaultVisible is usefull too
        <React.Fragment>
            <Tooltip {...props} visible={show}>
                {props.children}
            </Tooltip>
        </React.Fragment>
    )
}

