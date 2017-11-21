import React from 'react';
import {
    Dropdown,
    Icon,
    Input,
    Menu,
    Header,
    Container,
    Label,
    Popup,
    Card,
    Image,
    Progress,
    Divider,
    Button,
    Modal,
    Form,
    Table
} from 'semantic-ui-react';

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
    }

    formatDate(dateValue) {
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        var date = new Date(dateValue);
        var day = (date.getDate() < 10)
            ? '0' + date.getDate()
            : date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var hours = (date.getHours() < 10)
            ? '0' + date.getHours()
            : date.getHours();
        var minutes = (date.getMinutes() < 10)
            ? '0' + date.getMinutes()
            : date.getMinutes();
        var seconds = (date.getSeconds() < 10)
            ? '0' + date.getSeconds()
            : date.getSeconds();
        return `${monthNames[monthIndex]} ${day} ${year} ${hours}:${minutes}:${seconds}`;
    }

    render() {
        return (
            <div>
                <Image
                    floated='right'
                    size='mini'
                    src={this.props.data.created_by.image}/>
                <Header
                    size='small'
                    style={{
                    marginBottom: 5,
                    marginTop: 5
                }}>
                    <span>
                        {this.props.data.task_name}&nbsp;
                        <Dropdown trigger={< Icon name = "ellipsis horizontal" />} icon={null}>
                            <Dropdown.Menu>
                                <Modal trigger={< Dropdown.Item text = 'Detail' />} size='mini' closeIcon>
                                    <Header icon='hashtag' content='Task Detail'/>
                                    <Modal.Content>
                                        <Table basic='very'>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Task Name</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.props.data.task_name}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Status</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.props.data.status}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Level</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.props.data.level}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Note</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.props.data.note}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Description</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.props.data.description}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Created by</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Label as='a' image size='small'>
                                                            <img src={this.props.data.created_by.image}/> {this.props.data.created_by.email}
                                                        </Label>
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Responsible</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this
                                                            .props
                                                            .data
                                                            .responsible_user
                                                            .map(user => (
                                                                <Label key={user._id} as='a' image size='tiny'>
                                                                    <img src={this.props.data.created_by.image}/> {this.props.data.created_by.email}
                                                                </Label>
                                                            ))}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Created at</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.formatDate(this.props.data.createdAt)}
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <h4>Updated at</h4>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {this.formatDate(this.props.data.updatedAt)}
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Modal.Content>
                                </Modal>
                                <Modal trigger={< Dropdown.Item text = 'Edit' />} size='mini' closeIcon>
                                    <Header icon='hashtag' content='Edit Task'/>
                                    <Modal.Content>
                                        <Form>
                                            <Form.Field>
                                                <label>Task Name</label>
                                                <input placeholder='First Name'/>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Level</label>
                                                <input placeholder='Last Name'/>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Note</label>
                                                <input placeholder='Last Name'/>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Description</label>
                                                <input placeholder='Last Name'/>
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Responsible</label>
                                                <input placeholder='Last Name'/>
                                            </Form.Field>
                                        </Form>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='red' size='tiny'>
                                            <Icon name='remove'/>
                                            Cancel
                                        </Button>
                                        <Button color='green' size='tiny'>
                                            <Icon name='checkmark'/>
                                            Update
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                                <Modal trigger={< Dropdown.Item text = 'Delete' />} size='mini' closeIcon>
                                    <Header icon='hashtag' content='Delete Task'/>
                                    <Modal.Content>
                                        <h4>Are you sure to delete this task ?</h4>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='red' size='tiny'>
                                            <Icon name='remove'/>
                                            No
                                        </Button>
                                        <Button color='green' size='tiny'>
                                            <Icon name='checkmark'/>
                                            Yes
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                </Header>
                <Container style={{
                    marginBottom: 10
                }}>
                    {this.props.data.description}
                </Container>
                {this.props.data.responsible_user.map(user => (
                    <Label key={user._id} as='a' image size='mini'>
                        <img src={user.image}/>
                        {user.email}
                    </Label>
                ))}
            </div>
        )
    }
}

export default TaskItem;