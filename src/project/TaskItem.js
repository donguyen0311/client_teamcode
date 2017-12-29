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
    Table,
    Divider,
    Popup,
    List
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import ModalTaskEditor from './ModalTaskEditor';

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalEdit: false,
            openModalEditor: false,
            openModalDelete: false,
            editTaskName: this.props.data.task_name,
			editLevel: this.props.data.level,
			editNote: this.props.data.note,
            editDescription: this.props.data.description,
            editLabels: this.props.data.labels,
            labelOptions: this.formatDropdownValue(this.props.data.labels),
			editResponsible: this.props.data.responsible_user.map(user => user._id)
        }
        this.handleChangeEdit = this.handleChangeEdit.bind(this);
        this.handleAdditionEdit = this.handleAdditionEdit.bind(this);
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

    formatDropdownValue(arrayValue) {
        var formatValue = [];
        for (let value of arrayValue) {
            formatValue.push({ text: value, value });
        }
        return formatValue;
    }

    handleChangeEdit(event, {name, value}) {
        this.setState({
			[name]: value
        });
    }

    handleAdditionEdit(e, { name, value }) {
        console.log(name, value);
        let mapName = {
            editLabels: 'labelOptions'
        };
        this.setState({
            [ mapName[name] ]: [{ text: value, value }, ...this.state[ mapName[name] ]],
        });
    }
    
    closeModalEdit = () => {
		this.setState({ 
			openModalEdit: false,
            editTaskName: this.props.data.task_name,
			editLevel: this.props.data.level,
            editNote: this.props.data.note,
            editLabels: this.props.data.labels,
            labelOptions: this.formatDropdownValue(this.props.data.labels),
			editDescription: this.props.data.description,
			editResponsible: this.props.data.responsible_user.map(user => user._id)
        });
	}
	openModalEdit = () => this.setState({ openModalEdit: true })

    editTask() {
        this.props.editTask({ ...this.state, _id: this.props.data._id });
        this.closeModalEdit();
	}

    closeModalDelete = () => this.setState({ openModalDelete: false })
    openModalDelete = () => this.setState({ openModalDelete: true })

    closeModalEditor = () => this.setState({ openModalEditor: false })
    openModalEditor = () => this.setState({ openModalEditor: true })

    deleteTask() {
        this.props.deleteTask({ _id: this.props.data._id });
        this.closeModalDelete();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.setState({
            editTaskName: nextProps.data.task_name,
			editLevel: nextProps.data.level,
			editNote: nextProps.data.note,
            editDescription: nextProps.data.description,
            editLabels: nextProps.data.labels,
            labelOptions: this.formatDropdownValue(nextProps.data.labels),
			editResponsible: nextProps.data.responsible_user.map(user => user._id)
        })
    }

    render() {
        const { openModalEdit, openModalDelete, openModalEditor } = this.state;
        let nameResponseUser = this.props.data.responsible_user.map(user => user.firstname + ' ' + user.lastname);
        if (nameResponseUser.length === 1) {
            nameResponseUser.join();
        }
        else {
            nameResponseUser = 'Multiple users';
        }
        return (
            <div style={{position: 'relative'}}>
                <Dropdown style={{position: 'absolute', top: -3, right: -5}} trigger={<Icon size='large' name="ellipsis vertical" />} icon={null}>
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
                                                <h4>Labels</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.labels.join(', ')}
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
                                        <label>Labels</label>
                                        <Dropdown
                                            name='editLabels'
                                            options={this.state.labelOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.editLabels}
                                            onAddItem={this.handleAdditionEdit}
                                            onChange={this.handleChangeEdit}
                                        />
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
                        <Modal open={openModalEditor} onClose={this.closeModalEditor} trigger={<Dropdown.Item onClick={this.openModalEditor} text = 'Editor' />} size='fullscreen' closeIcon>
                            <Header icon='hashtag' content='Editor'/>
                            <Modal.Content>
                                <ModalTaskEditor taskID={this.props.data._id} />
                            </Modal.Content>
                        </Modal>
                    </Dropdown.Menu>
                </Dropdown>
                <Header
                    size='small'
                    style={{
                    marginBottom: 5,
                    marginTop: 5
                }}>
                    {this.props.data.responsible_user.length === 1 ? (
                        <Image
                            size='mini'
                            spaced
                            src={this.props.data.responsible_user[0].image}/>
                    ) : (
                        <div id='wrapper-photos'>
                            <section id="photos">
                                {this.props.data.responsible_user.map(user => (
                                    <Image
                                        key={user._id}
                                        size='mini'
                                        src={user.image}/>
                                ))}
                            </section>
                        </div>
                    )}
                    
                    <Header.Content style={{width: 193}}>
                        <Popup wide flowing hoverable position='right center' trigger={<div style={{fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{this.props.data.task_name} ({nameResponseUser})</div>}>
                        <List verticalAlign='middle'>
                            {this.props.data.responsible_user.map(user => (
                                <List.Item key={user._id}>
                                    <Image avatar src={user.image} />
                                    <List.Content>
                                        <List.Header>{user.firstname} {user.lastname}</List.Header>
                                    </List.Content>
                                </List.Item>
                            ))}
                        </List>
                        </Popup>
                        <Header.Subheader>
                            <TimeAgo date={this.props.data.createdAt} />
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Container style={{
                    marginBottom: 10
                }}>
                    {this.props.data.description}
                </Container>
                <Divider fitted />
                <div style={{marginTop: 5}}>
                    <Label circular size='mini' color='red' title={this.props.data.level}>{this.props.data.level}</Label>
                    {this.props.data.labels.map(label => (
                        <Label key={label} size='mini' basic title={label} >{label}</Label>
                    ))}
                </div>
            </div>
        )
    }
}

export default TaskItem;