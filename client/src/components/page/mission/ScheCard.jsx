
import React,{useState} from 'react'
import {Card, Tooltip, Button}  from 'antd';
import 'antd/dist/antd.css'

import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from 'util/constant'

import { styles } from './antStyle'
import './mission.css'

function DraggableCardDiv(props) {
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: ItemTypes.CARD, ...props },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging() //return true or false
        })
    });

    return (
        <div ref={dragRef} //
            className={`ms__card-div ${props.event.cycle_events_id && 'ms__card-div--isCycled'} 
            ${props.event.is_today_event && 'ms__card-div--istoday'}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
                // backgroundColor: props.event.is_today_event ? 'green' : 'white'
            }}
        >
            {props.event.summary}

        </div>
    );
};

export function ScheCard(props) {
    let { titleStr, dataArr } = props
    //render schedule card
    const columns = dataArr.map((event, columnIndex) => {
        const propsToColumn = { event };
        return (
            <div key={`column-${columnIndex}`}>
                <DraggableCardDiv {...propsToColumn} />
            </div>
        )
    });
    return (
        <Card
            // loading={props.loading} //effect not good
            className='ms__ant-card'
            bodyStyle={styles.antCardBody}
            headStyle={styles.antCardHeader}
            title={titleStr}
            style={styles.antCard}>
            {/* <Card.Meta title={titleStr} style={{...styles.antCardHeader,...styles.antCardHeaderTitle}}/> */}
            {columns}
        </Card>
    )
}

export function DropIcon({ tooltipStr, onDrop, children }) {
    //const [bottom, setBottom] = useState(0);
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.CARD, //this value will pass to item
        drop: (item, mon) => {
            //item is what the draggle item is, its property depend on its item object
            //console.log('some dropped',item.event) //dispatch(rmvEvent()),
            onDrop(item.event.id)
        },
        collect: (mon) => ({
            isOver: !!mon.isOver(),
            canDrop: !!mon.canDrop()
        })
    })
    let className = 'interactive-icon-container ' //default
    if (!isOver && canDrop) {
        className += 'interactive-icon-container--can-drop'
    } else if (isOver && canDrop) {
        className += 'interactive-icon-container--hover'
    }
    return (
        <Tooltip title={tooltipStr}>
            <Button ref={drop}
                className={className}
            >
                {children}
            </Button>
        </Tooltip>
    )
}