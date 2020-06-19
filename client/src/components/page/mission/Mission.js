import React, { Component, useState } from 'react'
import { Row, Col, Divider } from 'antd';
import { Tabs, Input, DatePicker, Select, Button, Affix, Card, List, Typography, Tooltip, InputNumber } from 'antd';
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import './mission.css'
import { PlusOutlined, DeleteOutlined, CarryOutOutlined, CloseOutlined } from '@ant-design/icons';
import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { purple, grey } from '@ant-design/colors';
import { Safe_el, rm } from 'util/electronUtil'
import { remB } from 'util/constant'
import { motion } from "framer-motion"
import Background from './background.jpg';
import { connect } from 'react-redux';
import eventSlice, { fetchEvent, addEvent, rmvEvent } from 'state/eventSlice'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ItemTypes } from 'util/constant'
import { useDrag, useDrop } from "react-dnd";


const { Option } = Select
const { TabPane } = Tabs;


class RInputRow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            summary: '', //or null, db col should be non null
            target: '',
            purpose: '',
            initTime: moment(), //moment object, when transfer use moment.unix()
            dueTime: moment(),
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
            <Row justify='left' gutter={[{ xs: 4, sm: 16, md: 16, lg: 2 * remB }, { xs: 2, sm: 8, md: 8, lg: remB }]}>
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
                <Col xs={5} style={{ marginBottom: 1.5 * remB }} >
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
        </div>
    );
};

function ScheCard(props) {
    let { titleStr, dataArr } = props
    //render schedule card
    const columns = dataArr.map((event, columnIndex) => {
        const propsToColumn = { event };
        return (<DraggableCard key={`column ${columnIndex}`} {...propsToColumn} />)
    });
    return (
        <Card title={titleStr} style={{ opacity: 1, padding: '0.5rem' }} bodyStyle={{ backgroundColor: 'rgb(220,220,220)' }}>
            {columns}
        </Card>
    )
}

function DropIcon({ tooltipStr, onDrop, children }) {
    const [bottom, setBottom] = useState(0);
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
        <Affix offsetBottom={bottom}>
            <Tooltip title={tooltipStr}>
                <Button ref={drop}
                    className={className}
                >
                    {children}
                </Button>
            </Tooltip>
        </Affix>
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
                <Divider style={{ backgroundColor: 'rgba(0,0,0,0)' }}></Divider>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard titleStr='outdated' dataArr={this.eventsFilter('outdated')} />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard titleStr='one week' dataArr={this.eventsFilter('oneWeek')} />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard titleStr='one month' dataArr={this.eventsFilter('oneMonth')} />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        < ScheCard titleStr='6 month' dataArr={this.eventsFilter('6Month')} />
                    </Col>
                </Row>
                <Row justify='left' style={{ width: '80%', margin: '0 auto' }}>
                    <Col>
                        <DropIcon onDrop={(eID) => { }}>
                            <CarryOutOutlined className='interactive-icon' />
                        </DropIcon>
                    </Col>
                    <Col>
                        <DropIcon onDrop={(eID) => { }}>
                            <CloseOutlined className='interactive-icon' />
                        </DropIcon>
                    </Col>
                    <Col>
                        <DropIcon tooltipStr={'drag event over to delete it'}
                            onDrop={(eID) => { this.props.dispatch(rmvEvent(eID)) }}>
                            <DeleteOutlined className='interactive-icon' />
                        </DropIcon>
                    </Col>
                </Row>

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
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 160,
                damping: 20
            }}>
            <Row justify='center' >
                <Col xs={24} className='title'>
                    Today work
            </Col>
                <Col xs={24} style={{ padding: '0 1.5rem' }}>
                    <List
                        split={false}
                        dataSource={props.events}

                        header={
                            <Row
                                style={{
                                    fontWeight: 600
                                }}>
                                <Col xs={6}>
                                    <Typography.Text keyboard="true" >[Summary]</Typography.Text>
                                </Col>
                                <Col xs={6}>
                                    <Typography.Text keyboard="true" >[Target]</Typography.Text>
                                </Col>
                                <Col xs={6}>
                                    <Typography.Text keyboard="true" >[Purpose]</Typography.Text>
                                </Col>
                                <Col xs={6}>
                                    <Typography.Text keyboard="true" >[DueTime]</Typography.Text>
                                </Col>
                            </Row>
                        }
                        renderItem={item => (
                            <List.Item >
                                <Row
                                    style={{
                                        width: '100%'
                                    }}>
                                    <Col xs={6}>
                                        {item.summary}
                                    </Col>
                                    <Col xs={6}>
                                        {item.target}
                                    </Col>
                                    <Col xs={6}>
                                        {item.purpose}
                                    </Col>
                                    <Col xs={6}>
                                        {item.due_time}
                                    </Col>
                                </Row>
                            </List.Item>
                        )} />
                </Col>
            </Row>
        </motion.div>
    )
}
TodayWorkDisp= connect(state => ({
    ...state.event
}))(TodayWorkDisp)

class Mission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dueMonth: 1,
            dueDay: 1,
            workType: ['work', 'task', 'life'],

        }

    }
    componentDidMount() {
        Safe_el.check(() => {
            let currentWindow = rm.getCurrentWindow()
            currentWindow.setSize(1000, 1000)
        })
        let { chngLayoutStyle } = this.props
        chngLayoutStyle({

            backgroundImage: `linear-gradient(to bottom, rgba(213, 184, 255, 0.5), rgba(0,0,0,0.5)), url(${Background})`,
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        })
        //fetching data into store
    }

    renderCarousel() {
        let carouselStyle = {
            background: `${purple[3]}`,
            overflow: 'hidden',
            color: 'white',
            minHeight: '40vh',
            borderRadius: '1rem', boxShadow: `0 0 1rem ${grey[7]}`, opacity: '0.96 ',
        }
        return (
            <motion.div initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}>
                <Carousel interval={null} style={carouselStyle}>

                    <Carousel.Item>
                        <DndProvider backend={HTML5Backend}>
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
    render() {
        const rwdColBP = { xs: 23, lg: 21, xl: 20, xxl: 16 }
        return (
            <div style={{
                padding: '2rem 1rem'
            }}>
                <Row justify='center'>
                    <Col {...rwdColBP}
                        style={{
                            background: purple[3], color: 'white',
                            borderRadius: '1rem', boxShadow: `0 0 1rem ${grey[7]}`, opacity: '0.98',
                            margin: '1.5rem 1rem 2rem 1rem',
                            padding: '0 0 1rem 0'
                        }}
                    >
                        <TodayWorkDisp/>
                    </Col>
                </Row>
                <Row justify='center' style={{ margin: '0 0' }}>
                    <Col {...rwdColBP} >
                        {this.renderCarousel()}
                    </Col>
                </Row>
                <Button>
                    {/* these place have to remove later */}
                    <a href={`${process.env.BASE_URL}/auth/google`}>
                        Click here to login
                    </a>
                </Button>
                <Button onClick={() => {
                    this.props.dispatch(fetchEvent())
                }}>
                    load data
                </Button>

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
        )
    }
}

export default connect(state => ({
    ...state.event
}))(Mission)
