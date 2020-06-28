import React, { Component, useState } from 'react'

import {
    Row, Col,
    Input, Collapse, Alert, Button, Affix, Card, List, Typography, Tooltip, InputNumber, Radio
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, WarningTwoTone
} from '@ant-design/icons';
import 'antd/dist/antd.css'

import parser from 'cron-parser'

// import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { remB } from 'util/constant'
// import { motion } from "framer-motion"
// import Background from './background.jpg';
import { connect } from 'react-redux';
import eventSlice, { fetchEvent, addEvent, modEvent, rmvEvent } from 'state/eventSlice'
import moment from 'moment'

// import { ItemTypes } from 'util/constant'
// import { useDrag, useDrop } from "react-dnd";
// import { idEventFilter, unDoneEventsFilter } from "util/filter"
// import { CSSTransition } from "react-transition-group";

import { styles } from './antStyle'
import './mission.css'
import './periodic-mission.css'
import { useEffect } from 'react';

function CronTabInput(props) {
    const [value, setValue] = useState(1)
    const [min, setMin] = useState('*')
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
            const interval = moment(parser.parseExpression(`${min} ${hr} ${day} ${month} ${weekDay}`).next().toDate());
            setInterval(interval)
            // console.log(interval.next().toDate())
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
                    <CronTabInput header='init crontab' />
                </Col>
                <Col {...cronBP} >
                    <CronTabInput header='due crontab' />
                </Col>
                <Col {...backBp} >
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
    render() {
        return (
            <div>
                <Row justify='center'>
                    <Col className='ms__title'>
                        Periodic Mission
                    </Col>
                </Row>
                <Row justify='center' >
                    <Col xs={21} >
                        <PWInputRow />
                    </Col>
                </Row>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    <Col xs={24} md={12}>
                        <Card
                            bodyStyle={styles.antCardBody}
                            className='ms__ant-card'
                            title='Daily' style={{ width: '90%' }}>
                            {/* <List
                                bordered
                                dataSource={['item1', 'item2', 'item3']}
                                renderItem={item => (
                                    <List.Item>
                                        {item}
                                    </List.Item>
                                )}
                            /> */}
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card
                            className='ms__ant-card'
                            bodyStyle={styles.antCardBody}
                            title='Weekly' style={{ width: '90%' }}>
                            {/* <List
                                bordered
                                dataSource={['item1', 'item2', 'item3']}
                                renderItem={item => (
                                    <List.Item>
                                        {item}
                                    </List.Item>
                                )}
                            /> */}
                        </Card>
                    </Col>
                </Row>
                <Row justify='center' style={{ width: '80%', margin: '0 auto' }}>
                    <Col><DeleteOutlined className='interactive-icon' /></Col>
                </Row>
            </div>
        )
    }
}
export default PeriodicMission = connect(state => ({
    ...state.event
}))(PeriodicMission)