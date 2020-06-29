import React, { Component, useState } from 'react'

import {
    Row, Col,
    Input, Collapse, Button, Affix, Card, List, Typography, InputNumber, Radio
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, WarningTwoTone
} from '@ant-design/icons';
import 'antd/dist/antd.css'

import parser from 'cron-parser'

// import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { remB } from 'util/constant'
import { ScheCard, DropIcon } from './ScheCard'
import { connect } from 'react-redux';
import { addCycleEvent, modCycleEvent, rmvCycleEvent } from 'state/cycleEventSlice'
import moment from 'moment'

// import { idEventFilter, unDoneEventsFilter } from "util/filter"
// import { CSSTransition } from "react-transition-group";

import { styles } from './antStyle'
import './mission.css'
import './periodic-mission.css'
import { useEffect } from 'react';

function CronTabInput(props) {
    const [value, setValue] = useState(1)
    const [min, setMin] = useState('0')
    const [hr, setHr] = useState('7')
    const [day, setDay] = useState('*')
    const [month, setMonth] = useState('*')
    const [weekDay, setWeek] = useState('*')

    const [isCollapseOpen, setIsCollapseOpen] = useState(false)
    const [interval, setInterval] = useState(false)

    const timeStrArr = ['min', 'hr', 'day', 'month', 'week day']
    const timeArr = [min, hr, day, month, weekDay]
    const setTimeArr = [setMin, setHr, setDay, setMonth, setWeek]

    useEffect(() => {
        try {
            const cronStr = `${min} ${hr} ${day} ${month} ${weekDay}`
            const interval = moment(parser.parseExpression(cronStr).next().toDate());
            setInterval(interval)
            // console.log(interval.next().toDate())
            props.setCron(cronStr)
        } catch (err) {
            // console.log(err)
            console.log('Error: ' + err.message);
            setInterval(false)
        }
    }, [min, hr, day, month, weekDay])

    // console.log(interval.next().toString())
    return (
        <Collapse onChange={() => {
            // console.log('is collapse open:', isCollapseOpen)
            setIsCollapseOpen(!isCollapseOpen)
        }}>
            <Collapse.Panel header={
                <Row justify='space-between' align='middle'
                    className={`pm__collapse-header-box ${!interval && 'pm__collapse-header-box--warning'}`}
                >
                    <Col >
                        {props.header}:
                    </Col>

                    <Col >
                        {min} {hr} {day} {month} {weekDay}
                    </Col>
                    <Col >
                        {!!interval &&
                            interval.format('M/D/YYYY, h:mm')
                        }
                    </Col>
                    <Col >
                        {!interval &&
                            <WarningTwoTone twoToneColor="#eb2f96" />
                        }
                    </Col>
                </Row>
            } >
                <Radio.Group
                    style={{ width: '100%' }}
                    defaultValue={value}
                    buttonStyle="solid"
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                >
                    {timeStrArr.map((tStr, idx) => {
                        return (
                            <div key={idx}
                                className='pm__radio'
                            >
                                <Radio.Button
                                    className='pm__radio-btn'
                                    value={idx}>
                                    {tStr}
                                </Radio.Button>
                                {value === idx ?
                                    <Input
                                        className='pm__radio-btn pm__radio-btn--input'
                                        value={timeArr[idx]}
                                        onChange={(e) => {
                                            let val = e.target.value
                                            if (val) {
                                                if (val.length > 1) {
                                                    val = val.replace(/\*/g, '')
                                                }
                                            }
                                            else {
                                                val = '*'
                                            }
                                            (setTimeArr[idx])(val)
                                        }}
                                    />
                                    : null}
                            </div>
                        )
                    })}
                </Radio.Group>
            </Collapse.Panel>
        </Collapse>
    )
}

class PWInputRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: '', //or null, db col should be non null
            target: '',
            purpose: '',
            init_cron: '', //moment object, when transfer use moment.unix()
            due_cron: '',
            expect_time: 1.5
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit() {
        let payload = { ...this.state }
        this.props.dispatch(addCycleEvent(payload))
    }

    // change datepicker to cron picker
    render() {
        const forwardBp = { xs: 12, md: 8 }
        const cronBP = { xs: 24 }
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

                <Col {...cronBP} >
                    <CronTabInput header='init crontab' setCron={(cronVal) => {
                        this.setState({ init_cron: cronVal })
                    }} />
                </Col>
                <Col {...cronBP} >
                    <CronTabInput header='due crontab' setCron={(cronVal) => {
                        this.setState({ due_cron: cronVal })
                    }} />
                </Col>
                <Col {...backBp} >
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
PWInputRow = connect(state => ({
    ...state.event
}))(PWInputRow)


class PeriodicMission extends Component {
    // render periodic work
    constructor(props) {
        super(props)
    }
    cycleEventsParser() {
        let { cycleEvents } = this.props
        let dailyArr, weeklyArr, monthlyArr, yearlyArr //at least
        [dailyArr, weeklyArr, monthlyArr, yearlyArr] = [[], [], [], []] //at least

        cycleEvents.forEach((el, idx) => {
            const dueCronArr = el.due_cron.split(" ")
            if (dueCronArr[4 - 1] !== '*') {
                yearlyArr.push(el)
                return
            }
            else if (dueCronArr[3 - 1] !== '*') {
                monthlyArr.push(el)
                return
            }
            else if (dueCronArr[5 - 1] !== '*') {
                weeklyArr.push(el)
                return
            }
            else if (dueCronArr[2 - 1] !== '*') {
                dailyArr.push(el)
                return
            }
            else {
                console.log('wrong input')
                return
            }
        })
        //console.log(finEvents)
        return [dailyArr, weeklyArr, monthlyArr, yearlyArr]
    }

    render() {
        const dtArr = this.cycleEventsParser()
        const titleStrArr = ['at least daily', 'at least weekly', 'at least monthly', 'at least yearly']
        return (
            <div>
                <Row justify='center'>
                    <Col className='ms__title'>
                        Periodic Mission
                    </Col>
                </Row>
                <Row justify='center' >
                    <Col >
                        <PWInputRow />
                    </Col>
                </Row>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    {dtArr.map((el, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {!!el.length &&
                                    <Col xs={24} sm={12} lg={6}>
                                        {!!el.length &&
                                            <ScheCard titleStr={titleStrArr[idx]} dataArr={el} />}
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
                            <DropIcon tooltipStr={'drag event over to delete it'}
                                onDrop={(eID) => {
                                    this.props.dispatch(rmvCycleEvent(eID))
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
export default PeriodicMission = connect(state => ({
    ...state.cycleEvent
}))(PeriodicMission)