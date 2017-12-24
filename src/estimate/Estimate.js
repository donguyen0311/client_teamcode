import React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Grid,
    Input,
    Label,
    Modal,
    Icon,
    Transition,
    Step,
    Form
} from 'semantic-ui-react';

import {
    SCALE_FACTORS,
    NOMINAL_RATING_VALUE,
    EAF,
    COEFFICIENT
 } from '../app/COCOMO.js'
 
import CostDriver from './CostDriver';
import ScaleFactor from './ScaleFactor';
import FunctionPoint from './FunctionPoint';

import {
    changeKLOC,
    getSuitableStaffs,
    changeEstimatedResult,
    changeStaffRequirements,
    getBruteforceStaffs,
    changeBruteforceStaffs
} from './estimateActions'

import {
    changeResponsibleUser,
    changeFindTeamBugdetError,
    setAcceptSuggestionStatus,
    changeProjectWillCreate,
    setProjectCreatedStatus
} from '../project/ProjectActions'

import StaffAfforableTimeline from './timeline/StaffAfforableTimeline';
import ProjectNewForm from '../project/ProjectNewForm';
import SuitableStaffsView from './SuitableStaffsView';
import SuggestSuitableStaffsView from './SuggestSuitableStaffsView';
import CocomoStatisticsTable from './CocomoStatisticsTable';
import EstimatedStatistics from './EstimatedStatistics';
import BruteforceStaffs from './BruteforceStaffs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
import 'moment-duration-format';

const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;

class Estimate extends React.Component {
    constructor(props) {
        super(props);
        this.estimate             = this.estimate.bind(this);
        this.onInputSLOCChange    = this.onInputSLOCChange.bind(this);
        this.caculateEAF          = this.caculateEAF.bind(this);
        this.caculateScaleFactors = this.caculateScaleFactors.bind(this);
        this.handleStartDateChange  = this.handleStartDateChange.bind(this);
        this.handleEndDateChange  = this.handleEndDateChange.bind(this);
        this.allUserAbilityCases = this.allUserAbilityCases.bind(this);
        this.closeTimeline = this.closeTimeline.bind(this);
        this.openTimeline = this.openTimeline.bind(this);

    }
    estimate(){
        let currentState;
        currentState                              = {...this.state};
        currentState.modal['SLOCModal']           = false;
        currentState.modal['ScaleFactorModal']    = false;
        currentState.modal['CostDriverModal']     = false;
        currentState.modal['SuitableStaffsModal'] = false;
        // currentState.isDeclineSuggest             = false;
        this.setState(currentState);

        var E    = COEFFICIENT.B+0.01*(this.caculateScaleFactors(this.props.estimateReducer));
        
        //persons-months nominal schedule
        // var PMns = COEFFICIENT.A * Math.pow(this.props.estimateReducer.KLOC,E) * this.caculateEAF();
        
        //persons-months
        var PMs  = COEFFICIENT.A * Math.pow(this.props.estimateReducer.KLOC,E) * this.caculateEAF();
        
        // time development
        var TDEV = COEFFICIENT.C * Math.pow(PMs,(COEFFICIENT.D+0.2*(E-COEFFICIENT.B)));
        
        //total person need (person count)
        var PM   = PMs / TDEV;

        //months in the form as real number
        var durationBeginToDeadline = this.props.projectReducer.projectWillCreate.duration == 0 ? 3 : this.props.projectReducer.projectWillCreate.duration;

        var durationBeginToDeadlineToHours = durationBeginToDeadline*152;

        var maxPersonPerMonth = Math.ceil(durationBeginToDeadlineToHours/((1*5*4*0.95)*durationBeginToDeadline));

        var effortPM = 0;
        if(durationBeginToDeadline > 0){
            
            //deadline duration is less than estimate duration
            if(durationBeginToDeadline < TDEV)
            {
                //person per month base on deadline of project
                effortPM = PMs / durationBeginToDeadline;
                // console.log('effort', PMs);
            }
        }

        console.log('effort',PMs);
        console.log('tedv',TDEV);
        console.log('durationBeginToDeadline', durationBeginToDeadline);
        console.log('projectDurationToCompleteHours',PMs*152);
        // console.log('performanceTable',this.allUserAbilityCases());
        currentState = {...this.state};
        let requirements = {
            // person_month: 6,
            start_day: this.props.projectReducer.projectWillCreate.start_day,
            end_day: this.props.projectReducer.projectWillCreate.end_day,
            personMonths: PMs,
            performanceTable: this.allUserAbilityCases(),
            projectDuration: durationBeginToDeadline,
            analyst_capability: (this.props.estimateReducer.EAF.ACAP === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.ACAP),
            programmer_capability: (this.props.estimateReducer.EAF.PCAP === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.PCAP),
            application_experience: (this.props.estimateReducer.EAF.APEX === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.APEX),
            platform_experience: (this.props.estimateReducer.EAF.PLEX === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.PLEX),
            language_and_toolset_experience: (this.props.estimateReducer.EAF.LTEX === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.LTEX),
        };
        this.props.changeStaffRequirements(requirements);
        this.props.getSuitableStaffs(requirements)
        .then((response) => {
            let data = response.data;
            // let projectCost = data.projectCostPerMonth* ((effortPM != 0) ? Math.ceil(durationBeginToDeadline) : Math.ceil(TDEV));
            let projectCost = data.projectCost;

            currentState.isGetSuitableStaffDone      = true;
            
            this.setState(currentState);

            this.props.changeEstimatedResult({
                months        : Math.ceil(TDEV),
                persons       : Math.ceil(PM),
                suitableStaffs: data.suitableStaffs,
                original:{
                    PMs: PMs,
                    TDEV: TDEV,
                    PM: PM,
                    effortPM: effortPM > 0 ? effortPM : 0
                },
                ceil:{
                    PMs: Math.ceil(PMs),
                    TDEV: Math.ceil(TDEV),
                    PM: Math.ceil(PM),
                    effortPM: effortPM > 0 ? Math.ceil(effortPM) : 0
                },
                // projectCostPerMonth: data.projectCostPerMonth,
                totalProjectCost: data.totalProjectCost,
                totalTimeTeamAfforable: data.totalTimeTeamAfforable
            });

            this.props.changeProjectWillCreate(
                Object.assign({...this.props.projectReducer.projectWillCreate},
                    {
                        budget: Math.round(data.totalProjectCost*100)/100,
                        users: data.suitableStaffs.map(user => user._id)
                    }
                )
            );
        });
        this.props.getBruteforceStaffs(requirements)
        .then((response) => {
            let data = response.data;
            if(data.bruteforceStaffs !== undefined)
                this.props.changeBruteforceStaffs(data.bruteforceStaffs);
        });
    }

