import React, { Component } from 'react'

import SideNav from 'react-simple-sidenav';

import { Button } from 'antd';
import 'antd/dist/antd.css'

import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'

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

                <SideNav showNav={this.state.showNav}
                    style={{ zIndex: 99, }}
                    navStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', width: '20rem' }}
                    onHideNav={() => this.setState({ showNav: false })}
                    onMouseOut={() => this.setState({ showNav: false })}
                >
                    <div className='nav-btn' style={{display:'flex',flexDirection:'column' ,width:'20rem'}}
                    onMouseLeave={() => this.setState({ showNav: false })}
                    >
                    {/* can put e.g. login here */}
                    <div className='nav-bar-title'>Real-Life</div>
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

export default NavBar