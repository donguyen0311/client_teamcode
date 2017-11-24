import React from 'react';
import SideBar from '../app/Sidebar';
import { Popup, Dropdown, Header } from 'semantic-ui-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Label, Icon, Modal, Button, Form } from 'semantic-ui-react';
import styled, { injectGlobal } from 'styled-components';
import TaskItem from './TaskItem';
import {connect} from 'react-redux';
import axios from 'axios';

const io = require('socket.io-client');
// axios.get('/donguyen').then(response => {
// 	console.log(response);
// })

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const reorderQuoteMap = ({
	quoteMap,
	source,
	destination,
  }) => {
	const current = [...quoteMap[source.droppableId]];
	const next = [...quoteMap[destination.droppableId]];
	const target = current[source.index];

	// moving to same list
	if (source.droppableId === destination.droppableId) {
		const reordered = reorder(
			current,
			source.index,
			destination.index,
		);
		const result = {
			...quoteMap,
			[source.droppableId]: reordered,
		}
		return {
			quoteMap: result,
			// not auto focusing in own list
			// autoFocusQuoteId: null,
		}
	}

	// moving to different list

	// remove from original
	current.splice(source.index, 1);
	// insert into next
	next.splice(destination.index, 0, target);
	
	const result = {
		...quoteMap,
		[source.droppableId]: current,
		[destination.droppableId]: next,
	};
	return {
		quoteMap: result,
		// autoFocusQuoteId: target.id,
	};
}

const formatTasks = tasks => {
	var data = {
		TODO: [],
		INPROGRESS: [],
		CODEREVIEW: [],
		DONE: []
	};
	for(let task of tasks) {
		data[task.status][task.position] = task;
	}
	return data;
}

// using some little inline style helpers to make the app look okay
const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: 0,
	//margin: `0 0 ${grid}px 0`,
	margin: `0 10px 0 10px`,
	// change background colour if dragging
	background: isDragging ? 'lightgreen' : 'white',
	minHeight: 70,
	width: 300,
	display: 'inline-block',
	// styles we need to apply on draggables
	...draggableStyle,
});

const Container = styled.div`
	width: 300px;
	margin: 15px;
	display: flex;
	flex-direction: column;
`;

const ContainerList = styled.div``;

const statusTask = {
	todo: '#b5cc18',
	inprogress: '#2185d0',
	codereview: '#db2828',
	done: '#21ba45'
}

const ContainerItemStyle = (draggableStyle, isDragging, status) => ({
	borderLeft: `4px solid ${statusTask[status]}`,
	background: 'white',
	boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
	padding: 10,
	minHeight: 80,	
	margin: `0 0 5px 0`,
	userSelect: 'none',
	transition: 'background-color 0.1s ease',
	/* anchor overrides */
	color: 'rgba(0, 0, 0, 0.85)',
	// styles we need to apply on draggables
	...draggableStyle,
});

const HeaderCustom = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	transition: background-color 0.1s ease;

`;

const Wrapper = styled.div`
	display: inline-flex;
	flex-direction: column;
`;

const WrapperList = styled.div`
	background-color: #e9ecf0;
	display: flex;
	flex-direction: column;
	opacity: inherit;
	padding: 8px;
	transition: background-color 0.1s ease, opacity 0.1s ease;
	user-select: none;
`;

const Title =  styled.h4`
	padding: 8px;
	transition: background-color ease 0.2s;
	flex-grow: 1;
	user-select: none;
	position: relative;
	&:focus {
	outline: 2px solid #000;
	outline-offset: 2px;
	}
