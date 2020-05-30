import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar'
import WhiteBoard from './components/page/whiteBoard/WhiteBoard'
import Mission from './components/page/mission/Mission'
import Analysis from './components/page/analysis/Analysis'


//this file is same as "main.js"
class Layout extends Component {
    //an hoc type, called Containment
    constructor(props) {
        super(props)
        this.state = {
            layoutStyle: {}
        }
        this.chngLayoutStyle = this.chngLayoutStyle.bind(this)
    }
    chngLayoutStyle( style ) {
        this.setState({ layoutStyle: style })
    }
    render() {
        return (
            <div style={this.state.layoutStyle}>
                <NavBar style={{ zIndex: 99 }} />
                <Switch>
                    <Route path="/" exact component={WhiteBoard} />
                    <Route path="/whiteBoard" exact render={(props) => <WhiteBoard {...props} chngLayoutStyle={this.chngLayoutStyle} />} />
                    <Route path="/mission/" render={(props)=><Mission {...props} chngLayoutStyle={this.chngLayoutStyle}/>}/>
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