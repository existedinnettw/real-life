import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import './whiteBoard.css'
import veg_img from './veg.gif' //https://create-react-app.dev/docs/adding-images-fonts-and-files/
import Form from 'react-bootstrap/Form'
import _ from 'lodash'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

//const electron = require('electron') //this will fail
//const {ipcRender}=electron
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer = electron.ipcRenderer;
const currentWindow = electron.remote.getCurrentWindow()
var remB = 16 //getComputedStyle(document.documentElement).fontSize //this is string

class WhiteBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //config: {},
            choosedMission: '',
            choosedTime: 30,
            todayWkData: new Array(), //should init, or the first render will cause problem
            workState: 'WB', //'WB_choice'
            timNow: new Date(),
            tickIntervalId: 0,
        }
        this.radioFormRef = React.createRef()
        this.missionType = 'work'
        this.tabsSelect = {
            'work': null,
            'task': null,
            'life': null
        }
        this.startClockTime = new Date()
        //this.radioValue
        this.start_btn_click = this.start_btn_click.bind(this)
        this.handleTabSelec = this.handleTabSelec.bind(this)
        this.handleRadioChng = this.handleRadioChng.bind(this)
    }

    getWBConfig() {
        // let allConfig = JSON.parse(fs.readFileSync('./src/page/config.json', 'utf8'));
        // let WBConf = allConfig['WB']
        // this.setState({ config: WBConf })
    }
    componentDidMount() {
        let intervalId = setInterval(() => {
            this.setState({ timNow: new Date() })
        }, 1000);
        this.setState({ tickIntervalId: intervalId })
        //https://www.hawatel.com/blog/handle-window-resize-in-react/
        this.getWBConfig()

        //read today work data
        let todayWkDataRd = JSON.parse(fs.readFileSync('./src/page/todayWork.json', 'utf8'));
        this.setState({ todayWkData: todayWkDataRd })

        //window.addEventListener("resize", this.updateDimensions);
        
    }
    componentWillUnmount() {
        clearInterval(this.state.tickIntervalId);
        //https://stackoverflow.com/questions/38564080/remove-event-listener-on-unmount-react
        //window.removeEventListener("resize", this.updateDimensions);
        this.rollBackNormalWin()
    }
    render_wb() {
        let timPst = new Date()
        timPst.setHours(6)
        //let timStr= timNow-timPst
        // reset day start time to specic hour
        let timeHr = this.state.timNow.getHours() - timPst.getHours()
        if (timeHr < 0) {
            timeHr += 24
        }
        let timStr = `本日已耍廢 ${timeHr}hr, ${this.state.timNow.getMinutes()}min, ${this.state.timNow.getSeconds()}sec`
        return (
            <div>
                <Container className=' compContainer' >
                    <Row className="h-100 align-items-center mx-auto">
                        <Col xs={12} className='time-str ' >I just wanna veg...</Col>
                        <Col xs={12} className=''><img className="vegImg img-thumbnail img-fluid" src={veg_img} /></Col>
                        <Col xs={12} className='time-str '>{timStr}</Col>
                        <Col xs={12} className=''>
                            <Button className='lowerBtn' onClick={(e) => this.setState({ workState: 'WB_choice' })}>work</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    handleRadioChng(e) {
        this.tabsSelect[this.missionType] = e.target.value
    }
    getRadioWorkList(data, workType) {
        let fData = data.filter(function (mission) {
            return mission['type'] === workType
        })

        return (
            <Form ref={this.radioFormRef} onChange={this.handleRadioChng}>
                <div className='mb-3'>
                    {fData.map((mission, idx) => {
                        let name = mission['name']
                        let defaultCheck = false
                        if (idx === 0) {
                            defaultCheck = true
                        }
                        return (
                            <Form.Check custom className='workOption' type='radio' id={`${name}-${idx}`}
                                key={`${name}-${idx}`} value={name} name='selectWork' label={name}
                            />
                        )
                    })}
                </div>
            </Form>
        )
    }
    handleTabSelec(e) {
        this.missionType = e
    }
    start_btn_click(e) {
        if (this.tabsSelect[this.missionType] === null) {
            //no input
            return
        }
        // normal case trans to other page
        this.setState({ workState: 'WB_start' })
        this.setState({ timNow: new Date() })
        this.startClockTime = new Date()
        
    }
    render_choice() {
        let timeArr = _.range(5, 95, 5);
        let tabsArr = ['work', 'task', 'life']
        return (
            <div>
                <Container className='compContainer'>
                    <Row className="h-100 align-items-center">
                        <Col xs={12} className='time-str'>Today work</Col>
                        <Col xs={12} >
                            <div className="tabsBox ">
                                <Tabs defaultActiveKey={this.missionType} id="work-select-tab" style={{ marginBottom: remB }}
                                    onSelect={this.handleTabSelec}>
                                    {tabsArr.map((tab) => {
                                        //some problem in tab, cause warning "findDOMNode is deprecated in StrictMode". 
                                        return (
                                            <Tab eventKey={tab} title={tab} key={`tab-${tab}`} >
                                                {this.getRadioWorkList(this.state.todayWkData, tab)}
                                            </Tab>)
                                    })}
                                </Tabs>
                            </div>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId='wkMinSelect' className='mx-auto'>
                                <Form.Label style={{ display: 'inline' }} className='remindText'>
                                    <Form.Control as="select" value={this.state.choosedTime}
                                        onChange={(e) => { this.setState({ choosedTime: e.target.value }) }}
                                        placeholder="minutes" className='minuteSelect' custom>
                                        {timeArr.map((i) => {
                                            return <option key={i} className='selectOpt'> {i}</option>
                                        })}
                                    </Form.Control>

                                    {` min left`}
                                </Form.Label>
                            </Form.Group>
                        </Col>
                        <Col xs={12} className=''>
                            <Button className='lowerBtn' onClick={this.start_btn_click} >start</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    render_start() {
        //console.log(this.state.choosedMission)
        //let mission = this.state.config['mission']
        let missionStr = `To do: ${this.tabsSelect[this.missionType]}`
        //let timeLefMin = this.state.config['leftMin']
        let leftTime = this.state.timNow - this.startClockTime
        leftTime = Math.floor(leftTime / 1000 / 60)  //ms to min
        let timeStr = `${this.state.choosedTime - leftTime} min left`
        return (
            <div>
                <Container className='compContainer' style={{minWidth:50,minHeight:50}}>
                    <Row className="h-100 align-items-center">
                        <Col xs={12} className='mission-str'>{missionStr}</Col>
                        <Col xs={12} className='count-time-str'>{timeStr}</Col>
                    </Row>
                </Container>
            </div>
        )
    }
    rollBackNormalWin(){
        currentWindow.setAlwaysOnTop(false, 'screen');
        currentWindow.setSize(800,600)
    }
    render() {
        if(this.state.workState==='WB_start'){
            currentWindow.setAlwaysOnTop(true, 'screen');
            currentWindow.setSize(300,150)
        }else{
            this.rollBackNormalWin()
        }

        if (this.state.workState === 'WB') {
            return this.render_wb()
        } else if (this.state.workState === 'WB_choice') {
            return this.render_choice()
        } else if (this.state.workState === 'WB_start') {
            return this.render_start()
        } else {
            //browser router?
            return 404
        }
    }
}


export default WhiteBoard