
import React, { Component, useState } from 'react'
import {
    Row, Col, Divider,
    Input, DatePicker, Button, Affix, Card, List, Typography, Tooltip, InputNumber
} from 'antd';
import {
    PlusOutlined,
    CarryOutOutlined, ImportOutlined, ExportOutlined, DeleteOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css'

import 'bootstrap/dist/css/bootstrap.min.css'

// import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { remB } from 'util/constant'
import { motion } from "framer-motion"
// import Background from './background.jpg';
import { connect } from 'react-redux';
import eventSlice, { fetchEvent, addEvent, modEvent, rmvEvent } from 'state/eventSlice'
import moment from 'moment'

import { ItemTypes } from 'util/constant'
import { useDrag, useDrop } from "react-dnd";
import { idEventFilter, unDoneEventsFilter } from "util/filter"
import { CSSTransition } from "react-transition-group";

import { styles } from './antStyle'
import './mission.css'

class RInputRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: '', //or null, db col should be non null
            target: '',
            purpose: '',
            initTime: moment(), //moment object, when transfer use moment.unix()
            dueTime: moment().add(1, 'days'),
            expectTime: 1.5
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        // call redux action to call create api
        const { initTime, dueTime } = { ...this.state }
        let payload = { ...this.state }
        payload.initTime = initTime.unix()
        payload.dueTime = dueTime.unix()
        this.props.dispatch(addEvent(payload))
    }

    //render place for input
    render() {
        const forwardBp = { xs: 12, md: 8 }
        const backBp = { xs: 8, md: 6 }
        return (
            <Row justify='left'
                gutter={[{ xs: 6, sm: 16, md: 16, lg: 2 * remB }, { xs: 4, sm: 8, md: 8, lg: remB }]}>
                <Col {...forwardBp} >
                    <Input placeholder="event summary"
                        value={this.state.summary}
                        onChange={e => this.setState({ summary: e.target.value })} />
                </Col>
                <Col {...forwardBp} >
                    <Input placeholder="event target"
                        value={this.state.target}
                        onChange={e => this.setState({ target: e.target.value })} />
                </Col>
                <Col {...forwardBp} >
                    <Input placeholder="event purpose"
                        value={this.state.purpose}
                        onChange={e => this.setState({ purpose: e.target.value })} />
                </Col>

                <Col {...backBp} >
                    <DatePicker placeholder="init date" className="inputOption"
                        value={this.state.initTime}
                        onChange={(date, dS) => this.setState({ initTime: date })} />
                </Col>
                <Col {...backBp} >
                    <DatePicker placeholder="due date" className="inputOption"
                        value={this.state.dueTime}
                        onChange={(date, dS) => this.setState({ dueTime: date })} />
                </Col>
                <Col {...backBp} >
                    <Tooltip title={'expect time (hr)'}>
                        <InputNumber min={0.25} max={8} step={0.25}
                            value={this.state.expectTime}
                            formatter={value => {
                                return `${value} hr`
                            }}
                            parser={value => {
                                return value.replace(/[a-z ]/g, '')
                            }}
                            onChange={val => {
                                // val => val.toString().replace(/\D/g,'')
                                // console.log(val)
                                this.setState({ expectTime: val })
                            }}
                        />
                    </Tooltip>
                </Col>
                <Col {...backBp}
                    display='flex'
                >
                    <Button onClick={this.handleSubmit}
                        style={{
                            display: 'static',
                            marginLeft: 'auto'
                        }}
                        icon={<PlusOutlined />}>
                    </Button>
                </Col>
            </Row>
        )
    }
}
RInputRow = connect(state => ({
    ...state.event
}))(RInputRow)



