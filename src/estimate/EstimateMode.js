import React from 'react';
import {connect} from 'react-redux';
import {
	Table,
	Popup,
	Header,
	Grid,
	Container,
	Modal,
	Icon,
	Divider
} from 'semantic-ui-react';

import {
	changeCreateMode,
	changeVisibleCreateModeModal
} from '../project/ProjectActions';


const CREATE_MODE_NOT_DECIDED = 0;
const MANUAL_PICK_STAFF = 1;
const AUTO_PICK_STAFF = 2;
const COMPLETELY_AUTO_PICK_STAFF = 3;
const PRE_PICK_STAFF = 4;

class EstimateMode extends React.Component {
		constructor(props) {
			super(props);
			this.changeCreateProjectMode = this.changeCreateProjectMode.bind(this);
		}

		state = {
			visible: {
				create_mode_modal: true,
				pick_staff_modal: false				
			},
			create_project_mode: CREATE_MODE_NOT_DECIDED
		}
	componentWillReceiveProps(nextProps)
	{
		console.log('nextProps.projectReducer',nextProps.projectReducer);
	}
  	show = size => () => this.setState({ size, open: true })
  	close = () => this.setState({ open: false })
		
	changeCreateProjectMode(create_project_mode_input)
	{
		this.props.changeCreateMode(create_project_mode_input);

		// if(this.props.projectReducer.createMode == MANUAL_PICK_STAFF || 
		// 	this.props.projectReducer.createMode == COMPLETELY_AUTO_PICK_STAFF || 
		// 	this.props.projectReducer.createMode == PRE_PICK_STAFF)
		// {
			this.props.changeVisibleCreateModeModal(false);
		// }
		// this.setState(currentState);
	}

    render() {

        return (
        	<section id="estimate_mode_selector">
        		{
        			this.props.projectReducer.visibleCreateModeModal &&
	      			<Modal size={"tiny"} open={true} onClose={this.close}>
			          <Modal.Content>
			          	<Container>
			          		<Header as="h2">Tạo dự án</Header>
			          		<Divider/>
				          	<Grid column={2} centered>
				          	 	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover auto-pick-staff"
				          	 		onClick={() => {this.changeCreateProjectMode(AUTO_PICK_STAFF)}}
				          	 	>
					            	<Icon name="refresh" size="huge" /><br/>
					            	TỰ ĐỘNG CHỌN NHÂN VIÊN
				            	</Grid.Column>
				            	
				            	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover manual-pick-staff"
				            		onClick={() => {this.changeCreateProjectMode(MANUAL_PICK_STAFF)}}
				            	>
					            	<Icon name="configure" size="huge" /><br/>
					            	CHỌN NHÂN VIÊN BẰNG TAY
					          	</Grid.Column>
				            </Grid>
				          </Container>
			          </Modal.Content>
			        </Modal>
			    }
		        { 
		        	this.props.projectReducer.createMode == AUTO_PICK_STAFF &&
			        <Modal size={"tiny"} open={true} onClose={this.close}>
			          <Modal.Content>
			          	<Container>
			          		<Header as="h2">Cách thức chọn nhân viên</Header>
			          		<Divider/>
				          	<Grid column={2} centered>
				          	 	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover pre-pick-staff"
				          	 		onClick={() => {this.changeCreateProjectMode(PRE_PICK_STAFF)}}
				          	 	>
					            	<Icon name="users" size="huge" /><br/>
					            	CHỌN TRƯỚC MỘT SỐ NHÂN VIÊN
				            	</Grid.Column>
				            	
				            	<Grid.Column width={8} textAlign="center" className="cursor-pointer-hover completely-auto-pick-staff"
				            		onClick={() => {this.changeCreateProjectMode(COMPLETELY_AUTO_PICK_STAFF)}}
				            	>
					            	<Icon name="settings" size="huge" /><br/>
					            	HOÀN TOÀN TỰ ĐỘNG
					          	</Grid.Column>
				            </Grid>
				          </Container>
			          </Modal.Content>
			        </Modal>
			      }
		    	</section>

        );
    }
}

const mapStateToProps = (state) => {
    return {projectReducer: state.projectReducer};
}

const mapDispatchToProps = {
    changeCreateMode,
    changeVisibleCreateModeModal
};

export default connect(mapStateToProps, mapDispatchToProps)(EstimateMode);