    caculateEAF(customEAF = {}){

        let projectEAF = customEAF;
        if(Object.keys(customEAF).length === 0)
        {
            projectEAF = this.props.estimateReducer.EAF;
        }

        let EAF_value = 1;
        
        EAF.forEach((factor, factor_index) => {
            let factor_name = Object.keys(factor)[0];
            let rating_level = projectEAF[factor_name];
            if(rating_level !== undefined)
            {
                let rating_value = factor[factor_name].rating[rating_level].value;
                EAF_value *= rating_value;
            }
        });

        return EAF_value;
    }

    caculateScaleFactors(){
        let scale_factors_value = 0;
        
        SCALE_FACTORS.forEach((factor, factor_index) => {
            let factor_name = Object.keys(factor)[0];
            let rating_level = this.props.estimateReducer.SCALE_FACTORS[factor_name];
            
            if(rating_level !== undefined)
            {
                let rating_value = factor[factor_name].rating[rating_level].value;
                scale_factors_value += rating_value;
            }
            else
            {
                let rating_value = factor[factor_name].rating[NOMINAL_RATING_VALUE].value;
                scale_factors_value += rating_value;
            }

        });
        return scale_factors_value;
    }

    onInputSLOCChange(element){
        let SLOC = element.target.value;
        if (!(isNaN(SLOC)) && (SLOC >= 0) )
            this.props.changeKLOC(element.target.value/1000);
    }

    state = { 
        modal: {
            ProjectTimeModal   : false,
            SLOCModal          : false,
            ScaleFactorModal   : false,
            CostDriverModal    : false,
            SuitableStaffsModal: false,
            SummaryProjectModal: false,
            StaffAfforableTimelineModal: false
        },
        transition:{
            fpVisible  : true,
            fpAnimation: 'drop'
        },
        input:{
          slocInput: false
        },
        suitableStaffs:[],
        time:{
            start_day: moment(),
            end_day: moment().add(3,'months')
        },
        isGetSuitableStaffDone: false,
        isEstimatedBudgetError: false,
        isDeclineSuggest: false
    }

