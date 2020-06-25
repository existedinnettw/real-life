import React, { Component } from 'react'

import SideNav from 'react-simple-sidenav';

import { Button } from 'antd';
import 'antd/dist/antd.css'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchEvent } from 'state/eventSlice'
import { checkLogin } from 'state/userSlice'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'

import './navBar.css' //should put behind than antd css

function NavBarItem(props) {
    return (
        <Link className="nav-bar-item" to={props.path}> {props.itemName}</Link>
    )
}

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.itemsNames = {
            'White Board': '/whiteboard/',
            'Mission': '/mission/',
            'Analysis': '/analysis/',
        }
        this.state = {
            showNav: false,
        }
    }
    componentWillMount() {
        this.props.dispatch(checkLogin())
        if (this.props.user.isLogin) {
            this.props.dispatch(fetchEvent())
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.user.isLogin !== prevProps.user.isLogin) {
            this.props.dispatch(fetchEvent())
        }
    }

    render() {
        return (
            <div >
                <div className='tp-header'>
                    <div className='nav-btn'
                        onClick={(e) => { this.setState({ showNav: true }) }}
                        onMouseOver={() => this.setState({ showNav: true })}
                    >
                        {/* <FontAwesomeIcon icon={faAlignLeft} /> */}
                    </div>
                </div>

                <SideNav showNav={this.state.showNav || !this.props.user.isLogin}
                    style={{ zIndex: 99, }}
                    navStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '20rem' }}
                    onHideNav={() => this.setState({ showNav: false })}
                    onMouseOut={() => this.setState({ showNav: false })}
                >
                    <div className='nav-btn'
                        style={{ display: 'flex', flexDirection: 'column', width: '20rem', }}
                        onMouseLeave={() => this.setState({ showNav: false })}
                    >
                        <div className='nav-bar-title'>
                            <div>
                                Real-Life
                            {
                                    !this.props.user.isLogin ?
                                        <Button className='auth-btn'
                                            ghost={true}
                                        >
                                            <a href={`${process.env.BASE_URL}/auth/google`}>
                                                login
                                    </a>
                                        </Button> :
                                        <Button className='auth-btn'
                                            ghost={true}
                                        >
                                            <a href={`${process.env.BASE_URL}/auth/logout`}>
                                                logout
                                </a>
                                        </Button>
                                }
                            </div>
                            <div style={{ padding: '1rem 1rem' }}>
                                {this.props.user.isLogin && <img className='user-img' src={this.props.user.photo} alt="Background" />}
                                {this.props.user.isLogin && <div className='user-text'>{this.props.user.userName}</div>}
                            </div>
                        </div>

                        {
                            Object.keys(this.itemsNames).map((key, idx) => {
                                return (
                                    <NavBarItem itemName={key} key={idx} path={this.itemsNames[key]}
                                    />
                                )
                            })
                        }

                    </div>
                </SideNav>
            </div>
        )
    }
}
NavBar = connect(state => ({
    ...state,
}))(NavBar)

export default NavBar