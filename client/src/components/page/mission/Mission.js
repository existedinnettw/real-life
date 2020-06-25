import React, { Component, useState } from 'react'
import {
    Row, Col, Divider,
    Input, DatePicker, Select, Button, Affix, Card, List, Typography, Tooltip, InputNumber
} from 'antd';
import 'antd/dist/antd.css'

import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'

import {
    PlusOutlined,
    CarryOutOutlined, ImportOutlined, ExportOutlined, DeleteOutlined,
} from '@ant-design/icons';
// import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { purple, grey } from '@ant-design/colors';
import { Safe_el, rm } from 'util/electronUtil'
import { remB } from 'util/constant'
import { motion } from "framer-motion"
// import Background from './background.jpg';
import { connect } from 'react-redux';
import eventSlice, { fetchEvent, addEvent, modEvent, rmvEvent } from 'state/eventSlice'
import moment from 'moment'

// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from 'react-dnd-html5-backend'
// import { TouchBackend } from 'react-dnd-touch-backend'

// import MultiBackend from 'react-dnd-multi-backend';
import { DndProvider, usePreview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import { ItemTypes } from 'util/constant'
import { useDrag, useDrop } from "react-dnd";
import { idEventFilter, todayEventsFilter, unDoneEventsFilter } from "util/filter"
import { CSSTransition } from "react-transition-group";

import './mission.css'


const { Option } = Select

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
        return (
            <Row justify='left'
                gutter={[{ xs: 4, sm: 16, md: 16, lg: 2 * remB }, { xs: 2, sm: 8, md: 8, lg: remB }]}>
                <Col xs={8}>
                    <Input placeholder="event summary"
                        value={this.state.summary}
                        onChange={e => this.setState({ summary: e.target.value })} />
                </Col>
                <Col xs={8}>
                    <Input placeholder="event target"
                        value={this.state.target}
                        onChange={e => this.setState({ target: e.target.value })} />
                </Col>
                <Col xs={8}>
                    <Input placeholder="event purpose"
                        value={this.state.purpose}
                        onChange={e => this.setState({ purpose: e.target.value })} />
                </Col>

                <Col xs={6}>
                    <DatePicker placeholder="init date" className="inputOption"
                        value={this.state.initTime}
                        onChange={(date, dS) => this.setState({ initTime: date })} />
                </Col>
                <Col xs={6}>
                    <DatePicker placeholder="due date" className="inputOption"
                        value={this.state.dueTime}
                        onChange={(date, dS) => this.setState({ dueTime: date })} />
                </Col>
                <Col xs={3}>
                    <InputNumber min={0.25} max={8} step={0.25}
                        value={this.state.expectTime}
                        formatter={value => `${value} hr`}
                        parser={value => value.replace('hr', '')}
                        onChange={val => this.setState({ expectTime: val })} />
                </Col>
                <Col xs={5} >
                    <Button onClick={this.handleSubmit}
                        icon={<PlusOutlined style={{ margin: 'auto', display: 'block' }} />}>
                    </Button>
                </Col>
            </Row>
        )
    }
}
RInputRow = connect(state => ({
    ...state.event
}))(RInputRow)

class PWInputRow extends Component {
    // render periodic work
    constructor(props) {
        super(props)
        this.state = {
            dueMonth: 1,
            dueDay: 1,
            workType: ['work', 'task', 'life'],
        }
        this.handleDateChange = this.handleDateChange.bind(this);
    }
    handleDateChange(date, dateString) {
        this.setState({ dueMonth: date })
    }
    render() {
        return (
            <Row justify='left' gutter={{ xs: 4, sm: 16, md: 16, lg: 3 * remB }}>
                <Col>
                    <Input placeholder="weekdays" style={{ width: '6rem' }} />
                </Col>
                <Col>
                    <Input placeholder="work name" />
                </Col>
                <Col>
                    <Select
                        showSearch
                        style={{ width: 80 }}
                        placeholder="Select work types"
                        className="inputOption"
                    >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                    </Select>
                </Col>
                <Col>
                    <Select
                        showSearch
                        style={{ width: 80 }}
                        placeholder="Expected time(min)"
                        className="inputOption"
                    >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
                    </Select>
                </Col>
                <Col style={{ marginBottom: 1.5 * remB }} >
                    <Button onClick icon={<PlusOutlined style={{ margin: 'auto', display: 'block' }} />}></Button>
                </Col>
            </Row>
        )
    }
}

