import React from 'react';
import { Popup } from 'semantic-ui-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
//import { Segment, Container, Header, Grid } from 'semantic-ui-react';
import styled, { injectGlobal } from 'styled-components';
import TaskItem from './TaskItem';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const items = [
	{
		_id: 1,
		task_name: 'Design FanPage',
		level: '',
		status: 'TODO',
		description: '',
		note: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 2,
		task_name: 'Design HomePage',
		level: '',
		status: 'DOING',
		description: '',
		note: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	},
	{
		_id: 3,
		task_name: 'Design UserPage',
		level: '',
		status: 'TESTING',
		description: '',
		note: '',
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
		description: '',
		note: '',
		responsible_user: '',
		created_by: '',
		createdAt: '',
		updatedAt: '',
	}
];


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
			autoFocusQuoteId: null,
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
		autoFocusQuoteId: target.id,
	};
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

class Project extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			columns: '',
			items: getItems(10),
			autoFocusQuoteId: ''
		};
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
  	}

  	onDragStart(initial) {
		console.log(initial);
  	}

  	onDragEnd(result) {
		console.log(result);
		
		// dropped nowhere
		if (!result.destination) {
			return;
		}

		let source = result.source;
		let destination = result.destination;

		// reordering column
		// if (result.type === 'TASK') {
		// 	const items = reorder(
		// 		this.state.items,
		// 	  	source.index,
		// 	  	destination.index
		// 	);
	  
		// 	this.setState({
		// 		items,
		// 	});
	  
		// 	return;
		// }

		const data = reorderQuoteMap({
			quoteMap: this.state.columns,
			source,
			destination,
		});
	  
		this.setState({
			columns: data.quoteMap,
			autoFocusQuoteId: data.autoFocusQuoteId,
		});

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
								To Do
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
											<Draggable type="TASK" key={234} draggableId={234} >
												{(provided, snapshot) => (
													<div>
														<div
															ref={provided.innerRef}
															style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'todo')}
															{...provided.dragHandleProps}
														>	
															<Popup
																trigger={<div><TaskItem  /></div>}
																position='right center'
																on='click'
															>
																I am positioned to the right center
															</Popup>	
															
														</div>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
											<Draggable type="TASK" key={1234} draggableId={1234} >
												{(provided, snapshot) => (
													<div>
														<div
															ref={provided.innerRef}
															style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'todo')}
															{...provided.dragHandleProps}
														>
															ABCD123
														</div>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
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
								In Progress
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
											<Draggable type="TASK" key={1523} draggableId={15523} >
												{(provided, snapshot) => (
													<div>
														<div
															ref={provided.innerRef}
															style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'inprogress')}
															{...provided.dragHandleProps}
														>
															ABCDddd
														</div>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
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
								Code Review
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
											<Draggable type="TASK" key={152355} draggableId={155235} >
												{(provided, snapshot) => (
													<div>
														<div
															ref={provided.innerRef}
															style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'codereview')}
															{...provided.dragHandleProps}
														>
															ABCDddd
														</div>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
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
								Done
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
											<Draggable type="TASK" key={555} draggableId={155523} >
												{(provided, snapshot) => (
													<div>
														<div
															ref={provided.innerRef}
															style={ContainerItemStyle(provided.draggableStyle, snapshot.isDragging, 'done')}
															{...provided.dragHandleProps}
														>
															ABCDddd
														</div>
														{provided.placeholder}
													</div>
												)}
											</Draggable>
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