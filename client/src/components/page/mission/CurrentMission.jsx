
import React, { Component, useState } from 'react'
import {
    Row, Col,
    Input, DatePicker, Button, Affix, Tooltip, InputNumber,
} from 'antd';
import {
    PlusOutlined, WarningTwoTone,
    CarryOutOutlined, ImportOutlined, ExportOutlined, DeleteOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css'

import { ScheCard, DropIcon } from './ScheCard'
import { remB } from 'util/constant'
// import Background from './background.jpg';
import { connect } from 'react-redux';
import eventSlice, { fetchEvent, addEvent, modEvent, rmvEvent } from 'state/eventSlice'
import moment from 'moment'

import { idEventFilter, unDoneEventsFilter } from "util/filter"


import './mission.css'

class RInputRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: '', //or null, db col should be non null
            target: '',
            purpose: '',
            init_time: moment(), //moment object, when transfer use moment.unix()
            due_time: moment().add(1, 'days'),
            expect_time: 1.5
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        // call redux action to call create api
        const { init_time, due_time } = { ...this.state }
        let payload = { ...this.state }
        payload.init_time = init_time.unix()
        payload.due_time = due_time.unix()
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
                    <Tooltip title={'Express what you want to do.(necessary)'}
                    >
                        <Input placeholder="event summary"
                            className={`${!this.state.summary && 'ms__input--not-accept'}`}
                            value={this.state.summary}
                            onChange={e => this.setState({ summary: e.target.value })} />
                        {/* <span>
                            {!this.state.summary && <WarningTwoTone twoToneColor="#eb2f96" />}
                        </span> */}
                    </Tooltip>
                </Col>


                <Col {...forwardBp} >
                    <Tooltip title={'Criteria to reveal finished.'}>
                        <Input placeholder="event target"
                            value={this.state.target}
                            onChange={e => this.setState({ target: e.target.value })} />
                    </Tooltip>
                </Col>

                <Col {...forwardBp} >
                    <Tooltip title={'The reason to do this event.'}>
                        <Input placeholder="event purpose"
                            value={this.state.purpose}
                            onChange={e => this.setState({ purpose: e.target.value })} />
                    </Tooltip>
                </Col>

                <Col {...backBp} >
                    <Tooltip title={'init time.(necessary)'}>
                        <DatePicker placeholder="init date" className="inputOption"
                            value={this.state.init_time}
                            onChange={(date, dS) => this.setState({ init_time: date })} />
                    </Tooltip>
                </Col>
                <Col {...backBp} >
                    <Tooltip title={'due time.(necessary)'}>
                        <DatePicker placeholder="due date" className="inputOption"
                            value={this.state.due_time}
                            onChange={(date, dS) => this.setState({ due_time: date })} />
                    </Tooltip>
                </Col>
                <Col {...backBp} >
                    <Tooltip title={'expect time(hr).(necessary)'}>
                        <InputNumber min={0.25} max={8} step={0.25}
                            value={this.state.expect_time}
                            formatter={value => {
                                return `${value} hr`
                            }}
                            parser={value => {
                                return value.replace(/[a-z ]/g, '')
                            }}
                            onChange={val => {
                                // val => val.toString().replace(/\D/g,'')
                                // console.log(val)
                                this.setState({ expect_time: val })
                            }}
                        />
                    </Tooltip>
                </Col>
                <Col {...backBp}
                    display='flex'
                >
                    <Button onClick={this.handleSubmit}
                        htmlType="submit"
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
                //for perodic event
                lowerBound = moment()
                upperBound = moment().add(1, 'days')
                break
            case 'oneWeek':
                lowerBound = moment().add(1, 'days')
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
        const todayDt = this.eventsFilter('today')
        const oneWeekDt = this.eventsFilter('oneWeek')
        const oneMonthDt = this.eventsFilter('oneMonth')
        const sixMonthDt = this.eventsFilter('6Month')
        const dtArr = [outdatedDt, todayDt, oneWeekDt, oneMonthDt, sixMonthDt]
        const titleStrArr = ['outdated', 'today', 'one week', 'one month', 'six month']
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

                <Row justify='left' style={{ margin: '0 auto' }}>
                    {dtArr.map((el, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {!!el.length &&
                                    <Col xs={24} sm={12} lg={6}>
                                        {!!el.length &&
                                            <ScheCard loading={loading} titleStr={titleStrArr[idx]} dataArr={el} />}
                                    </Col>}
                            </React.Fragment>
                        )
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

