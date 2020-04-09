import React, { Component } from 'react'
import { Row, Col, Divider } from 'antd';
import { Tabs, Input, DatePicker, Select, Button, Card, List, Typography, InputNumber } from 'antd';
import Carousel from 'react-bootstrap/Carousel'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import './mission.css'
import { PlusSquareOutlined, PlusOutlined, DeleteOutlined, CarryOutOutlined, CloseOutlined } from '@ant-design/icons';
import { CalendarOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons'

const { Option } = Select
const { TabPane } = Tabs;
const electron = window.require('electron');
const currentWindow = electron.remote.getCurrentWindow()
const fs = electron.remote.require('fs');

var remB = 16


class Mission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dueMonth: 1,
            dueDay: 1,
            workType: ['work', 'task', 'life'],
        }
        this.handleDateChange = this.handleDateChange.bind(this);
    }
    componentDidMount() {
        // let todayWkDataRd = JSON.parse(fs.readFileSync('./src/page/todayWork.json', 'utf8'));
        // this.setState({ todayWkData: todayWkDataRd })
        currentWindow.setSize(1000,1000)
    }
    handleDateChange(date, dateString) {
        this.setState({ dueMonth: date })
    }
    rInputRow() {
        return (
            <Row justify='left' gutter={{ xs: 4, sm: 16, md: 16, lg: 3 * remB }}>
                <Col>
                    <Input placeholder="work name" />
                </Col>
                <Col >
                    <DatePicker className="inputOption" onChange={this.handleDateChange} />
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

            </Row>
        )
    }
    rScheCard(titleStr) {
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
    plusBtn() {
        return (
            <Button icon={<PlusOutlined style={{ margin: 'auto', display: 'block' }} />}></Button>
        )
    }
    rCMission() {
        return (
            <div>
                <Row justify='center'>
                    <Col className='title'>
                        Mission
                    </Col>
                </Row>
                <Row justify='center' >
                    <Col xs={21} lg={18} xxl={17}>
                        <Row justify='left' gutter={{ xs: 4, sm: 16, md: 16, lg: 3 * remB }} >
                            <Col >
                                {this.rInputRow()}
                            </Col>
                            <Col style={{ marginBottom: 1.5 * remB }} >
                                {this.plusBtn()}
                            </Col>

                            <Col >
                                {this.rInputRow()}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Divider style={{ backgroundColor: 'rgba(0,0,0,0)' }}></Divider>
                <Row justify='center' style={{ width: '90%', margin: '0 auto' }}>
                    <Col xs={24} sm={12} md={6}>
                        {this.rScheCard('outdated')}
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        {this.rScheCard('one week')}
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        {this.rScheCard('one month')}
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        {this.rScheCard('6 month')}
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
    rPWInputRow() {
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

            </Row>
        )
    }
    rCPWork() {
        return (
            <div>
                <Row justify='center'>
                    <Col className='title'>
                        Periodic work
                    </Col>
                </Row>
                <Row justify='center' >
                    <Col style={{ alignSelf: 'center', fontSize: '1.5rem', margin: '1rem 1.5rem' }}>
                        Weekly:
                    </Col>
                    <Col xs={21} lg={18} xxl={17}>
                        <Row justify='left' gutter={{ xs: 4, sm: 16, md: 16, lg: 2 * remB }} >
                            <Col >
                                {this.rPWInputRow()}
                            </Col>
                            <Col style={{ marginBottom: 1.5 * remB }} >
                                {this.plusBtn()}
                            </Col>

                            <Col >
                                {this.rPWInputRow()}
                            </Col>
                        </Row>
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
    rCConfig() {
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
    renderCarousel() {
        return (
            <Carousel interval={null}>

                <Carousel.Item>
                    {this.rCMission()}
                    {/* <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption> */}
                </Carousel.Item>

                <Carousel.Item>
                    {this.rCPWork()}
                </Carousel.Item>

                <Carousel.Item>
                    {this.rCConfig()}
                </Carousel.Item>

            </Carousel>)
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
        const props = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <div>
                <Row justify='center' style={{ margin: '1rem' }}>
                    <Col span={24} className='title' >
                        Today work
                    </Col>
                    <Col span={24}>
                        <Tabs defaultActiveKey="work" >
                            {this.state.workType.map((x, idx) => {
                                return this.tabPaneRender(x)
                            })}
                        </Tabs>
                    </Col>
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
