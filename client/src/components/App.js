import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import NavBar from './NavBar'
import WhiteBoard from './page/whiteBoard/WhiteBoard'
import Mission from './page/mission/Mission'
import Analysis from './page/analysis/Analysis'
import './app.css'


//this file is same as "main.js"
class Layout extends Component {
    //an hoc type, called Containment
    constructor(props) {
        super(props)
        this.state = {
            layoutStyle: {},
        }
    }
    render() {
        return (
            <div style={this.state.layoutStyle}>
                <NavBar style={{ zIndex: 99 }} />
                <Switch>
                    <Route path="/" exact component={WhiteBoard} />
                    <Route path="/whiteBoard" render={(props) => <WhiteBoard {...props} />} />
                    <Route path="/mission/" render={(props) => <Mission {...props}  />} />
                    <Route path='/analysis/' component={Analysis} />
                </Switch>

            </div>
        )
    }
}


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        )
    }
}
export default App