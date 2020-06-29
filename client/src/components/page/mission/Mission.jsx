import React, { Component, useState } from 'react'
import {
    Row, Col, Divider,
    Input, Button, Card, List, Typography, InputNumber
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css'

import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'

// import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { purple, grey } from '@ant-design/colors';
import { Safe_el, rm } from 'util/electronUtil'
import { remB } from 'util/constant'
import { motion } from "framer-motion"
// import Background from './background.jpg';
import { connect } from 'react-redux';
import moment from 'moment'

import { DndProvider, usePreview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import CurrentMission from './CurrentMission'
import PeriodicMission from './PeriodicMission'
import { todayEventsFilter, } from "util/filter"
import { CSSTransition } from "react-transition-group";

import { styles } from './antStyle'
import './mission.css'

const MyPreview = () => {
    const { display, itemType, item, style } = usePreview();
    if (!display) {
        return null;
    }
    return (
        <div className="item-list__item ms__card-div-preview "
            style={style}
        >
            <div className="ms__card-div-preview-box">
                {item.event.summary}
            </div>
        </div >
    )
};




class MissionConfig extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Row justify='center'>
                    <Col className='ms__title'>
                        Config
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className='ms__config-p'>
                        每日工時限制：
                        <InputNumber min={1} max={10} defaultValue={3} />
                    </Col>
                    <Col span={24} className='ms__config-p'>
                        work 項目限制：
                        <InputNumber min={1} max={10} defaultValue={3} />
                    </Col>
                    <Col span={24} className='ms__config-p'>
                        work 刷新時間(起床時間)：
                        <InputNumber min={1} max={10} defaultValue={3} />
                    </Col>
                </Row>
                <Divider style={{ backgroundColor: 'rgba(0,0,0,0)' }}></Divider>
            </div>
        )
    }
}

function TodayWorkDisp(props) {
    const todayEvents = todayEventsFilter(props.events)
    let colBP = { xs: Math.floor(24 / 5) }
    const colTitle = ['[Summary]', '[Target]', '[Purpose]', '[expectTime]', '[DueTime]']
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 160,
                damping: 20
            }}
            className='ms__float-box today-work-disp'
            style={{
                background: purple[3],
                boxShadow: `0 0 1rem ${grey[7]}`,
            }}>
            <Row justify='center' >
                <Col xs={24} className='ms__title'>
                    Today work
                </Col>
                <Col xs={24} style={{ padding: '0 1.5rem' }}>
                    {/* list is not response, maybe switch to table */}
                    <List
                        gird={{ column: 4 }}
                        split={false}
                        dataSource={todayEvents}
                        header={
                            <Row
                                style={
                                    styles.antListHeader
                                    // this actually no the real head of ant list header
                                }
                                justify='space-around'>
                                {colTitle.map((item, idx) => {
                                    return (
                                        <Col {...colBP} key={idx} >
                                            <Typography.Text  >{item}</Typography.Text>
                                        </Col>
                                    )
                                })}
                            </Row>
                        }
                        renderItem={item => (
                            <List.Item style={styles.antListItem}>
                                <Row key={item.id}
                                    style={{
                                        width: '100%'
                                    }}
                                    justify='space-around'>
                                    {/* maybe use object literal? */}
                                    <Col {...colBP}>
                                        {item.summary}
                                    </Col>
                                    <Col {...colBP}>
                                        {item.target}
                                    </Col>
                                    <Col {...colBP}>
                                        {item.purpose}
                                    </Col>
                                    <Col {...colBP}>
                                        {item.expectTime}
                                        {}
                                    </Col>
                                    <Col {...colBP}>
                                        {moment.unix(item.due_time).format("M/D")}
                                    </Col>
                                </Row>
                            </List.Item>
                        )} />
                </Col>
            </Row>
        </motion.div>
    )
}
TodayWorkDisp = connect(state => ({
    ...state.event
}))(TodayWorkDisp)

function EventsDisp(props) {
    let carouselStyle = {
        background: `${purple[3]}`,
        boxShadow: `0 0 1rem ${grey[7]}`,
        minHeight: '40vh',//may del later
    }
    return (
        <motion.div initial={{ scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}>
            <Carousel interval={null} touch={false}
                className='ms__float-box ms__carousel' style={carouselStyle} >

                <Carousel.Item>
                    {/* <DndProvider backend={TouchBackend} > */}
                    <DndProvider options={HTML5toTouch}>
                        {/* <DndProvider backend={MultiBackend} options={HTML5toTouch}> */}
                        <CurrentMission />
                        <MyPreview />
                    </DndProvider>
                </Carousel.Item>

                <Carousel.Item>
                    <DndProvider options={HTML5toTouch}>
                        {/* <DndProvider backend={MultiBackend} options={HTML5toTouch}> */}
                        <PeriodicMission />
                        <MyPreview />
                    </DndProvider>
                </Carousel.Item>

                {/* <Carousel.Item>
                    <MissionConfig />
                </Carousel.Item> */}

            </Carousel>
        </motion.div>
    )
}
// function delayUnmounting(Component) {
//     //https://medium.com/@tomaszferens/delay-unmounting-of-the-component-in-react-8d6f6e73cdc
//     return class extends React.Component {
//         state = {
//             shouldRender: this.props.isMounted
//         };

//         componentDidUpdate(prevProps) {
//             if (prevProps.isMounted && !this.props.isMounted) {
//                 setTimeout(
//                     () => this.setState({ shouldRender: false }),
//                     this.props.delayTime
//                 );
//             } else if (!prevProps.isMounted && this.props.isMounted) {
//                 this.setState({ shouldRender: true });
//             }
//         }

//         render() {
//             return this.state.shouldRender ? <Component {...this.props} /> : null;
//         }
//     };
// }

class Mission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dueMonth: 1,
            dueDay: 1,
            inProp: false,
        }
    }
    componentDidMount() {
        Safe_el.check(() => {
            let currentWindow = rm.getCurrentWindow()
            currentWindow.setSize(1000, 1000)
        })
        //fetching data into store
        this.setState({ inProp: true })
    }

    render() {
        const rwdColBP = { xs: 23, lg: 21, xl: 20, xxl: 16 }
        return (
            <div className={'ms__root'} >
                <CSSTransition in={this.state.inProp} timeout={1000}
                    classNames="bg-fade-mask--ani" unmountOnExit>
                    {/* remember className"s" is special for css group */}
                    <div className='bg-fade-mask' style={{ padding: '2rem 1rem' }}>
                        <Row justify='center' >
                            <Col {...rwdColBP} xs={0} sm={24}>
                                <TodayWorkDisp />
                            </Col>
                        </Row>
                        <Row justify='center' style={{ margin: '0 0' }}>
                            <Col {...rwdColBP} >
                                <EventsDisp />
                            </Col>
                        </Row>

                        <Row style={{ width: '80%', margin: '0 auto', maxWidth: '1300px' }}>
                            {/* <Col >
                        <Button className='switch-icon-container' >
                            <CalendarOutlined className='switch-icon' />
                        </Button>
                    </Col>
                    <Col >
                        <Button className='switch-icon-container'>
                            <RedoOutlined className='switch-icon' />
                        </Button>
                    </Col>
                    <Col >
                        <Button className='switch-icon-container'>
                            <ToolOutlined className='switch-icon' />
                        </Button>
                    </Col> */}
                        </Row>
                    </div >
                </CSSTransition>
            </div>
        )
    }
}
//Mission=delayUnmounting(Mission)
export default connect(state => ({
    ...state.event
}))(Mission)