`;

const items = [
	{
		_id: 1,
		task_name: 'Design FanPage',
		level: '',
		status: 'TODO',
		description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
		note: '',
		position: 0,
		project_id: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 15,
		task_name: 'Design FanPage 2',
		level: '',
		status: 'TODO',
		description: 'Lorem ipsum dolor sit amet. Aenean commodo ligula eget dolor.',
		note: '',
		position: 1,
		project_id: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 2,
		task_name: 'Design HomePage',
		level: '',
		status: 'INPROGRESS',
		description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Hello!!!',
		note: '',
		position: 0,
		project_id: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 3,
		task_name: 'Design UserPage',
		level: '',
		status: 'CODEREVIEW',
		description: 'Design user',
		note: '',
		position: 0,
		project_id: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 4,
		task_name: 'Design MainPage',
		level: '',
		status: 'DONE',
		description: 'Nothing',
		note: '',
		position: 0,
		project_id: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 45,
		task_name: 'Design MainPage 34',
		level: '',
		status: 'DONE',
		description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.',
		note: '',
		position: 1,
		project_id: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	}
];

class Project extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			openModalAdd: false,
			columns: {TODO: [], INPROGRESS: [], CODEREVIEW: [], DONE: []},
			// autoFocusQuoteId: ''
			currentProject: '',
			addTaskName: '',
			addLevel: '',
			addNote: '',
			addDescription: '',
			addResponsible: ''
		};
		this.formatResponsibleUser = this.formatResponsibleUser.bind(this);
		this.handleChangeAddResponsible = this.handleChangeAddResponsible.bind(this);
		this.handleChangeAddTaskName = this.handleChangeAddTaskName.bind(this);
		this.handleChangeAddLevel = this.handleChangeAddLevel.bind(this);
		this.handleChangeAddNote = this.handleChangeAddNote.bind(this);
		this.handleChangeAddDescription = this.handleChangeAddDescription.bind(this);
		this.addTask = this.addTask.bind(this);
		this.editTask = this.editTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.socket = io();

		this.socket.on('Task:updateTaskPosition', (response) => {
			// dropped nowhere
			if (!response.destination) {
				return;
			}

			let source = response.source;
			let destination = response.destination;

			const data = reorderQuoteMap({
				quoteMap: this.state.columns,
				source,
				destination,
			});
		
			this.setState({
				columns: data.quoteMap,
				// autoFocusQuoteId: data.autoFocusQuoteId,
			});
		});
		this.socket.on('Task:updateAddTask', (response) => {
			console.log(response);
			var columns = this.state.columns;
			columns[response.status].push(response);
			this.setState({
				columns: columns
			});
		});
		this.socket.on('Task:updateEditTask', (response) => {
			console.log(response);
			var columns = this.state.columns;
			columns[response.status][response.position] = response;
			this.setState({
				columns: columns
			});
		});
		this.socket.on('Task:updateDeleteTask', (response) => {
			console.log(response);
			var columns = this.state.columns;
			columns[response.status].splice(response.position, 1);
			this.setState({
				columns: columns
			});
		});
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

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.socket.emit('Task:joinRoom', nextProps.match.url);
		axios.get('/api/projects/' + nextProps.match.params.project, {headers: { 'x-access-token': localStorage.token } })
			.then(response => {
				this.setState({
					columns: formatTasks(response.data.project.tasks),
					currentProject: response.data.project
				});
			})
			.catch(error => {
				console.log(error);
			});
	}
	componentWillMount() {
		console.log(this.props);
		this.socket.emit('Task:joinRoom', this.props.match.url);
		axios.get('/api/projects/' + this.props.match.params.project, {headers: { 'x-access-token': localStorage.token } })
			.then(response => {
				console.log(response);
				this.setState({
					columns: formatTasks(response.data.project.tasks),
					currentProject: response.data.project
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	formatResponsibleUser(users = []) {
		var userFormat = [];
		for(let user of users) {
			userFormat.push({
				text: user.email,
				value: user._id,
				image: { avatar: true, src: user.image }
			})
		}
		return userFormat;
	}

	handleChangeAddTaskName(event) {
		this.setState({
			addTaskName: event.target.value
		});
	}

	handleChangeAddLevel(event) {
		this.setState({
			addLevel: event.target.value
		});
	}

	handleChangeAddNote(event) {
		this.setState({
			addNote: event.target.value
		});
	}

	handleChangeAddDescription(event) {
		this.setState({
			addDescription: event.target.value
		});
	}

	handleChangeAddResponsible(event, { value }) {
		this.setState({
			addResponsible: value
		});
	}

	addTask(status) {
		console.log('add task');
		console.log(this.state);
		console.log(status);
		this.socket.emit('Task:addTask', {
			position: this.state.columns[status].length,
			status: status,
			task_name: this.state.addTaskName,
			level: this.state.addLevel,
			note: this.state.addNote,
			description: this.state.addDescription,
			responsible_user: this.state.addResponsible,
			belong_project: this.state.currentProject._id,
			created_by: this.props.profileUser.profile._id
		});
		this.closeModalAdd();
	}

	editTask(task) {
		this.socket.emit('Task:editTask', task);
	}

	deleteTask(task) {
		console.log(task);
		this.socket.emit('Task:deleteTask', task);
	}

  	onDragStart(initial) {
		console.log('onDragStart:', initial);
  	}

  	onDragEnd(result) {
		console.log('onDragEnd:', result);
		// dropped nowhere
		if (!result.destination) {
			return;
		}

		let source = result.source;
		let destination = result.destination;

		const data = reorderQuoteMap({
			quoteMap: this.state.columns,
			source,
			destination,
		});
	  
		this.setState({
			columns: data.quoteMap,
			// autoFocusQuoteId: data.autoFocusQuoteId,
		});

		this.socket.emit('Task:changeTaskPosition', {columns: this.state.columns, result: result });


  	}

  	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity

  	render() {
		const { openModalAdd } = this.state; 
		return (
			<div style={{marginLeft: 264, minWidth: 940, overflowY: 'auto'}}>
				<DragDropContext 
					onDragEnd={this.onDragEnd}
					onDragStart={this.onDragStart}
				>
					<Wrapper>
						<Container>
							<HeaderCustom>
								<Title>
									<span style={{fontSize: 18, verticalAlign: 'middle'}}>To Do</span> 
									<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['TODO'].length}</Label>
								</Title>
							</HeaderCustom>

							<Droppable
								droppableId="TODO"
								type="TASK"
							>
								{(provided, snapshot) => (
									<WrapperList
										isDraggingOver={snapshot.isDraggingOver}
									>
										<ContainerList>
											<div
												ref={provided.innerRef}
												style={{minHeight: 250, marginBottom: 8}}
											>
											{this.state.columns['TODO'].map(task => (
												<Draggable type="TASK" key={task._id} draggableId={task._id} >
													{(provided, snapshot) => (
														<div>
															<div
																ref={provided.innerRef}
																style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'todo')}
																{...provided.dragHandleProps}
															>	
																<TaskItem 
																	data={task} 
																	editTask={this.editTask} 
																	deleteTask={this.deleteTask}
																	formatResponsibleUser={this.formatResponsibleUser}
																	users={this.state.currentProject.users} 
																/>
															</div>
															{provided.placeholder}
														</div>
													)}
												</Draggable>
											))}		
											{provided.placeholder}
											</div>
											<Modal open={openModalAdd} onClose={this.closeModalAdd} trigger={<div onClick={this.openModalAdd} style={{height: 60, width: 'auto', border: '3px dashed #999', lineHeight: '50px', borderRadius: 5, textAlign: 'center', color: '#999', cursor: 'pointer'}}><Icon name="add circle" size={'big'} /></div>} size='mini' closeIcon>
												<Header icon='hashtag' content='Add Task'/>
												<Modal.Content>
													<Form onSubmit={this.addTask.bind(this, 'TODO')}>
														<Form.Field>
															<Form.Input label="Task Name" placeholder='Task Name' onChange={this.handleChangeAddTaskName} required />
														</Form.Field>
														<Form.Field>
															<Form.Input type="number" label="Level" placeholder='Level' onChange={this.handleChangeAddLevel} required />
														</Form.Field>
														<Form.Field>
															<Form.TextArea label="Note" placeholder='Note' onChange={this.handleChangeAddNote} required />
														</Form.Field>
														<Form.Field>
															<Form.TextArea label="Description" placeholder='Description' onChange={this.handleChangeAddDescription} required />
														</Form.Field>
														<Form.Field>
															<label>Responsible</label>
															<Dropdown placeholder='Responsible User' fluid multiple selection 
																options={this.formatResponsibleUser(this.state.currentProject.users)}
																onChange={this.handleChangeAddResponsible} />
														</Form.Field>
														<Button color='green' size='tiny' type='submit'>
															<Icon name='checkmark'/>
															Add
														</Button>
													</Form>
												</Modal.Content>
											</Modal>
										</ContainerList>
									</WrapperList>
								)}
							</Droppable>	
						</Container>
					</Wrapper>

					<Wrapper>
						<Container>
							<HeaderCustom>
								<Title>
									<span style={{fontSize: 18, verticalAlign: 'middle'}}>In Progress</span> 
									<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['INPROGRESS'].length}</Label>
								</Title>
							</HeaderCustom>

							<Droppable
								droppableId="INPROGRESS"
								type="TASK"
							>
								{(provided, snapshot) => (
									<WrapperList
										isDraggingOver={snapshot.isDraggingOver}
									>
										<ContainerList>
											<div
												ref={provided.innerRef}
												style={{minHeight: 250, marginBottom: 8}}
											>
												{this.state.columns['INPROGRESS'].map(task => (
													<Draggable type="TASK" key={task._id} draggableId={task._id} >
														{(provided, snapshot) => (
															<div>
																<div
																	ref={provided.innerRef}
																	style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'inprogress')}
																	{...provided.dragHandleProps}
																>	
																	<TaskItem 
																		data={task} 
																		editTask={this.editTask} 
																		deleteTask={this.deleteTask}
																		formatResponsibleUser={this.formatResponsibleUser}
																		users={this.state.currentProject.users}  
																	/>	
																	
																</div>
																{provided.placeholder}
															</div>
														)}
													</Draggable>
												))}	
											{provided.placeholder}
											</div>
										</ContainerList>
									</WrapperList>
								)}
							</Droppable>	
						</Container>
					</Wrapper>	

					<Wrapper>
						<Container>
							<HeaderCustom>
								<Title>
									<span style={{fontSize: 18, verticalAlign: 'middle'}}>Code Review</span> 
									<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['CODEREVIEW'].length}</Label>
								</Title>
							</HeaderCustom>

							<Droppable
								droppableId="CODEREVIEW"
								type="TASK"
							>
								{(provided, snapshot) => (
									<WrapperList
										isDraggingOver={snapshot.isDraggingOver}
									>
										<ContainerList>
											<div
												ref={provided.innerRef}
												style={{minHeight: 250, marginBottom: 8}}
											>
												{this.state.columns['CODEREVIEW'].map(task => (
													<Draggable type="TASK" key={task._id} draggableId={task._id} >
														{(provided, snapshot) => (
															<div>
																<div
																	ref={provided.innerRef}
																	style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'codereview')}
																	{...provided.dragHandleProps}
																>	
																	<TaskItem 
																		data={task} 
																		editTask={this.editTask} 
																		deleteTask={this.deleteTask} 
																		formatResponsibleUser={this.formatResponsibleUser} 
																		users={this.state.currentProject.users}
																	/>	
																	
																</div>
																{provided.placeholder}
															</div>
														)}
													</Draggable>
												))}	
											{provided.placeholder}
											</div>
										</ContainerList>
									</WrapperList>
								)}
							</Droppable>	
						</Container>
					</Wrapper>

					<Wrapper>
						<Container>
							<HeaderCustom>
								<Title>
									<span style={{fontSize: 18, verticalAlign: 'middle'}}>Done</span> 
									<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['DONE'].length}</Label>
								</Title>
							</HeaderCustom>

							<Droppable
								droppableId="DONE"
								type="TASK"
							>
								{(provided, snapshot) => (
									<WrapperList
										isDraggingOver={snapshot.isDraggingOver}
									>
										<ContainerList>
											<div
												ref={provided.innerRef}
												style={{minHeight: 250, marginBottom: 8}}
											>
											{this.state.columns['DONE'].map(task => (
												<Draggable type="TASK" key={task._id} draggableId={task._id} >
													{(provided, snapshot) => (
														<div>
															<div
																ref={provided.innerRef}
																style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'done')}
																{...provided.dragHandleProps}
															>	
																<TaskItem 
																	data={task} 
																	editTask={this.editTask} 
																	deleteTask={this.deleteTask} 
																	formatResponsibleUser={this.formatResponsibleUser} 
																	users={this.state.currentProject.users}
																/>	
																
															</div>
															{provided.placeholder}
														</div>
													)}
												</Draggable>
											))}	
											{provided.placeholder}
											</div>
										</ContainerList>
									</WrapperList>
								)}
							</Droppable>	
						</Container>
					</Wrapper>		
				</DragDropContext>
			</div>
		);
  	}
}

const mapStateToProps = (state) => {
    return {profileUser: state.userReducer};
}

export default connect(mapStateToProps)(Project);