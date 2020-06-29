import React, { Component, useState, useEffect } from 'react'

import {
    Row, Col, Table, Radio, Divider, InputNumber, message
} from 'antd';
// import Button from 'react-bootstrap/Button'
import {
    BulbTwoTone
} from '@ant-design/icons';
import { Button } from 'antd';
import 'antd/dist/antd.css'

import Sound from 'react-sound';
import sound from './bensound-summer.mp3';

import Help from 'components/page/help/Help'

import { /*idEventFilter*/ todayEventsFilter, } from "util/filter"
import { /*fetchEvent,*/ modEvent } from 'state/eventSlice'
// import { checkLogin } from 'state/userSlice'

// import _ from 'lodash'
import { Safe_el } from 'util/electronUtil'
import moment from 'moment'
import { connect } from 'react-redux';
import { motion } from "framer-motion"

import veg_img from './img/comp-veg.gif' //https://create-react-app.dev/docs/adding-images-fonts-and-files/
import './whiteBoard.css'

function WBGreet(props) {
    const [now, setNow] = useState(moment())
    const [showHelp, setShowHelp] = useState(false)
    useEffect(
        () => {
            message.info('click bulb to get help...', [3], /*onclose*/)
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
    let timStr = `already veg ${timeHr}hr, ${timPst.minute()}min, ${timPst.second()}sec`
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
                <Row
                    className='wb-greet-mid-box wb-round-border wb-float-box'
                    align="middle"
                // justify="space-around"
                >
                    <Col xs={24}></Col>
                    <Col xs={24}>
                        <Row align="bottom">
                            <Col xs={16}
                                className='wb-text' >
                                I just want to veg out...
                                </Col>
                            <Col xs={8} >
                                <Button
                                    style={{
                                        width: '5rem', height: '5rem',
                                        border: 'none',
                                    }}
                                    ghost={true}
                                    icon={<BulbTwoTone
                                        style={{
                                            fontSize: '4rem',
                                        }}
                                    // className='wb-help-icon'
                                    />}
                                    shape="circle" size="large"
                                    onClick={() => {
                                        setShowHelp(true)
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} >
                        <img className="wb-veg-img wb-round-border wb-float-box" src={veg_img} />
                    </Col>
                    <Col xs={24} className='wb-text '>{timStr}</Col>
                    <Col xs={24} >
                        <Button size='large'
                            type='primary'
                            shape='round'
                            className='wb-lower-btn '
                            // style={{fontSize:'1rem'}}
                            onClick={props.onClick}>
                            work
                    </Button>
                    </Col>
                </Row>

            </motion.div>
            {
                showHelp && <Help cancelCB={() => { setShowHelp(false) }} />
            }
        </div>
    )
}


function WBChoice(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([props.tdEvents[0].id])
    const [workingEvent, setWorkingEvent] = useState(props.tdEvents[0])
    useEffect(() => {
        return () => {
            props.setWorkingEvent(workingEvent)
        }
    }, [workingEvent])
    const todayEvents = props.tdEvents
    // let colBP = { xs: Math.floor(24 / 5) }
    const columns = [
        { title: '[Summary]', dataIndex: 'summary', },
        {
            title: '[Target]', dataIndex: 'target', ellipsis: true
            /*ellipsis: {showTitle: false,} this not work since I set set onRow */
        },
        {
            title: '[Purpose]', dataIndex: 'purpose',
            responsive: ['xxl', 'xl',], ellipsis: { showTitle: false, }
        },
        {
            title: '[expectTime]', dataIndex: 'expect_time',
            ellipsis: true, responsive: ['xxl', 'xl', 'lg']
        },
        {
            title: '[DueTime]', dataIndex: 'due_time', defaultSortOrder: 'ascend',
            sorter: (a, b) => a.due_time - b.due_time, ellipsis: true,
            render: (text) => <>{moment.unix(text).format("M/D")}</>,
        },
        {
            title: '[timeSpent]', dataIndex: 'time_spent', ellipsis: true,
            render: (text) => <>{Number((text).toFixed(5))}</>,
            responsive: ['xxl', 'xl', 'lg', 'md']
        }
    ]
    const onSelectCB = (record) => {
        // console.log('select cb:',record)
        setSelectedRowKeys([record.id])
        setWorkingEvent(record)
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
        <div className="wb-choice" >
            <Col></Col>
            <Col className='wb-text'
                style={{ fontSize: '3rem' }}
            >
                Today work
                </Col>
            <Col>
                <div className="wb-table-box wb-float-box wb-round-border">
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
            <Col
                className="wb-text">
                {/* min={25} is ac */}
                <InputNumber min={1} max={120} defaultValue={props.expectWorkTime}
                    onChange={(value) => props.setExpectWorkTime(value)}
                /> min
                </Col>
            <Col >
                <Button size='large'
                    type='primary'
                    shape='round' className='wb-lower-btn'
                    onClick={props.onClick} >
                    start
                    </Button>
            </Col>
            <Col></Col>
        </div>
    )
}

class WBStart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            now: moment(),
        }
        this.interval = moment.duration(this.state.now.diff(this.props.startTime))

    }
    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState({ now: moment() })
            this.interval = moment.duration(this.state.now.diff(this.props.startTime))
        }, 1000);
        // console.log(this.state.play)
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
        let leftMin = Math.ceil(props.expectWorkTime - this.interval.as('minutes'))
        let timeStr = `${leftMin} min left`
        return (
            <div className="wb-start" >
                <Col></Col>
                <Col className='wb-text'>
                    {missionStr}
                </Col>
                <Col className='wb-text'>
                    {/* may be smaller font latter */}
                    {timeStr}
                </Col>
                <Col>
                    <Button
                        size='large'
                        type='primary'
                        shape='round'
                        className='wb-lower-btn'
                        onClick={
                            () => {
                                props.stopBtnCB()
                            }
                        }>
                        stop
                </Button>
                </Col>
                <Col>
                    {leftMin <= 0 &&
                        <Sound
                            // url="https://www.bensound.com/bensound-music/bensound-summer.mp3"
                            url={sound}
                            playStatus={Sound.status.PLAYING}
                        // playFromPosition={300 /* in milliseconds */}
                        // onLoading={this.handleSongLoading}
                        // onPlaying={this.handleSongPlaying}
                        // onFinishedPlaying={this.handleSongFinishedPlaying}
                        />}
                </Col>
            </div>
        )
    }
}

class WhiteBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workState: 'WB_greet', //'WB_choice'
            workingEvent: '',
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
                <div className='wb-main-float-box'>

                    {this.state.workState === 'WB_greet' &&
                        <WBGreet onClick={(e) => this.setState({ workState: 'WB_choice' })} />}
                    {this.state.workState === 'WB_choice' &&
                        <WBChoice onClick={(e) => {
                            this.setState({ workState: 'WB_start' })
                            this.startTime = moment()
                        }}
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
