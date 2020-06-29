import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchEvent } from 'state/eventSlice'
import { fetchCycleEvent } from 'state/cycleEventSlice'
import { checkLogin } from 'state/userSlice'

import NavBar from './navBar/NavBar'
import WhiteBoard from './page/whiteBoard/WhiteBoard'
import Mission from './page/mission/Mission'
// import Analysis from './page/analysis/Analysis'
import './app.css'


//this file is same as "main.js"
class Layout extends Component {
    //an hoc type, called Containment
    constructor(props) {
        super(props)
        this.state = {
            layoutStyle: {},
        }
        this.navItemsName = {
            'White Board': '/whiteboard/',
            'Mission': '/mission/',
        }
    }

    render() {
        return (
            <div style={this.state.layoutStyle}>
                <NavBar style={{ zIndex: 99 }} navItemsName={this.navItemsName} />
                <Switch>
                    <Route path="/" exact component={WhiteBoard} />
                    <Route path="/whiteBoard" render={(props) => <WhiteBoard {...props} />} />
                    <Route path="/mission/" render={(props) => <Mission {...props} />} />
                    {/* <Route path='/analysis/' component={Analysis} /> */}
                </Switch>

            </div>
        )
    }
}

class App extends Component {
    componentWillMount() {
        this.props.dispatch(checkLogin())
        if (this.props.user.isLogin) {
            this.props.dispatch(fetchEvent())
            this.props.dispatch(fetchCycleEvent())
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.user.isLogin !== prevProps.user.isLogin) {
            this.props.dispatch(fetchEvent())
            this.props.dispatch(fetchCycleEvent())
        }
    }
    render() {
        return (
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        )
    }
}
App = connect(state => ({
    ...state,
}))(App)
export default App