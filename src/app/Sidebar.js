import React from 'react';
import { Link } from 'react-router-dom';
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
import user from '../utils/user';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: '',
            projects: []
        }
    }

    handleItemClick = name => this.setState({activeItem: name})

    componentWillMount() {
        user.getUserInfo().then(response => {
            console.log(response);
            this.setState({
                projects: response.user.belong_project
            })
        });
    }    
    render() {
        const {activeItem} = this.state || {}
        console.log(this.props);
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
                                {this.state.projects.map(project => (
                                    <Menu.Item 
                                        key={project._id}
                                        style={{fontSize: 15}}
                                        name={project.project_name}
                                        active={activeItem === project.project_name}
                                        onClick={this.handleItemClick}
                                        as={Link} to={`${this.props.match.url}/${project.project_name}`}> 
                                        @ {project.project_name}
                                    </Menu.Item>
                                ))}
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