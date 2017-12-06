import React from 'react';
import {
    Dropdown,
    Icon,
    Header,
    Container,
    Label,
    Image,
    Button,
    Modal,
    Form,
    Table
} from 'semantic-ui-react';

class TaskItem extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            openModalEdit: false,
            editTaskName: this.props.data.task_name,
			editLevel: this.props.data.level,
			editNote: this.props.data.note,
			editDescription: this.props.data.description,
			editResponsible: this.props.data.responsible_user.map(user => user._id)
        }
        this.handleChangeEdit = this.handleChangeEdit.bind(this);
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
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

    handleChangeEdit(event, {name, value}) {
        this.setState({
			[name]: value
        });
    }
    
    closeModalEdit = () => {
		this.setState({ 
			openModalEdit: false,
            editTaskName: this.props.data.task_name,
			editLevel: this.props.data.level,
			editNote: this.props.data.note,
			editDescription: this.props.data.description,
			editResponsible: this.props.data.responsible_user.map(user => user._id)
        })
        
	}
	openModalEdit = () => this.setState({ openModalEdit: true })

    editTask() {
        this.props.editTask({ ...this.state, _id: this.props.data._id });
        this.closeModalEdit();
	}

    closeModalDelete = () => this.setState({ openModalDelete: false })
    openModalDelete = () => this.setState({ openModalDelete: true })

    deleteTask() {
        this.props.deleteTask({ _id: this.props.data._id });
        this.closeModalDelete();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editTaskName: nextProps.data.task_name,
			editLevel: nextProps.data.level,
			editNote: nextProps.data.note,
			editDescription: nextProps.data.description,
			editResponsible: nextProps.data.responsible_user.map(user => user._id)
        })
    }

    render() {
        const { openModalEdit, openModalDelete } = this.state;
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
                                                            <img alt={this.props.data.created_by.email} src={this.props.data.created_by.image}/> {this.props.data.created_by.email}
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
                                                                    <img alt={user.email} src={user.image}/> {user.email}
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
                                <Modal open={openModalEdit} onClose={this.closeModalEdit} trigger={<Dropdown.Item onClick={this.openModalEdit} text = 'Edit' />} size='mini' closeIcon>
                                    <Header icon='hashtag' content='Edit Task'/>
                                    <Modal.Content>
                                        <Form onSubmit={this.editTask}>
                                            <Form.Field>
                                                <Form.Input label="Task Name" placeholder='Task Name' name='editTaskName' value={this.state.editTaskName} onChange={this.handleChangeEdit} required />
                                            </Form.Field>
                                            <Form.Field>
                                                <Form.Input type="number" label="Level"  placeholder='Level' name='editLevel' value={this.state.editLevel} onChange={this.handleChangeEdit} required />
                                            </Form.Field>
                                            <Form.Field>
                                                <Form.TextArea label="Note" placeholder='Note' name='editNote' value={this.state.editNote} onChange={this.handleChangeEdit} required />
                                            </Form.Field>
                                            <Form.Field>
                                                <Form.TextArea label="Description" placeholder='Description' name='editDescription' value={this.state.editDescription} onChange={this.handleChangeEdit} required />
                                            </Form.Field>
                                            <Form.Field>
                                                <label>Responsible</label>
                                                <Dropdown placeholder='Responsible User' fluid multiple selection 
                                                    value={this.state.editResponsible}
                                                    name='editResponsible'
                                                    options={this.props.formatResponsibleUser(this.props.users)}
                                                    onChange={this.handleChangeEdit} />
                                            </Form.Field>
                                            <Button color='green' size='tiny' type='submit'>
                                                <Icon name='checkmark'/>
                                                Update
                                            </Button>
                                        </Form>
                                    </Modal.Content>
                                </Modal>
                                <Modal open={openModalDelete} onClose={this.closeModalDelete} trigger={<Dropdown.Item onClick={this.openModalDelete} text = 'Delete' />} size='mini' closeIcon>
                                    <Header icon='hashtag' content='Delete Task'/>
                                    <Modal.Content>
                                        <h4>Are you sure to delete this task ?</h4>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='red' size='tiny' onClick={this.closeModalDelete}>
                                            <Icon name='remove'/>
                                            No
                                        </Button>
                                        <Button color='green' size='tiny' onClick={this.deleteTask}>
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
                        <img alt={user.email} src={user.image}/>
                        {user.email}
                    </Label>
                ))}
            </div>
        )
    }
}

export default TaskItem;