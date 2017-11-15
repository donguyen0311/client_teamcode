import React from 'react';
import {
    Sidebar,
    Segment,
    Button,
    Menu,
    Image,
    Icon,
    Header,
    Modal
} from 'semantic-ui-react';
import axios from 'axios';

const io = require('socket.io-client');
const socket = io();

class SideBar extends React.Component {
    handleItemClick = name => this.setState({activeItem: name})

    
    componentWillMount() {
        
    }    

    render() {
        const {activeItem} = this.state || {}

        return (
            <div>
                    <Sidebar
                        as={Menu}
                        visible={true}
                        vertical
                        inverted
                        style={{
                        width: 250, position: 'fixed', top: 0, left:0, bottom: 0, paddingBottom: '1em', background: 'rgb(27, 28, 29)'
                    }}>
                        <Menu.Item>
                            <Menu.Header>
                                <div style={{display: 'inline-block', fontSize: 20}}>Project</div>
                                
                                <Modal trigger={<Icon name="add circle" size={'large'} style={{float: 'right', cursor: 'pointer'}} />} >
                                    <Header icon='archive' content='Create Project' />

                                    <Modal.Content>
                                        <p>Your inbox is getting full, would you like us to enable automatic archiving of old messages?</p>
                                    </Modal.Content>

                                    <Modal.Actions>
                                        <Button>
                                            <Icon name='plus' /> Create
                                        </Button>
                                        <Button>
                                            <Icon name='cancel' /> Cancel
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Menu.Header>

                            <Menu.Menu>
                                <Menu.Item 
                                    style={{fontSize: 15}}
                                    name='enterprise'
                                    active={activeItem === 'enterprise'}
                                    onClick={this.handleItemClick}> 
                                    @ Enterprise
                                </Menu.Item>
                                <Menu.Item 
                                    style={{fontSize: 15}}
                                    name='consumer'
                                    active={activeItem === 'consumer'}
                                    onClick={this.handleItemClick}> 
                                    @ Consumer
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                            <Menu.Header>
                                <div style={{display: 'inline-block', fontSize: 20}}>Chat</div>
                                <Icon name="add circle" size={'large'} style={{float: 'right', cursor: 'pointer'}} />
                            </Menu.Header>

                            <Menu.Menu>
                                <Menu.Item 
                                    style={{fontSize: 15}}
                                    name='rails'
                                    active={activeItem === 'rails'}
                                    onClick={this.handleItemClick}> 
                                    @ Rails
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Item>
                    </Sidebar>
                <div style={{marginLeft: 264, width: 1600, overflowY: 'auto'}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default SideBar;