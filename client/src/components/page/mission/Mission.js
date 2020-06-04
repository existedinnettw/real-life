import React, { Component } from 'react'
import { Row, Col, Divider } from 'antd';
import { Tabs, Input, DatePicker, Select, Button, Card, List, Typography, InputNumber } from 'antd';
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import './mission.css'
import { PlusOutlined, DeleteOutlined, CarryOutOutlined, CloseOutlined } from '@ant-design/icons';
import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'
import { purple, grey } from '@ant-design/colors';
import { Safe_el, rm } from 'util/electronUtil'
import { remB } from 'util/constant'
import { getEvents, addEvent } from 'api/event'
import { motion } from "framer-motion"
import Background from './background.jpg';

const { Option } = Select
const { TabPane } = Tabs;


class RInputRow extends Component {
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

    //render place for input
    render() {
        return (
            <Row justify='left' gutter={{ xs: 4, sm: 16, md: 16, lg: 3 * remB }}>
                <Col>
                    <Input placeholder="work name" />
                </Col>
                <Col >
                    <DatePicker placeholder="due date" className="inputOption" onChange={this.handleDateChange} />
                </Col>
                <Col>
                    <Select
                        showSearch
                        style={{ width: 80 }}
                        placeholder="work types"
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
function ScheCard(props) {
    let { titleStr } = props
    //render schedule card
    return (
        <Card title={titleStr} style={{ width: '90%' }}>
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
    )
}
class CurrentMission extends Component {
    render() {
        return (
            <div>
                <Row justify='center'>
                    <Col className='title'>
                        Mission
                    </Col>
                </Row>
                <Row justify='center' >
                    <Col xs={21} lg={18} xxl={17}>
                        <RInputRow />
                    </Col>
                </Row>
                <Divider style={{ backgroundColor: 'rgba(0,0,0,0)' }}></Divider>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    <Col xs={24} sm={12} md={6}>
                        < ScheCard titleStr='outdated' />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        < ScheCard titleStr='one week' />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        < ScheCard titleStr='one month' />
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        < ScheCard titleStr='6 month' />
                    </Col>
                </Row>
                <Row justify='left' style={{ width: '80%', margin: '0 auto' }}>
                    <Col>
                        <CarryOutOutlined className='interactive-icon' />
                    </Col>
                    <Col>
                        <CloseOutlined className='interactive-icon' />
                    </Col>
                    <Col><DeleteOutlined className='interactive-icon' /></Col>
                </Row>

            </div>
        )
    }
}
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
    }
    renderCarousel() {
        let carouselStyle = {
            background: `${purple[3]}`,
            overflow: 'hidden',
            color: 'white',
            minHeight: '40vh',
            borderRadius: '1rem', boxShadow: `0 0 1rem ${grey[7]}`, opacity: '0.96 '
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
                        <CurrentMission />
                        {/* <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption> */}
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
    tabPaneRender(workTypeStr) {
        return (
            <TabPane tab={workTypeStr} key={workTypeStr} >
                <List
                    bordered
                    dataSource={['item1', 'item2', 'item3']}
                    renderItem={item => (
                        <List.Item>
                            {item}
                        </List.Item>
                    )}
                    style={{ margin: '0 auto', minWidth: '400px', width: '50vw' }}
                />
            </TabPane>
        )
    }
    render() {
        return (
            <div style={{}}>
                <Row justify='center' style={{ padding: '3rem 1rem 1rem 1rem' }}>
                    <motion.div initial={{ scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 160,
                            damping: 20
                        }}>
                        <Col className='title' style={{
                            background: purple[3], color: 'white', padding: '1rem',
                            borderRadius: '1rem', boxShadow: `0 0 1rem ${grey[7]}`, opacity: '0.98'
                        }} >

                            Today work

                        <Tabs defaultActiveKey="work" >
                                {this.state.workType.map((x, idx) => {
                                    return this.tabPaneRender(x)
                                })}
                            </Tabs>

                        </Col>
                    </motion.div>
                </Row>
                <Row justify='center' style={{ margin: '0 2rem' }}>
                    <Col xs={23} lg={21} xl={20} xxl={16}>
                        {this.renderCarousel()}
                    </Col>
                </Row>
                <Row style={{ width: '80%', margin: '0 auto', maxWidth: '1300px' }}>
                    <Col >
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
                    </Col>
                </Row>

            </div>
        )
    }
}

export default Mission
