import React, { Component, useState } from 'react'
import {
    Row, Col,
    Input, DatePicker, Button, Affix, Card, List, Typography, Tooltip, InputNumber
} from 'antd';
import {
    PlusOutlined, DeleteOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css'

import 'bootstrap/dist/css/bootstrap.min.css'

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

    // change datepicker to corn picker
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
                    <InputNumber min={0.25} max={8} step={0.25}
                        value={this.state.expectTime}
                        formatter={value => `${value} hr`}
                        parser={value => value.replace('hr', '')}
                        onChange={val => this.setState({ expectTime: val })} />
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