const MyPreview = () => {
    const { display, itemType, item, style } = usePreview();
    if (!display) {
        return null;
    }
    return <div className="item-list__item ant-list-item" style={style}>{itemType}</div>;
};
function DraggableCard(props) {
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: ItemTypes.CARD, ...props },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging() //return true or false
        })
    });
    return (
        <div ref={dragRef} //
            className={`card`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
        >
            {props.event.summary}
            <MyPreview />
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
                <DraggableCard {...propsToColumn} />
                {/* <MyPreview key={`card-preview-${columnIndex}`} /> */}
            </div>
        )
    });
    return (
        <Card title={titleStr} style={{ opacity: 1, padding: '0.5rem' }}
            bodyStyle={{ backgroundColor: 'rgb(220,220,220)' }}>
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
    let className = 'interactive-icon-container' //default
    if (!isOver && canDrop) {
        //className='interactive-icon-container'
    } else if (isOver && canDrop) {
        className += ' interactive-icon-container-hover'
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
        const { events } = this.props
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
        return (
            <div>
                <Row justify='center'>
                    <Col className='title'>Mission</Col>
                </Row>
                <Row justify='center' >
                    <Col xs={21} lg={18} xxl={17}>
                        <RInputRow />
                    </Col>
                </Row>
                {/* <Divider style={{ backgroundColor: 'rgba(0,0,0,0)', color:'rgba()' }}></Divider> */}
                <div style={{ padding: '.3rem' }}></div>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard key={0} titleStr='outdated' dataArr={this.eventsFilter('outdated')} />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard key={1} titleStr='one week' dataArr={this.eventsFilter('oneWeek')} />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard key={2} titleStr='one month' dataArr={this.eventsFilter('oneMonth')} />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard key={3} titleStr='6 month' dataArr={this.eventsFilter('6Month')} />
                    </Col>
                </Row>
                <Affix offsetBottom={0}>
                    <Row justify='left' style={{ width: '80%', margin: '0 auto' }}>
                        <Col>
                            <DropIcon tooltipStr={'drag event over to mark event finished'}
                                onDrop={(eID) => {
                                    let event = idEventFilter(this.props.events, eID)
                                    let newEvent = { ...event, done_ts: moment() }
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
CurrentMission = connect(state => ({
    ...state.event
}))(CurrentMission)

class PWork extends Component {
    // render periodic work
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <Row justify='center' align="middle">
                    <Col className='title'>
                        Periodic work
                </Col>
                </Row>
                <Row justify='center' align="middle">
                    <Col style={{ fontSize: '1.5rem', margin: '0rem 1rem' }}>
                        Weekly:
                    </Col>
                    <Col>
                        <PWInputRow />
                    </Col>
                </Row>
                <Divider style={{ backgroundColor: 'rgba(0,0,0,0)' }}></Divider>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    <Col xs={24} md={12}>
                        <Card title='Daily' style={{ width: '90%' }}>
                            <List
                                bordered
                                dataSource={['item1', 'item2', 'item3']}
                                renderItem={item => (
                                    <List.Item>
                                        {item}
                                    </List.Item>
                                )}

                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title='Weekly' style={{ width: '90%' }}>
                            <List
                                bordered
                                dataSource={['item1', 'item2', 'item3']}
                                renderItem={item => (
                                    <List.Item>
                                        {item}
                                    </List.Item>
                                )}
                            />
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
class MissionConfig extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Row justify='center'>
                    <Col className='title'>
                        Config
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className='config-p'>
                        每日工時限制：
                        <InputNumber min={1} max={10} defaultValue={3} />
                    </Col>
                    <Col span={24} className='config-p'>
                        work 項目限制：
                        <InputNumber min={1} max={10} defaultValue={3} />
                    </Col>
                    <Col span={24} className='config-p'>
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
            className='float-box today-work-disp'
            style={{
                background: purple[3],
                boxShadow: `0 0 1rem ${grey[7]}`,
            }}>
            <Row justify='center' >
                <Col xs={24} className='title'>
                    Today work
                </Col>
                <Col xs={24} style={{ padding: '0 1.5rem' }}>
                    <List
                        split={false}
                        dataSource={todayEvents}
                        header={
                            <Row
                                style={{
                                    fontWeight: 600,
                                    color: 'black'
                                }}
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
                            <List.Item >
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
                className='float-box' style={carouselStyle} >

                <Carousel.Item>
                    {/* <DndProvider backend={TouchBackend} > */}
                    <DndProvider options={HTML5toTouch}>
                        {/* <DndProvider backend={MultiBackend} options={HTML5toTouch}> */}
                        <CurrentMission />
                        {/* <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption> */}
                    </DndProvider>
                </Carousel.Item>

                <Carousel.Item>
                    <PWork />
                </Carousel.Item>

                <Carousel.Item>
                    <MissionConfig />
                </Carousel.Item>

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
            workType: ['work', 'task', 'life'],
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
            <div className={'ms-root'} >
                <CSSTransition in={this.state.inProp} timeout={1000}
                    classNames="bg-fade-mask" unmountOnExit>
                        {/* remember className"s" is special for css group */}
                    <div style={{ padding: '2rem 1rem' }}>
                        <Row justify='center' >
                            <Col {...rwdColBP}>
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