function DraggableCardDiv(props) {
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: ItemTypes.CARD, ...props },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging() //return true or false
        })
    });

    return (
        <div ref={dragRef} //
            className={`ms__card-div ${props.event.is_today_event && 'ms__card-div--istoday'}`}
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

function ScheCard(props) {
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

function DropIcon({ tooltipStr, onDrop, children }) {
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
class CurrentMission extends Component {
    eventsFilter(period) {
        let { events } = this.props
        events = unDoneEventsFilter(events)
        let lowerBound
        let upperBound
        switch (period) {
            case 'outdated':
                lowerBound = moment().subtract(30, 'days')
                upperBound = moment()
                break
            case 'today':
                //not use currently
                lowerBound = moment()
                upperBound = moment().add(1, 'days')
                break
            case 'oneWeek':
                lowerBound = moment()
                upperBound = moment().add(7, 'days')
                break
            case 'oneMonth':
                lowerBound = moment().add(7, 'days')
                upperBound = moment().add(30, 'days')
                break
            case '6Month':
                lowerBound = moment().add(30, 'days')
                upperBound = moment().add(30 * 6, 'days')
                break
            default:
                console.log('you pass the wrong period in.')
                return
        }
        let finEvents = events.filter((e) => {
            if (moment.unix(e.due_time).isBetween(lowerBound, upperBound)) {
                return true
            }
            return false
        })
        //console.log(finEvents)
        return finEvents
    }
    render() {
        const loading = !!this.props.eventLoadingCount
        // console.log(this.props.eventLoadingCount)
        const outdatedDt = this.eventsFilter('outdated')
        const oneWeekDt = this.eventsFilter('oneWeek')
        const oneMonthDt = this.eventsFilter('oneMonth')
        const sixMonthDt = this.eventsFilter('6Month')
        const dtArr = [outdatedDt, oneWeekDt, oneMonthDt, sixMonthDt]
        const titleStrArr = ['outdated', 'one week', 'one month', 'six month']
        return (
            <div>
                <Row justify='center'>
                    <Col className='ms__title'>Mission</Col>
                </Row>
                <Row justify='center' >
                    <Col >
                        <RInputRow />
                    </Col>
                </Row>
                <div style={{ padding: '.3rem' }}></div>

                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    {dtArr.map((el, idx) => {
                        return (
                            <Col key={idx} xs={24} sm={12} lg={6}>
                                {!!el.length &&
                                    <ScheCard loading={loading} titleStr={titleStrArr[idx]} dataArr={el} />}
                            </Col>)
                    })}
                </Row>

                <Affix offsetBottom={0}>
                    <Row justify='left' style={{
                        width: '80%',
                        margin: '0.5rem 0rem .5rem 1rem'
                    }}
                    >
                        <Col>
                            <DropIcon tooltipStr={'drag event over to mark event finished'}
                                onDrop={(eID) => {
                                    let event = idEventFilter(this.props.events, eID)
                                    let newEvent = { ...event, done_ts: moment().unix() }
                                    this.props.dispatch(modEvent(newEvent))
                                }}>
                                <CarryOutOutlined className='interactive-icon' />
                            </DropIcon>
                        </Col>
                        <Col>
                            <DropIcon tooltipStr={'drag event over to add to today work'}
                                onDrop={(eID) => {
                                    //modify is today event
                                    let event = idEventFilter(this.props.events, eID)
                                    let newEvent = { ...event, is_today_event: true }
                                    this.props.dispatch(modEvent(newEvent))
                                }}>
                                <ImportOutlined className='interactive-icon' />
                            </DropIcon>
                        </Col>
                        <Col>
                            <DropIcon tooltipStr={'drag event over to cancel from today work'}
                                onDrop={(eID) => {
                                    //modify is today event
                                    let event = idEventFilter(this.props.events, eID)
                                    let newEvent = { ...event, is_today_event: false }
                                    this.props.dispatch(modEvent(newEvent))
                                }}>
                                <ExportOutlined className='interactive-icon' />
                            </DropIcon>
                        </Col>
                        <Col>
                            <DropIcon tooltipStr={'drag event over to delete it'}
                                onDrop={(eID) => {
                                    this.props.dispatch(rmvEvent(eID))
                                }}>
                                <DeleteOutlined className='interactive-icon' />
                            </DropIcon>
                        </Col>
                    </Row>
                </Affix>

            </div>
        )
    }
}
export default CurrentMission = connect(state => ({
    ...state.event
}))(CurrentMission)

