import React, { Component, useState, useEffect } from 'react'

import {
    Row, Col, Table, Radio, Divider, InputNumber
} from 'antd';
// import Button from 'react-bootstrap/Button'

import { Button } from 'antd';
import 'antd/dist/antd.css'

import { /*idEventFilter*/ todayEventsFilter, } from "util/filter"
import { /*fetchEvent,*/ modEvent } from 'state/eventSlice'
// import { checkLogin } from 'state/userSlice'

// import _ from 'lodash'
import { Safe_el } from 'util/electronUtil'
import moment from 'moment'
import { connect } from 'react-redux';
import { motion } from "framer-motion"

import veg_img from './comp-veg.gif' //https://create-react-app.dev/docs/adding-images-fonts-and-files/
import './whiteBoard.css'

function WBGreet(props) {
    const [now, setNow] = useState(moment())
    useEffect(
        () => {
            const intervalId = setInterval(() => {
                setNow(moment())
            }, 1000)
            return () => {
                clearInterval(intervalId);
            }
        }, []
    )
    let timPst = moment()
    timPst.hour(6)
    let timeHr = now.hour() - timPst.hour()
    if (timeHr < 0) {
        timeHr += 24
    }
    let timStr = `本日已耍廢 ${timeHr}hr, ${timPst.minute()}min, ${timPst.second()}sec`
    return (
        <div className="wb-greet">
            <motion.div initial={{ scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                <Row style={{minHeight:'80vh'}} className='wb-greet-mid-box round-border float-box' >
                    <Col xs={24}></Col>
                    <Col xs={24} className='time-str float-box' >I just wanna veg...</Col>
                    <Col xs={24} className=''>
                        <img className="veg-img round-border float-box" src={veg_img} />
                    </Col>
                    <Col xs={24} className='time-str '>{timStr}</Col>
                    <Col xs={24} className=''>
                        <Button size='large'
                            type='primary'
                            shape='round'
                            className='lowerBtn'
                            onClick={props.onClick}>
                            work
                    </Button>
                    </Col>
                </Row>

            </motion.div>
        </div>
    )
}


function WBChoice(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const todayEvents = props.tdEvents
    // let colBP = { xs: Math.floor(24 / 5) }
    const columns = [
        { title: '[Summary]', dataIndex: 'summary' },
        { title: '[Target]', dataIndex: 'target' },
        { title: '[Purpose]', dataIndex: 'purpose' },
        { title: '[expectTime]', dataIndex: 'expect_time' },
        {
            title: '[DueTime]', dataIndex: 'due_time', defaultSortOrder: 'ascend',
            sorter: (a, b) => a.due_time - b.due_time,
            render: (text) => <>{moment.unix(text).format("M/D")}</>
        },
        {
            title: '[timeSpent]', dataIndex: 'time_spent',
            render: (text) => <>{Number((text).toFixed(5))}</>
        }
    ]
    const onSelectCB = (record) => {
        // console.log('select cb:',record)
        setSelectedRowKeys([record.id])
        props.setWorkingEvent(record)
    }
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onSelect: (record, selected, selectedRows, nativeEvent) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // console.log('selectedRows: ', selectedRows)
            onSelectCB(record)
        },
    };
    return (
        <div>
            <Row className="wb-choice" align="middle">
                <Col xs={24} className='time-str'>Today work</Col>
                <Col xs={24} >
                    <div className="table-box round-border">
                        <Table
                            rowKey="id"
                            rowSelection={{
                                type: "radio",
                                ...rowSelection,
                            }}
                            onRow={(record) => ({
                                onClick: () => {
                                    //console.log('onRow record:',record)
                                    onSelectCB(record)
                                },
                            })}
                            columns={columns}
                            dataSource={todayEvents}
                        />
                    </div>
                </Col>
                <Col xs={24}>
                    <InputNumber min={25} max={120} defaultValue={props.expectWorkTime}
                        onChange={(value) => props.setExpectWorkTime(value)}
                    /> min
                </Col>
                <Col xs={24} className=''>
                    <Button size='large'
                        type='primary'
                        shape='round' className='lowerBtn'
                        onClick={props.onClick} >
                        start
                    </Button>
                </Col>
            </Row>
        </div >
    )
}

