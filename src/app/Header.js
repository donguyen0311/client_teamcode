import React from 'react';
import { Input, Menu, Segment, Button, Dropdown, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: 'home' };
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    _logout() {
        // this.props.dispatch(logout());
    }

    render() {
        const { activeItem } = this.state;

        const Avatar = (
            <span>
              <Image avatar src="https://avatars0.githubusercontent.com/u/23453541?s=40&v=4" /> Đô Nguyễn
            </span>
        );
        
        const NavRight = !this.props.loggedIn ? (
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>
                <Menu.Item>
                    <Dropdown trigger={Avatar} pointing='top right' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon='address book' text='Profile' />
                            <Dropdown.Item icon='dashboard' text='Dashboard' />
                            <Dropdown.Item text='Save as...' description='ctrl + s' />
                            <Dropdown.Item text='Rename' description='ctrl + r' />
                            <Dropdown.Item text='Make a copy' />
                            <Dropdown.Item icon='folder' text='Move to folder' />
                            <Dropdown.Item icon='trash' text='Move to trash' />
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign out' text='Sign Out' onClick={() => {alert("Clicked")}} />
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* <Button basic onClick={this._logout} >Sign Out</Button> */}
                </Menu.Item>
            </Menu.Menu>
        ) : (
            <Menu.Menu position='right'>
                <Menu.Item>
                    <Input icon='search' placeholder='Search...' />
                </Menu.Item>
                <Menu.Item name='signIn' active={activeItem === 'signIn'} onClick={this.handleItemClick} as={Link} to={`/signin`} />
                <Menu.Item name='signUp' active={activeItem === 'signUp'} onClick={this.handleItemClick} as={Link} to={`/signup`} />
            </Menu.Menu>
        );

        return (
            <Segment style={{padding: '0.5em'}}>
                <Menu secondary stackable>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} as={Link} to={`/`}/>
                    <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick} as={Link} to={`/about`} />
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

export default Header;