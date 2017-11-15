import React from 'react';
import { Popup } from 'semantic-ui-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Label, Icon, Modal, Button, Form } from 'semantic-ui-react';
import styled, { injectGlobal } from 'styled-components';
import TaskItem from './TaskItem';
import axios from 'axios';

const io = require('socket.io-client');
const socket = io();

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

const Header = styled.div`
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
			columns: {TODO: [], INPROGRESS: [], CODEREVIEW: [], DONE: []},
			// autoFocusQuoteId: ''
		};
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragStart = this.onDragStart.bind(this);

		socket.on('Task:updateTaskPosition', (response) => {
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
  	}

	componentWillMount() {
		axios
			.get('/api/tasks', {headers: { 'x-access-token': localStorage.token } })
			.then(response => {
				this.setState({
					columns: formatTasks(response.data.tasks)
				});
			})
			.catch(error => {
				console.log(error);
			});
	}

	addTask(status) {
		console.log('add task');
		console.log(this.state.columns);
		console.log(status);
	}

	editTask(taskId) {
		console.log(taskId);
	}

	deleteTask(taskId) {
		console.log(taskId);
	}

	showDetail(taskId) {
		console.log(taskId);
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
		socket.emit('Task:changeTaskPosition', {columns: this.state.columns, result: result });

  	}

  	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity

  	render() {
		return (
			<DragDropContext 
				onDragEnd={this.onDragEnd}
				onDragStart={this.onDragStart}
			>
				<Wrapper>
					<Container>
						<Header>
							<Title>
								<span style={{fontSize: 18, verticalAlign: 'middle'}}>To Do</span> 
								<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['TODO'].length}</Label>
							</Title>
						</Header>

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
																showDetail={this.showDetail.bind(this, task._id)} 
																editTask={this.editTask.bind(this, task._id)} 
																deleteTask={this.deleteTask.bind(this, task._id)} 
															/>
														</div>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
										))}		
										{provided.placeholder}
										</div>
										<Modal trigger={<div style={{height: 60, width: 'auto', border: '3px dashed #999', lineHeight: '50px', borderRadius: 5, textAlign: 'center', color: '#999', cursor: 'pointer'}}><Icon name="add circle" size={'big'} /></div>} size='mini' closeIcon>
                                    		<Header icon='hashtag' content='Add Task'/>
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
									</ContainerList>
								</WrapperList>
							)}
						</Droppable>	
					</Container>
				</Wrapper>

				<Wrapper>
					<Container>
						<Header>
							<Title>
								<span style={{fontSize: 18, verticalAlign: 'middle'}}>In Progress</span> 
								<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['INPROGRESS'].length}</Label>
							</Title>
						</Header>

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
																	showDetail={this.showDetail.bind(this, task._id)} 
																	editTask={this.editTask.bind(this, task._id)} 
																	deleteTask={this.deleteTask.bind(this, task._id)} 
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
						<Header>
							<Title>
								<span style={{fontSize: 18, verticalAlign: 'middle'}}>Code Review</span> 
								<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['CODEREVIEW'].length}</Label>
							</Title>
						</Header>

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
																	showDetail={this.showDetail.bind(this, task._id)} 
																	editTask={this.editTask.bind(this, task._id)} 
																	deleteTask={this.deleteTask.bind(this, task._id)} 
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
						<Header>
							<Title>
								<span style={{fontSize: 18, verticalAlign: 'middle'}}>Done</span> 
								<Label as='a' size={'small'} style={{float: 'right'}}>{this.state.columns['DONE'].length}</Label>
							</Title>
						</Header>

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
																showDetail={this.showDetail.bind(this, task._id)} 
																editTask={this.editTask.bind(this, task._id)} 
																deleteTask={this.deleteTask.bind(this, task._id)} 
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
		);
  	}
}

export default Project;