    show = element => () => {
        if(element == 'ProjectTimeModal')
        {
            this.props.changeProjectWillCreate(
                Object.assign(
                    {...this.props.projectReducer.projectWillCreate},
                    {
                        duration: this.durationMonthFormat(this.props.projectReducer.projectWillCreate.start_day,
                                                    this.props.projectReducer.projectWillCreate.end_day)
                    }
                )
            );
            this.props.setProjectCreatedStatus(false);
        }
        if(element == 'SuitableStaffsModal')
        {
            this.estimate();
        }
        // if(element != 'SuitableStaffsModal')
        // {
        //     this.props.setAcceptSuggestionStatus(NOT_DECIDED);
        // }
        // this.setState({[element]: true })  
        if(element != 'SLOCModal' && element != 'ProjectTimeModal')
        {
            
          let currentState;
          if (this.props.estimateReducer.KLOC == 0)
          {
            currentState                 = {...this.state};
            currentState.input.slocInput = true;
            this.setState(currentState);
            if(!this.state.transition.fpVisible)
            {
                if(document.querySelectorAll('#sloc')[0] !== undefined)
                {
                    document.querySelectorAll('#sloc')[0].focus();
                }
            }
            return false;
          }
          else
          {
            currentState                 = {...this.state};
            currentState.input.slocInput = false;
            this.setState(currentState);
          }    
        }
        else
        {   
            //isSLOCModal
            this.setState({isGetSuitableStaffDone: false});

            if(!this.state.transition.fpVisible)
            {
            
                setTimeout(() =>{
                    if(document.querySelectorAll('#sloc')[0] !== undefined)
                        document.querySelectorAll('#sloc')[0].value = this.props.estimateReducer.KLOC * 1000;
                },100);
              
            }
        }
        for(let modal_name in this.state.modal)
        {
            // console.log(modal_name);
            let currentState;
            if(modal_name == element){
                currentState                   = {...this.state};
                currentState.modal[modal_name] = true;
                this.setState(currentState);
            }
            else{
                currentState                   = {...this.state};
                currentState.modal[modal_name] = false;
                this.setState(currentState);
            }
        }   
        // if(element == 'SLOCModal')  
          // document.querySelectorAll('#sloc').focus()
    }
   
    closeTimeline = element  => () =>
    {
        let currentState            = {...this.state};
        currentState.modal[element] = false;
        this.setState(currentState);
    }

    openTimeline = element  => () =>
    {
        let currentState            = {...this.state};
        currentState.modal[element] = true;
        this.setState(currentState);
    }

    close = element => () => {
        if(element == 'SuitableStaffsModal'){
            this.props.changeResponsibleUser(this.props.estimateReducer.estimatedResult.suitableStaffs.map(user=>user._id));
            if(this.props.projectReducer.acceptSuggestionStatus == ACCEPTED)
            {
                this.props.changeProjectWillCreate(Object.assign(
                    {...this.props.projectReducer.projectWillCreate},
                    {budget:this.props.estimateReducer.estimatedResult.projectCost}
                ));
                
                let budgetInput = document.querySelectorAll('input[name="budget"]')[0];
                if(budgetInput !== undefined)
                    budgetInput.value=this.props.estimateReducer.estimatedResult.projectCost;
            }
        }
        let currentState            = {...this.state};
        currentState.modal[element] = false;
        this.setState(currentState);
    }

    handleVisibility = transition_name => () => {
        let currentState                         = {...this.state};
        currentState.transition[transition_name] = !this.state.transition[transition_name];
        this.setState(currentState);

        // hidden sloc error message
        currentState                 = {...this.state};
        currentState.input.slocInput = false;
        this.setState(currentState);
    }

    handleStartDateChange(date) {

      let currentState = {...this.state};
      currentState.time.start_day = date;
      // currentState.projectInfos.deadline = date._d;
      this.setState(currentState);
      
      this.props.changeProjectWillCreate(
        Object.assign({...this.props.projectReducer.projectWillCreate},
          {
            start_day: date._d,
            duration: this.durationMonthFormat(date._d,this.state.time.end_day)
          }
        )
      );
    }

