import React from 'react';
import {connect} from 'react-redux';
import {
    Sidebar,
    Segment,
    Button,
    Menu,
    Image,
    Icon,
    Header,
    Modal,
    Dropdown,
    Form,
    Input,
    Label,
    Loader,
    Dimmer
} from 'semantic-ui-react';

import Estimate from '../estimate/Estimate';
import user from '../utils/user'
import project from '../utils/project'

import {getUsersInCompanyInfo} from '../user/UserActions'
import {
  changeUserNewProjectForm,
  changeIdNewProjectForm,
  changeProjectSaved
} from '../project/ProjectActions'

import SweetAlert from 'sweetalert2-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import 'sweetalert2/dist/sweetalert2.css';


class ProjectNewForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        projectInfos:{
            'project_name': '',
            'budget': 0,
            'deadline': new Date(),
            'description': '',
            'language_programming': [],
            'belong_company' : this.props.profileUser.profile.current_company._id,
            'created_by' : this.props.profileUser.profile._id,
            'users': []
        },
        dropdownSelected: [],
        openModal: false,
        sweetalert: false,
        startDate: moment(),
        isCreatingProject: false,
        isGetUsersInfoDone: false,
        usersAvailableInCompany:[],
        programming_language: [
        {
          key: '.net',
          value: '.net',
          text: '.NET'
        },
        {
          key: 'android',
          value: 'android',
          text: 'Android'
        },
        {
          key: 'angularjs',
          value: 'angularjs',
          text: 'AngularJS'
        },
        {
          key: 'asp.net',
          value: 'asp.net',
          text: 'ASP.NET'
        },
        {
          key: 'bootstrap',
          value: 'bootstrap',
          text: 'Bootstrap'
        },
        {
          key: 'c',
          value: 'c',
          text: 'C'
        },
        {
          key: 'c++',
          value: 'c++',
          text: 'C++'
        },
        {
          key: 'c#',
          value: 'c#',
          text: 'C#'
        },
        {
          key: 'code_igniter',
          value: 'code_igniter',
          text: 'Code Igniter'
        },
        {
          key: 'css',
          value: 'css',
          text: 'CSS'
        },
        {
          key: 'css3',
          value: 'css3',
          text: 'CSS3'
        },
        {
          key: 'django',
          value: 'django',
          text: 'Django'
        },
        {
          key: 'docker',
          value: 'docker',
          text: 'Docker'
        },
        {
          key: 'git',
          value: 'git',
          text: 'Git'
        },
        {
          key: 'html',
          value: 'html',
          text: 'HTML'
        },
        {
          key: 'html5',
          value: 'html5',
          text: 'HTML5'
        },
        {
          key: 'ios',
          value: 'ios',
          text: 'iOS'
        },
        {
          key: 'j2ee',
          value: 'j2ee',
          text: 'J2EE'
        },
        {
          key: 'java',
          value: 'java',
          text: 'Java'
        },
        {
          key: 'javascript',
          value: 'javascript',
          text: 'JavaScript'
        },
        {
          key: 'jquery',
          value: 'jquery',
          text: 'jQuery'
        },
        {
          key: 'laravel',
          value: 'laravel',
          text: 'Laravel'
        },
        {
          key: 'magento',
          value: 'magento',
          text: 'Magento'
        },
        {
          key: 'maple',
          value: 'maple',
          text: 'Maple'
        },
        {
          key: 'matlab',
          value: 'matlab',
          text: 'Matlab'
        },
        {
          key: 'mongodb',
          value: 'mongodb',
          text: 'MongoDB'
        },
        {
          key: 'mysql',
          value: 'mysql',
          text: 'MySQL'
        },
        {
          key: 'nodejs',
          value: 'nodejs',
          text: 'NodeJS'
        },
        {
          key: 'objective_c',
          value: 'objective_c',
          text: 'Objective C'
        },
        {
          key: 'oop',
          value: 'oop',
          text: 'OOP'
        },
        {
          key: 'pascal',
          value: 'pascal',
          text: 'Pascal'
        },
        {
          key: 'perl',
          value: 'perl',
          text: 'Perl'
        },
        {
          key: 'php',
          value: 'php',
          text: 'PHP'
        },
        {
          key: 'postgresql',
          value: 'postgresql',
          text: 'PostgreSQL'
        },
        {
          key: 'python',
          value: 'python',
          text: 'Python'
        },
        {
          key: 'redis',
          value: 'redis',
          text: 'Redis'
        },
        {
          key: 'reactjs',
          value: 'reactjs',
          text: 'ReactJS'
        },
        {
          key: 'ruby',
          value: 'ruby',
          text: 'Ruby'
        },
        {
          key: 'swift',
          value: 'swift',
          text: 'Swift'
        },
        {
          key: 'unity',
          value: 'unity',
          text: 'Unity'
        },
        {
          key: 'vuejs',
          value: 'vuejs',
          text: 'VueJS'
        },
        {
          key: 'wordpress',
          value: 'wordpress',
          text: 'Wordpress'
        },
        ]
      }

      this.handleChange = this.handleChange.bind(this)
      this.getUsersInCompanyInfo = this.getUsersInCompanyInfo.bind(this)
      this.onInputChange = this.onInputChange.bind(this)
      this.onMutipleChoiceChange = this.onMutipleChoiceChange.bind(this)
      this.onNewProjectFormSubmit = this.onNewProjectFormSubmit.bind(this)
      this.open = this.open.bind(this)
      this.close = this.close.bind(this)
      this.onAddItem = this.onAddItem.bind(this)
    }

    updateCreateByBelongCompany(){
      let currentState = {...this.state}
      currentState.projectInfos['created_by'] = this.props.profileUser.profile._id
      currentState.projectInfos['users'].push(this.state.projectInfos.created_by)
      currentState.projectInfos['belong_company'] = this.props.profileUser.profile.current_company._id
      this.setState(currentState)

      // 'belong_company' : this.props.profileUser.profile.current_company._id,
      // 'created_by' : this.props.profileUser.profile._id,
    }

    formatUsersInCompany(users = []) {
      // console.log(users)
      var userFormat = [];
      for(let user of users) {
        userFormat.push({
          text: user.lastname+' '+user.firstname+' ('+user.email+')',
          value: user._id,
          image: { avatar: true, src: user.image }
        })
      }
      return userFormat;
    }

    getUsersInCompanyInfo()
    {
      let company_id = this.props.profileUser.profile.current_company._id
      this.props.getUsersInCompanyInfo(company_id)
      .then((users) =>
      {
        let currentState = {...this.state}
        currentState.usersAvailableInCompany = this.formatUsersInCompany(users)
        currentState.isGetUsersInfoDone = true
        this.setState(currentState)
      })
    }

    handleChange(date) {

      let currentState = {...this.state}
      currentState.startDate = date
      currentState.projectInfos.deadline = date._d
      this.setState(currentState)
    }

    onMutipleChoiceChange(event,data)
    {
      // console.log(event.target.value)
      var elementName = data.name
      let currentState = {...this.state}
      currentState.projectInfos[elementName] = data.value
      this.setState(currentState)
      // console.log(data.placeholder)
      // console.log(data.value)
      // data.value.push('wordpress')
    }
    onInputChange(element){
      // console.log(element)
      var elementName = element.target.getAttribute('name')
      let currentState = {...this.state}
      currentState.projectInfos[elementName] = element.target.value
      this.setState(currentState)
    }

    onNewProjectFormSubmit(){

      if(!this.state.isCreatingProject){
        this.setState({
          isCreatingProject: true
        })
        this.updateCreateByBelongCompany()
        project.newProject(this.state.projectInfos)
        .then(response => {
          //console.log(response)
          this.setState({
            isCreatingProject: false
          })
          this.setState({
            openModal: false
          })
          
          // this.props.changeUserNewProjectForm(response.projectSaved.users)
          // this.props.changeIdNewProjectForm(response.projectSaved._id)
          this.props.changeProjectSaved(response.projectSaved)

          this.setState({
            sweetalert: true
          })
          setTimeout(() => {
            this.setState({
              sweetalert: false
            })
          },1500)
        })
        
      }
    }
    open(){
      this.getUsersInCompanyInfo()
      this.setState({
        openModal: true
      })
    }
    close(){
      this.setState({
        openModal: false
      })
    }

    onAddItem(event, data){
      console.log(data.value)
    }


    render() {
        const openModal = this.state.openModal
        const sweetalert = this.state.sweetalert
        return(
          <i>
          <SweetAlert
            show={sweetalert}
            title="Success!"
            text="Project has been created"
            type='success'
            showConfirmButton = {false}
          />
          <Icon name="add circle" size={'large'} style={{float: 'right', cursor: 'pointer'}} 
             onClick={this.open}/>
          <Modal
            closeOnDimmerClick={false}
            closeOnDocumentClick={false}
            open={openModal}
            onClose={this.close}
            >
            <Header icon='archive' content='Create Project' />
            <Form id="new_project" onSubmit={this.onNewProjectFormSubmit}>
              <Modal.Content scrolling className="new_project_content">
                  
                  <Form.Field>
                    <Form.Input label='Project Name' name='project_name' placeholder='Project Name'  required 
                      onChange={this.onInputChange}
                    />
                  </Form.Field>
                  <Form.Field className="required">
                      <label>Budget</label>
                      <Input
                        label={{ basic: true, content: '$' }}
                        labelPosition='right'
                        placeholder='Budget for this project'
                        name='budget'
                        onChange={this.onInputChange}
                        required
                      />
                  </Form.Field>
                  <Form.Field className="required">
                      <label>Deadline</label>
                      <DatePicker selected={this.state.startDate} onChange={this.handleChange} required
                        name='deadline'
                        dateFormat="DD/MM/YYYY"
                        onChange={this.handleChange}
                      />
                  </Form.Field>
                  <Form.Field>
                      <Form.TextArea label="Description" placeholder='Description' 
                        name='description'
                        onChange={this.onInputChange}
                      />
                  </Form.Field>
                  <Form.Field className="required">
                      <label>Programming Language/Skills</label>
                      <Dropdown id="language_programming" placeholder='Programming Language' fluid multiple selection search
                        options={this.state.programming_language} required
                        name='language_programming'
                        onChange={this.onMutipleChoiceChange}
                          />
                  </Form.Field>
                  <Form.Field className="required">
                      <label>Responsible</label>
                      {
                        this.state.isGetUsersInfoDone ? 
                        <Dropdown placeholder='Responsible User' fluid multiple selection search
                          options={this.state.usersAvailableInCompany} required
                          name='users'
                          onChange={this.onMutipleChoiceChange}

                          />
                          :
                          <Loader active inline='centered' className="new_project"/>
                      }
                  </Form.Field>
                  
              
              </Modal.Content>

              <Modal.Actions>
                <div className="new_project_action clearfix">
                  <Estimate className='margin_1em' />
                  <Button className='margin_1em' floated='right' primary type="submit">
                      {this.state.isCreatingProject ? <Loader active inline size='tiny'/> : <Icon name='plus' />} Create
                  </Button>
                  <Button className='margin_1em' floated='right' type='button' onClick={this.close}>
                      <Icon name='cancel' /> Cancel
                  </Button>
                  </div>
              </Modal.Actions>
            </Form>
          </Modal>
            </i>
        )
    }
}


const mapStateToProps = (state) => {
    return {
      profileUser: state.userReducer,
      projectNewFormInfos: state.projectReducer
    };
}

const mapDispatchToProps = {
    getUsersInCompanyInfo,
    changeUserNewProjectForm,
    changeIdNewProjectForm,
    changeProjectSaved
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectNewForm);