class WBStart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            now: moment()
        }
        this.interval = moment.duration(this.state.now.diff(this.props.startTime))

    }
    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({ now: moment() })
            this.interval = moment.duration(this.state.now.diff(this.props.startTime))
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
        const interval = this.interval
        // console.log('wb_start unmount', interval.as('seconds'), interval.as('minutes'), interval.as('hours'))
        //this place is why I use class component
        this.props.unMountCB(this.props.workingEvent, interval.as('hours'))
    }

    render() {
        const props = this.props
        // console.log(this.interval.as('minutes'))
        let missionStr = `To do: ${props.workingEvent.summary}`
        let timeStr = `${Math.ceil(props.expectWorkTime - this.interval.as('minutes'))} min left`
        return (
            <Row className="wb-start" align="middle">
                <Col xs={24} className='mission-str'>{missionStr}</Col>
                <Col xs={24} className='count-time-str'>{timeStr}</Col>
                <Col xs={24}>
                    <Button
                        size='large'
                        type='primary'
                        shape='round'
                        className='lowerBtn'
                        onClick={
                            () => {
                                props.stopBtnCB()
                            }
                        }>
                        stop
                </Button>
                </Col>
            </Row>
        )
    }
}

class WhiteBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workState: 'WB_greet', //'WB_choice'
            workingEvent: null,
            expectWorkTime: 60, //defautl value
        }
        this.startTime = moment()
    }
    componentDidMount() {
        //load user data
        //read today work data
        Safe_el.check(() => {
            let fs = Safe_el.el.remote.require('fs');
            let todayWkDataRd = JSON.parse(fs.readFileSync('./src/page/todayWork.json', 'utf8'));
            this.setState({ todayWkData: todayWkDataRd })
        })

    }

    componentWillUnmount() {
        this.rollBackNormalWin()
    }
    startBtnClick() {
        this.setState({ workState: 'WB_start' })
        this.startTime = moment()
    }
    rollBackNormalWin() {
        Safe_el.check(() => {
            let currentWindow = Safe_el.el.remote.getCurrentWindow()
            currentWindow.setAlwaysOnTop(false, 'screen');
            currentWindow.setSize(800, 600)
        })

    }
    render() {
        if (this.state.workState === 'WB_start') {
            Safe_el.check(() => {
                let currentWindow = Safe_el.el.remote.getCurrentWindow()
                currentWindow.setAlwaysOnTop(true, 'screen');
                currentWindow.setSize(300, 150)
            })
            //window.resizeTo(300,150) //不能设置那些不是通过 window.open 创建的窗口或 Tab 的大小。

        } else {
            this.rollBackNormalWin()
        }

        return (
            <div className='wb-root' >
                <div className='main-float-box'>

                    {this.state.workState === 'WB_greet' &&
                        <WBGreet onClick={(e) => this.setState({ workState: 'WB_choice' })} />}
                    {this.state.workState === 'WB_choice' &&
                        <WBChoice onClick={(e) => this.startBtnClick()}
                            tdEvents={todayEventsFilter(this.props.events)}
                            expectWorkTime={this.state.expectWorkTime}
                            setExpectWorkTime={(expectWorkTime) => {
                                this.setState({ expectWorkTime })
                                //console.log(expectWorkTime)
                            }}
                            setWorkingEvent={(workingEvent) => {
                                this.setState({ workingEvent })
                                //console.log(workingEvent)
                            }}
                        />}
                    {this.state.workState === 'WB_start' &&
                        <WBStart expectWorkTime={this.state.expectWorkTime} startTime={this.startTime}
                            workingEvent={this.state.workingEvent}
                            stopBtnCB={() => {
                                this.setState({ workState: 'WB_greet' })
                            }}
                            unMountCB={(event, timeSpent) => {
                                let newEvent = { ...event }
                                newEvent.time_spent += timeSpent
                                this.props.dispatch(modEvent(newEvent))
                            }}
                        />
                    }
                    {/* <Button
                    onClick={() => {
                        this.props.dispatch(fetchEvent())
                    }}>
                    load data
                </Button> */}
                </div>
            </div>
        )
    }
}
WhiteBoard = connect(state => ({
    // ...state,
    ...state.event
}))(WhiteBoard)


export default WhiteBoard
