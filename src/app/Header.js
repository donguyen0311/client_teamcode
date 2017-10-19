import React from 'react';
import { Input, Menu, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: 'home' };
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
    
        return (
            <Segment style={{padding: '0.5em'}}>
                <Menu secondary stackable>
                    <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} as={Link} to={`/`}/>
                    <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick} as={Link} to={`/about`} />
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Input icon='search' placeholder='Search...' />
                        </Menu.Item>
                        <Menu.Item name='signIn' active={activeItem === 'signIn'} onClick={this.handleItemClick} as={Link} to={`/signin`} />
                        <Menu.Item name='signUp' active={activeItem === 'signUp'} onClick={this.handleItemClick} as={Link} to={`/signup`} />
                    </Menu.Menu>
                </Menu>
            </Segment>
        )
      }
}

export default Header;