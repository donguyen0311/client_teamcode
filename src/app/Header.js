import React from 'react';
import { connect } from 'react-redux';
import { Input, Menu, Segment, Button, Dropdown, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { logout } from '../auth/AuthActions';
import Avatar from '../user/UserAvatar';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this._logout = this._logout.bind(this);
    }

    _logout(e) {
        e.preventDefault();
        this.props.logout();
        this.props.history.push('/');
    }

    render() {
        var trigger = (
            <span>
                <Avatar />
            </span>
        )
        const NavRight = this.props.auth.loggedIn ? (
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>
                <Menu.Item style={{paddingTop: 3.5, paddingBottom: 3.5}}>
                    <Dropdown trigger={trigger} pointing='top right' icon={null} >
                        <Dropdown.Menu>
                            <Dropdown.Item icon='address book' text='Profile' as={Link} to={`/profile`} />
                            {/* <Dropdown.Item icon='game' text='Editor' as={Link} to={`/editor`} /> */}
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign out' text='Sign Out' onClick={this._logout} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu.Menu>
        ) : (
            <Menu.Menu position='right'>
                <Menu.Item name='signUp' as={Link} to={`/signup`} />
            </Menu.Menu>
        );

        return (
            <Segment style={{padding: '0.5em'}}>
                <Menu secondary stackable> 
                    {/* <Menu.Item name='home' as={Link} to={`/`}/>
                    <Menu.Item name='about' as={Link} to={`/about`} /> */}
                    <Menu.Item name='home'> 
                        <Icon name='sidebar' size='large' style={{cursor: 'pointer'}} onClick={this.props.toggleVisibility}/>
                    </Menu.Item>
                    { NavRight }
                </Menu>
            </Segment>
        )
      }
}

// Header.propTypes = {
//     loggedIn: React.PropTypes.bool.isRequired,
//     currentlySending: React.PropTypes.bool.isRequired
// }

const mapStateToProps = (state) => {
    return {
        auth: state.authReducer
    };
}

const mapDispatchToProps = {
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);