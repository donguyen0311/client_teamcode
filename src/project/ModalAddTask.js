import React from 'react';
import { Dropdown, Header, Icon, Modal, Button, Form } from 'semantic-ui-react';

class ModalAddTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			openModalAdd: false,
			addTaskName: '',
			addLevel: '',
			addNote: '',
			addDescription: '',
			addResponsible: ''
		};
		this.handleChangeAdd = this.handleChangeAdd.bind(this);
    }

    closeModalAdd = () => {
		this.setState({ 
			openModalAdd: false,
			addTaskName: '',
			addLevel: '',
			addNote: '',
			addDescription: '',
			addResponsible: ''
		})
	}
    openModalAdd = () => this.setState({ openModalAdd: true })
    
    handleChangeAdd(event, {name, value}) {
		this.setState({
			[name]: value
        });
	}

    render() {
        const { openModalAdd } = this.state; 
        return (
            <Modal open={openModalAdd} onClose={this.closeModalAdd} trigger={<div onClick={this.openModalAdd} style={{height: 60, width: 'auto', border: '3px dashed #999', lineHeight: '50px', borderRadius: 5, textAlign: 'center', color: '#999', cursor: 'pointer'}}><Icon name="add circle" size={'big'} /></div>} size='mini' closeIcon>
                <Header icon='hashtag' content='Add Task'/>
                <Modal.Content>
                    <Form onSubmit={this.props.addTask.bind(this, this.state, 'TODO', this.closeModalAdd)}>
                        <Form.Field>
                            <Form.Input label="Task Name" placeholder='Task Name' name='addTaskName' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input type="number" label="Level" placeholder='Level' name='addLevel' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea label="Note" placeholder='Note' name='addNote' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea label="Description" placeholder='Description' name='addDescription' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <label>Responsible</label>
                            <Dropdown placeholder='Responsible User' fluid multiple selection 
                                name='addResponsible'
                                options={this.props.formatResponsibleUser(this.props.currentProject.users)}
                                onChange={this.handleChangeAdd} />
                        </Form.Field>
                        <Button color='green' size='tiny' type='submit'>
                            <Icon name='checkmark'/>
                            Add
                        </Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalAddTask;