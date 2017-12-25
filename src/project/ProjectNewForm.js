import React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Icon,
    Header,
    Modal,
    Dropdown,
    Form,
    Input,
    Label,
    Loader,
    Grid
} from 'semantic-ui-react';

import Estimate from '../estimate/Estimate';

import project from '../utils/project';

import {getUsersInCompanyInfo} from '../user/UserActions';
import {
  changeUserNewProjectForm,
  changeIdNewProjectForm,
  changeProjectSaved,
  changeProjectWillCreate,
  changeFindTeamBugdetError,
  changeResponsibleUser,
  setProjectCreatedStatus,
  resetProjectWillCreate
} from '../project/ProjectActions';

import {
  resetEstimateResult
} from '../estimate/estimateActions';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


import moment from 'moment';
import 'moment-duration-format';


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
        estimatedResult:{
          budget: 0,
          start_day: new Date(),
          end_day: new Date(),
        },
        dropdownSelected: [],
        openModal: false,
        sweetalert: false,
        startDate: moment(),
        isCreatingProject: false,
        isGetUsersInfoDone: false,
        usersAvailableInCompany:[],
        defaultDropdownStaffs: [],
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
      };

      this.handleChange = this.handleChange.bind(this);
      this.getUsersInCompanyInfo = this.getUsersInCompanyInfo.bind(this);
      this.onInputChange = this.onInputChange.bind(this);
      this.onMutipleChoiceChange = this.onMutipleChoiceChange.bind(this);
      this.onNewProjectFormSubmit = this.onNewProjectFormSubmit.bind(this);
      this.open = this.open.bind(this);
      this.close = this.close.bind(this);
    }

    componentDidMount()
    {
      // console.log(this.formatUsersInCompany(this.props.estimateReducer.estimatedResult.suitableStaffs).map(user => user._id));
      this.getUsersInCompanyInfo();
      this.setState({
        estimatedResult:{
          budget: this.props.estimateReducer.estimatedResult.budget,
          start_day: this.props.projectReducer.projectWillCreate.start_day,
          end_day: this.props.projectReducer.projectWillCreate.end_day
        },
        defaultDropdownStaffs: this.props.estimateReducer.estimatedResult.suitableStaffs.map(user => user._id)
      });
      this.props.changeProjectWillCreate(
        Object.assign(
          {...this.props.projectReducer.projectWillCreate},
          {
            'belong_company' : this.props.profileUser.profile.current_company._id,
            'created_by' : this.props.profileUser.profile._id
          }
        )
      );
    }

    componentWillReceiveProps(nextProps)
    {
      // this.setState({defaultDropdownStaffs: this.formatUsersInCompany(this.props.estimateReducer.estimatedResult.suitableStaffs)});
    }

    updateCreateByBelongCompany(){
      let currentState = {...this.state};
      currentState.projectInfos['created_by'] = this.props.profileUser.profile._id;
      currentState.projectInfos['belong_company'] = this.props.profileUser.profile.current_company._id;
      currentState.projectInfos['users'] = [];
      this.props.estimateReducer.estimatedResult.suitableStaffs.map(user => {
        currentState.projectInfos['users'].push(user._id);  
      });
      // currentState.projectInfos['users'].push(this.state.projectInfos.created_by);
      this.setState(currentState);

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
      // console.log(userFormat);
      return userFormat;
    }

    getUsersInCompanyInfo()
    {
      let company_id = this.props.profileUser.profile.current_company._id;
      // console.log(company_id);
      this.props.getUsersInCompanyInfo(company_id)
      .then((users) =>
      {
        // console.log(users);
        let currentState = {...this.state};
        currentState.usersAvailableInCompany = this.formatUsersInCompany(users);
        currentState.isGetUsersInfoDone = true;
        this.setState(currentState); 
      })
    }

    handleChange(date) {

      let currentState = {...this.state};
      currentState.startDate = date;
      currentState.projectInfos.deadline = date._d;
      this.setState(currentState);

      this.props.changeProjectWillCreate(
        Object.assign({...this.props.projectReducer.projectWillCreate},
          {
            deadline: date._d,
            duration: this.durationMonthFormat(date._d)
          }
        )
      );
    }

    onMutipleChoiceChange(event,data)
    {
      // console.log(event.target.value)
      var elementName = data.name;
      let currentState = {...this.state};
      currentState.projectInfos[elementName] = data.value;
      this.setState(currentState);
      // console.log(data.placeholder)
      // console.log(data.value)
      // data.value.push('wordpress')
    }
    onInputChange(element){
      // console.log(element)
      var elementName = element.target.getAttribute('name');
      let currentState = {...this.state};
      let value = element.target.value;
      currentState.projectInfos[elementName] = value;
      this.setState(currentState);

      if(elementName == 'budget')
      {
        if(value > 0)
        {
          this.props.changeFindTeamBugdetError(false);
        }

        this.props.changeProjectWillCreate(
          Object.assign({...this.props.projectReducer.projectWillCreate},
            {
              budget: element.target.value
            }
          )
        );
      }

      if(elementName == 'project_name')
      {
        if(document.querySelectorAll('input[name="project_name"]')[0] !== undefined)
        {
          this.props.changeProjectWillCreate(
            Object.assign({...this.props.projectReducer.projectWillCreate},
              {
                project_name: document.querySelectorAll('input[name="project_name"]')[0].value
              }
            )
          );
        }
      }

      if(elementName == 'description')
      {
        if(document.querySelectorAll('textarea[name="description"]')[0] !== undefined)
        {
          this.props.changeProjectWillCreate(
            Object.assign({...this.props.projectReducer.projectWillCreate},
              {
                description: document.querySelectorAll('textarea[name="description"]')[0].value
              }
            )
          );
        }
      }
    }

    onNewProjectFormSubmit(){

      if(!this.state.isCreatingProject){
        this.setState({
          isCreatingProject: true
        });
        // this.updateCreateByBelongCompany();
        // console.log('this.props.projectReducer.projectWillCreate.end_day.utc().format()',this.props.projectReducer.projectWillCreate.end_day.utc().format());
        // console.log('this.props.projectReducer.projectWillCreate.start_day',this.props.projectReducer.projectWillCreate.start_day);

        // console.log(this.props.projectReducer.projectWillCreate);
        let projectInfos = this.props.projectReducer.projectWillCreate;
        delete projectInfos["duration"];
        console.log('projectInfos.start_day',projectInfos.start_day);
        console.log('projectInfos.end_day',projectInfos.end_day);
        if(typeof projectInfos.start_day === "function")
        {
          projectInfos.start_day = projectInfos.start_day.utc().format();
        }
        if(typeof projectInfos.end_day === "function")
        {
          projectInfos.end_day = projectInfos.end_day.utc().format();
        }

        projectInfos.suitableStaffs = this.props.estimateReducer.estimatedResult.suitableStaffs;
        console.log(projectInfos);
        project.newProject(projectInfos)
        .then(response => {
          console.log(response);
          this.setState({
            isCreatingProject: false
          });
          this.setState({
            openModal: false
          });
          
          // this.props.changeUserNewProjectForm(response.projectSaved.users)
          // this.props.changeIdNewProjectForm(response.projectSaved._id)
          this.props.changeProjectSaved(response.projectSaved);

          this.props.setProjectCreatedStatus(true);

          this.props.resetEstimateResult(true);
          this.props.resetProjectWillCreate(true);
        });
      }
    }
    open(){

      this.props.changeResponsibleUser([]);
      this.props.changeProjectWillCreate({
          budget: 0,
          deadline: new Date(),
          duration: 0
      });
      this.getUsersInCompanyInfo();
      this.setState({
        openModal: true
      });
      
      // let budgetInput = document.querySelectorAll('input[name="budget"]')[0];
      
      // if(budgetInput !== undefined){
      //   budgetInput.value = this.props.projectReducer.projectWillCreate.budget;
      // }
    }
    close(){
      this.setState({
        openModal: false
      });
    }

    durationMonthFormat(deadline){
        //hieu so
        let now = new Date();
        let difference = moment(deadline,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
        if(difference > 0){
            return moment.duration(difference,'ms').format('M',10);
        }
        return 0;
    }

    render() {
        const openModal = this.state.openModal;
        return(
          <div>
            <Form id="new_project" className="new-project-form" onSubmit={this.onNewProjectFormSubmit}>
              <Form.Field>
                <Form.Input label='Tên dự án' name='project_name' placeholder='Tên dự án' autoFocus required 
                  onChange={this.onInputChange}
                />
              </Form.Field>
              <Form.Field className="required">
                  <label>Ngân sách</label>
                  <Input
                    label={{ basic: true, content: '$' }}
                    className="text-bold"
                    labelPosition='right'
                    placeholder='Ngân sách cho dự án này'
                    name='budget'
                    disabled={true}
                    onChange={this.onInputChange}
                    value={Math.round(this.props.estimateReducer.estimatedResult.totalProjectCost*100)/100}
                    required
                  />
                  {this.props.projectReducer.findTeamBudgetError && <Label basic color='red' pointing>Please enter a value</Label>}
              </Form.Field>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Form.Field className="required">
                        <label>Ngày bắt dầu dự án</label>
                        <DatePicker selected={moment(this.props.projectReducer.projectWillCreate.start_day)} required
                          className="text-bold"
                          name='start_day'
                          dateFormat="DD/MM/YYYY"
                          onChange={this.handleChange}
                          disabled={true}
                        />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Form.Field className="required">
                        <label>Ngày kết thúc dự án</label>
                        <DatePicker selected={moment(this.props.projectReducer.projectWillCreate.end_day)} required
                          className="text-bold"
                          name='end_day'
                          dateFormat="DD/MM/YYYY"
                          onChange={this.handleChange}
                          disabled={true}
                        />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Form.Field>
                  <label className="padding-top-1">Mô tả</label>
                  <Form.TextArea placeholder='Mô tả' 
                    name='description'
                    onChange={this.onInputChange}
                  />
              </Form.Field>
              {/*<Form.Field className="required">
                  <label>Programming Language/Skills</label>
                  <Dropdown id="language_programming" placeholder='Programming Language' fluid multiple selection search
                    options={this.state.programming_language} required
                    name='language_programming'
                    onChange={this.onMutipleChoiceChange}
                      />
              </Form.Field>*/}
              <Form.Field className="required">
                  <label>Nhân viên tham gia</label>
                  {
                    this.state.isGetUsersInfoDone ? ( this.props.estimateReducer.estimatedResult.suitableStaffs.length > 0 ? 
                    <Dropdown key={123} placeholder='Nhân viên tham gia' fluid multiple selection search
                      options={this.state.usersAvailableInCompany} required
                      name='users1'
                      onChange={this.onMutipleChoiceChange}
                      defaultValue={this.state.defaultDropdownStaffs}
                      disabled={true}
                      /> : 
                      <Dropdown key={456} placeholder='Nhân viên tham gia' fluid multiple selection search
                      options={this.state.usersAvailableInCompany} required
                      name='users2'
                      onChange={this.onMutipleChoiceChange}
                      />
                      )
                      :
                      <Loader active inline='centered' className="new_project"/>
                  }
              </Form.Field>
              <div className="new_project_action clearfix display-none">
                <Button id="create_new_project" className='margin_1em display-none' floated='right' primary type="submit">
                    {this.state.isCreatingProject ? <Loader active inline size='tiny'/> : <Icon name='plus' />} Tạo dự án
                </Button>
                <Button id="cancel_new_project" className='margin_1em display-none' floated='right' type='button' onClick={this.close}>
                    <Icon name='cancel' /> Hủy bỏ
                </Button>
              </div>
            </Form>
          </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
      profileUser: state.userReducer,
      projectReducer: state.projectReducer,
      estimateReducer: state.estimateReducer
    };
}

const mapDispatchToProps = {
    getUsersInCompanyInfo,
    changeUserNewProjectForm,
    changeIdNewProjectForm,
    changeProjectSaved,
    changeProjectWillCreate,
    changeFindTeamBugdetError,
    changeResponsibleUser,
    setProjectCreatedStatus,
    resetEstimateResult,
    resetProjectWillCreate
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectNewForm);
