import React, { Component } from 'react'
import './navBar.css'
import SideNav from 'react-simple-sidenav'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'

class NavBarItems extends Component {
    render(props) {
        return (
            <Link className="option" to={this.props.path}> {this.props.itemsName}</Link>
        )
    }
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
        //console.log(this.state.showNav)
        return (
            <div >
                <div className='header'>
                <Button className='navBtn' variant='primary' style={{zIndex:80}}
                onClick={(e) => { this.setState({ showNav: !this.state.showNav }) }}>
                    <FontAwesomeIcon icon={faAlignLeft} />
                </Button>
                </div>
                <SideNav className='navBar' showNav={this.state.showNav} style={{zIndex:99}}
                onHideNav={() => this.setState({ showNav: false })}>
                    {
                        Object.keys(this.itemsNames).map((key, idx) => {
                            return (<NavBarItems itemsName={key} key={idx} path={this.itemsNames[key]} />)
                        })
                    }
                </SideNav>
            </div>
        )
    }
}

export default NavBar