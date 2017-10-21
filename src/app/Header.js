import React from 'react';
import { connect } from 'react-redux';
import { Input, Menu, Segment, Button, Dropdown, Image } from 'semantic-ui-react';
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
        this.props.history.push('/signin');
    }

    render() {
        
        const NavRight = this.props.auth.loggedIn ? (
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>
                <Menu.Item>
                    <Dropdown trigger={Avatar} pointing='top right' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon='address book' text='Profile' as={Link} to={`/profile`} />
                            <Dropdown.Item icon='dashboard' text='Dashboard' as={Link} to={`/dashboard`} />
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign out' text='Sign Out' onClick={this._logout} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu.Menu>
        ) : (
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>
                <Menu.Item name='signIn' active={this.props.location.pathname === '/signin'} as={Link} to={`/signin`} />
                <Menu.Item name='signUp' active={this.props.location.pathname === '/signup'} as={Link} to={`/signup`} />
            </Menu.Menu>
        );

        return (
            <Segment style={{padding: '0.5em'}}>
                <Menu secondary stackable>
                    <Menu.Item name='home' active={this.props.location.pathname === '/'} as={Link} to={`/`}/>
                    <Menu.Item name='about' active={this.props.location.pathname === '/about'} as={Link} to={`/about`} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);;