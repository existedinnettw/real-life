import React, { Component } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar'
import WhiteBoard from './page/WhiteBoard'
import Mission from './page/Mission'
import Analysis from './page/Analysis'

class Layout extends Component {
    //an hoc
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div>
                <NavBar style={{ zIndex: 99 }} />
                {this.props.children}

            </div>
        )
    }
}

class Routes extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    <Route path="/" exact component={WhiteBoard} />
                    <Route path="/whiteboard/" component={WhiteBoard} />
                    <Route path="/mission/" component={Mission} />
                    <Route path='/analysis/' component={Analysis} />
                </Switch>
            </Layout>
        )
    }
}

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
        )
    }
}
export default App