    handleEndDateChange(date) {

      let currentState = {...this.state};
      currentState.time.end_day = date;
      // currentState.projectInfos.deadline = date._d;
      this.setState(currentState);
      
      this.props.changeProjectWillCreate(
        Object.assign({...this.props.projectReducer.projectWillCreate},
          {
            end_day: date._d,
            duration: this.durationMonthFormat(this.state.time.start_day,date._d)
          }
        )
      );
    }

    durationMonthFormat(fromDate,toDate){
        //hieu so
        // let now = new Date();
        let difference = moment(toDate,"DD/MM/YYYY HH:mm:ss").diff(moment(fromDate,"DD/MM/YYYY HH:mm:ss"));
        if(difference > 0){
            return moment.duration(difference,'ms').format('M',10);
        }
        return 0;
    }

    allUserAbilityCases(){
        let allUserAbilityCases = {};

        let projectUserAbilityRequire = this.props.estimateReducer.EAF;

        let projectE    = COEFFICIENT.B+0.01*(this.caculateScaleFactors(this.props.estimateReducer));
        let projectPMs = COEFFICIENT.A * Math.pow(this.props.estimateReducer.KLOC,projectE) * this.caculateEAF();

        let projectACAPRequire = projectUserAbilityRequire.ACAP === undefined ? NOMINAL_RATING_VALUE : projectUserAbilityRequire.ACAP;
        let projectPCAPRequire = projectUserAbilityRequire.PCAP === undefined ? NOMINAL_RATING_VALUE : projectUserAbilityRequire.PCAP;
        let projectAPEXRequire = projectUserAbilityRequire.APEX === undefined ? NOMINAL_RATING_VALUE : projectUserAbilityRequire.APEX;
        let projectPLEXRequire = projectUserAbilityRequire.PLEX === undefined ? NOMINAL_RATING_VALUE : projectUserAbilityRequire.PLEX;
        let projectLTEXRequire = projectUserAbilityRequire.LTEX === undefined ? NOMINAL_RATING_VALUE : projectUserAbilityRequire.LTEX;
       
        for(let ACAP=projectACAPRequire;ACAP<=4;ACAP++)
            for(let PCAP=projectPCAPRequire;PCAP<=4;PCAP++)
                for(let APEX=projectAPEXRequire;APEX<=4;APEX++)
                    for(let PLEX=projectPLEXRequire;PLEX<=4;PLEX++)
                        for(let LTEX=projectLTEXRequire;LTEX<=4;LTEX++)
                        {
                            var E    = COEFFICIENT.B+0.01*(this.caculateScaleFactors(this.props.estimateReducer));
                            var PMs = COEFFICIENT.A * Math.pow(this.props.estimateReducer.KLOC,E) 
                                * this.caculateEAF(Object.assign({...this.props.estimateReducer.EAF},{
                                                                ACAP: ACAP,
                                                                PCAP: PCAP,
                                                                APEX: APEX,
                                                                PLEX: PLEX,
                                                                LTEX: LTEX
                            }));
                            allUserAbilityCases[`{ACAP: ${ACAP}, PCAP: ${PCAP}, APEX: ${APEX}, PLEX: ${PLEX}, LTEX: ${LTEX}}`] = projectPMs/PMs;
                            // console.log(ACAP+''+PCAP+''+APEX+''+PLEX+''+LTEX);
                        }
        return allUserAbilityCases;
    }


    render() {

        const { SLOCModal, CostDriverModal, ScaleFactorModal, SuitableStaffsModal, ProjectTimeModal, SummaryProjectModal, StaffAfforableTimelineModal } = this.state.modal
        const { fpVisible, fpAnimation } = this.state.transition
        const { slocInput } = this.state.input
        const estimateStep = 
              <Step.Group attached='top'>
                <Step active = {ProjectTimeModal} completed ={!ProjectTimeModal} onClick={this.show('ProjectTimeModal')}
                    className="estimate_step">
                    <Icon name='clock' size='large'/>
                  <Step.Content>
                    <Step.Title>Mốc thời gian</Step.Title>
                    <Step.Description>Chọn thời gian bắt đầu & kết thúc của dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SLOCModal} completed ={((ProjectTimeModal == false) && (SLOCModal == false)) ? true : false} onClick={this.show('SLOCModal')}
                    className="estimate_step">
                    <Icon name='align justify' size='large'/>
                  <Step.Content>
                    <Step.Title>Size In Source Lines of Code</Step.Title>
                    <Step.Description>Xác định độ lớn của dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {ScaleFactorModal} completed={((ProjectTimeModal == false) && (SLOCModal == false) && (ScaleFactorModal == false)) ? true : false}
                      onClick={this.show('ScaleFactorModal')}
                      className="estimate_step">
                  <Icon name='signal' size='large'/>
                  <Step.Content>
                    <Step.Title>Scale Factors</Step.Title>
                    <Step.Description>Yếu tố ngoài dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {CostDriverModal} completed={((ProjectTimeModal == false) && (SLOCModal == false) && (ScaleFactorModal == false) && (CostDriverModal == false)) ? true : false}
                      onClick={this.show('CostDriverModal')}
                      className="estimate_step">
                  <Icon name='tasks' size='large'/>
                  <Step.Content>
                    <Step.Title>Cost Drivers</Step.Title>
                    <Step.Description>Yếu tố ảnh hưởng trực tiếp đến dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SuitableStaffsModal} completed={((ProjectTimeModal == false) && (SLOCModal == false) && (ScaleFactorModal == false) && (CostDriverModal == false) && (SuitableStaffsModal == false)) ? true : false}
                    onClick={this.show('SuitableStaffsModal')}
                    className="estimate_step">
                  <Icon name='trophy' size='large'/>
                  <Step.Content>
                    <Step.Title>Kết quả ước lượng</Step.Title>
                    <Step.Description>Đội ngũ nhân viên phù hợp</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SummaryProjectModal} onClick={this.show('SummaryProjectModal')}
                    className="estimate_step">
                  <Icon name='checkmark box' size='large'/>
                  <Step.Content>
                    <Step.Title>Tạo dự án</Step.Title>
                    <Step.Description>Tóm tắt thông tin dự án</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>

        return (
        <div style={{display: 'inline'}}>
                {/*<Button type='button' color='orange' onClick={this.show('SLOCModal')}><Icon name='wizard' /> Find suitable team</Button>*/}
              <Icon name="add circle" size={'large'} style={{float: 'right', cursor: 'pointer'}} 
                    onClick={this.show('ProjectTimeModal')}/>

                <Modal 
                    id = "project-time-modal"
                    size="fullscreen"
                    open={ProjectTimeModal} onClose={this.close('ProjectTimeModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
                    className="estimate_modal"
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                  <Form>
                    <Grid columns={2}>
                        <Grid.Column width={8}>
                            <Form.Field className="required">
                                <label>Ngày bắt đầu dự án</label>
                                <DatePicker required selected={this.state.time.start_day}
                                    name='start_date'
                                    dateFormat="DD/MM/YYYY"
                                    onChange={this.handleStartDateChange}
                                  />
                              </Form.Field>
                        </Grid.Column>

                        <Grid.Column width={8}>
                            <Form.Field className="required">
                                <label>Ngày kết thúc dự án</label>
                                <DatePicker required selected={this.state.time.end_day}
                                    name='end_day'
                                    dateFormat="DD/MM/YYYY"
                                    onChange={this.handleEndDateChange}
                                  />
                              </Form.Field>
                        </Grid.Column>
                    </Grid>
                  </Form>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close('ProjectTimeModal')} > <Icon name='remove' /> Hủy bỏ </Button>
                    <Button onClick={this.show('SLOCModal')} primary> Tiếp <Icon name='right chevron' /></Button>
                </Modal.Actions>
                </Modal>

                <Modal 
                    id = "fp-modal"
                    size="fullscreen"
                    open={SLOCModal} onClose={this.close('SLOCModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
                    className="estimate_modal"
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                  <Grid>
                        <Grid.Column width={3}>
                            <Button onClick={this.handleVisibility('fpVisible')}>
                                {!fpVisible && 'Sử dụng Function Points'}
                                {fpVisible && 'Nhập trực tiếp KLOC'}
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Transition.Group animation={fpAnimation} duration='0'>
                                {fpVisible && <FunctionPoint/>}
                            </Transition.Group> 
                            {  !fpVisible &&
                                <Input
                                id = "sloc"
                                label={
                                    { 
                                        basic: true, 
                                        content: 'SLOC' 
                                    }
                                }
                                labelPosition='right'
                                placeholder='Nhập số lượng SLOC...'
                                onKeyUp={this.onInputSLOCChange}
                              />
                            }
                            {
                              slocInput &&
                              <Label basic color='red' pointing='left'>{fpVisible ? 'Hãy nhập ít nhất một Function Point' : 'Hãy nhập số lượng SLOC'}</Label>
                            }
                        </Grid.Column>
                  </Grid>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.show('ProjectTimeModal')} > <Icon name='left chevron' /> Quay lại  </Button>
                    <Button onClick={this.show('ScaleFactorModal')} primary disabled={!this.props.functionPointReducer.isFunctionPointDone && fpVisible}> Tiếp <Icon name='right chevron' /></Button>
                </Modal.Actions>
                </Modal>

                <Modal 
                    id = "scale-driver-modal"
                    size="fullscreen"
                    open={ScaleFactorModal} onClose={this.close('ScaleFactorModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
                    className="estimate_modal"
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    <ScaleFactor/>    
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.show('SLOCModal')} > <Icon name='left chevron' /> Quay lại </Button>
                    <Button onClick={this.show('CostDriverModal')} primary> Tiếp <Icon name='right chevron' /></Button>
                </Modal.Actions>
                </Modal>

                <Modal 
                    id = "cost-driver-modal"
                    size="fullscreen"
                    open={CostDriverModal} onClose={this.close('CostDriverModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
                    className="estimate_modal"
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    <CostDriver/>    
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.show('ScaleFactorModal')} > <Icon name='left chevron' /> Quay lại </Button>
                    <Button onClick={this.estimate} color='blue'> Ước lượng  <Icon name='chevron right' /></Button>
                </Modal.Actions>
                </Modal>

                <Modal 
                    id = "suitable-staff-modal"
                    size="fullscreen"
                    open={SuitableStaffsModal} onClose={this.close('SuitableStaffsModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
                    className="estimate_modal"
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content id="suitable_staff_content" className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    
                    <Grid columns={2}>
                        <Grid.Row textAlign="center">
                            <Grid.Column textAlign="left">
                                <SuitableStaffsView/>
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                                <div className="estimated_statistics_fixed">
                                    <EstimatedStatistics />
                                    <CocomoStatisticsTable />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.show('ProjectTimeModal')} > <Icon name='repeat' color='black'/> Thử lại </Button>
                    <Button onClick={this.show('CostDriverModal')} > <Icon name='left chevron' /> Quay lại </Button>
                    <Button onClick={this.openTimeline('StaffAfforableTimelineModal')} color='orange'> Dòng thời gian nhân viên <Icon name='clock' /></Button>
                    <Button onClick={this.show('SummaryProjectModal')} color='green' 
                        disabled={(!this.state.isGetSuitableStaffDone)}>
                        <Icon name='checkmark' /> Chấp nhận nhân viên
                    </Button>
                </Modal.Actions>
                </Modal>             
                
                <Modal 
                    id = "summary-project-modal"
                    size="fullscreen"
                    open={SummaryProjectModal} onClose={this.close('SummaryProjectModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
                    className="estimate_modal"
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    <ProjectNewForm />
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.show('SuitableStaffsModal')} > <Icon name='left chevron' /> Quay lại </Button>
                    <Button 
                        onClick={() => {
                                this.close('SummaryProjectModal');
                                document.getElementById('create_new_project').click();
                            }
                        }
                        primary> Tạo dự án <Icon name='right chevron' /></Button>
                </Modal.Actions>
                </Modal>

                <Modal 
                    id = "staff-afforable-timeline-modal"
                    size="fullscreen"
                    open={StaffAfforableTimelineModal} onClose={this.closeTimeline('StaffAfforableTimelineModal')}
                    className="estimate_modal"
                    >
                <Modal.Header>Dòng thời gian làm việc</Modal.Header>
                <Modal.Content className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    <StaffAfforableTimeline className="padding-left-right-2"/>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.closeTimeline('StaffAfforableTimelineModal')} > <Icon name='remove' /> Đóng </Button>
                </Modal.Actions>
                </Modal>
        </div>
        );
    }
}

// export default Estimate;


const mapStateToProps = (state) => {
    return {
        estimateReducer: state.estimateReducer,
        projectReducer: state.projectReducer,
        functionPointReducer: state.functionPointReducer
    };
}

const mapDispatchToProps = {
    changeKLOC,
    getSuitableStaffs,
    changeResponsibleUser,
    changeEstimatedResult,
    changeFindTeamBugdetError,
    setAcceptSuggestionStatus,
    changeProjectWillCreate,
    changeStaffRequirements,
    getBruteforceStaffs,
    changeBruteforceStaffs,
    setProjectCreatedStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(Estimate);