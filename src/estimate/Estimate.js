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
    Step
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
    changeEstimatedResult
} from './estimateActions'

import {
    changeResponsibleUser,
    changeFindTeamBugdetError,
    setAcceptSuggestionStatus,
    changeProjectWillCreate
} from '../project/ProjectActions'

import SuitableStaffsView from './SuitableStaffsView';
import SuggestSuitableStaffsView from './SuggestSuitableStaffsView';
import CocomoStatisticsTable from './CocomoStatisticsTable';
import EstimatedStatistics from './EstimatedStatistics';

const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;

class Estimate extends React.Component {
    constructor(props) {
        super(props);
        this.estimate             = this.estimate.bind(this);
        this.onInputSLOCChange    = this.onInputSLOCChange.bind(this);
        this.caculateEAF          = this.caculateEAF.bind(this);
        this.caculateScaleFactors = this.caculateScaleFactors.bind(this);
        // this.responseSuggest      = this.responseSuggest.bind(this);

    }
    estimate(){

        let currentState;
        currentState                              = {...this.state};
        currentState.modal['SLOCModal']           = false;
        currentState.modal['ScaleFactorModal']    = false;
        currentState.modal['CostDriverModal']     = false;
        currentState.modal['SuitableStaffsModal'] = true;
        // currentState.isDeclineSuggest             = false;
        this.setState(currentState);

        var E    = COEFFICIENT.B+0.01*(this.caculateScaleFactors(this.props.estimateReducer));
        
        //persons-months nominal schedule
        var PMns = COEFFICIENT.A * Math.pow(this.props.estimateReducer.KLOC,E) * this.caculateEAF(this.props.estimateReducer);
        
        //persons-months
        var PMs  = COEFFICIENT.A * Math.pow(this.props.estimateReducer.KLOC,E) * this.caculateEAF(this.props.estimateReducer);
        
        // time development
        var TDEV = COEFFICIENT.C * Math.pow(PMns,(COEFFICIENT.D+0.2*(E-COEFFICIENT.B)));
        
        //total person need (person count)
        var PM   = PMs / TDEV;

        //months in the form as real number
        var durationBeginToDeadline = this.props.projectReducer.projectWillCreate.duration;

        var effortPM = 0;
        //deadline duration is less than estimate duration
        if(durationBeginToDeadline < Math.ceil(TDEV))
        {
            //person per month base on deadline of project
            effortPM = PMs / durationBeginToDeadline;
            // console.log('effort', PMs);
        }

        currentState = {...this.state};
        this.props.getSuitableStaffs({
          person_month: (effortPM != 0) ? Math.ceil(effortPM) : Math.ceil(PM),
          analyst_capability: (this.props.estimateReducer.EAF.ACAP === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.ACAP),
          programmer_capability: (this.props.estimateReducer.EAF.PCAP === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.PCAP),
          application_experience: (this.props.estimateReducer.EAF.APEX === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.APEX),
          platform_experience: (this.props.estimateReducer.EAF.PLEX === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.PLEX),
          language_and_toolset_experience: (this.props.estimateReducer.EAF.LTEX === undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.estimateReducer.EAF.LTEX),
        })
        .then((response) => {
            let data = response.data;
            let projectCost = data.projectCostPerMonth*Math.ceil(TDEV);

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
                projectCostPerMonth: data.projectCostPerMonth,
                projectCost: projectCost
            });
        });
    }

    caculateEAF(){
        let EAF_value = 1;
        
        EAF.forEach((factor, factor_index) => {
            let factor_name = Object.keys(factor)[0];
            let rating_level = this.props.estimateReducer.EAF[factor_name];
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
            SLOCModal          : false,
            ScaleFactorModal   : false,
            CostDriverModal    : false,
            SuitableStaffsModal: false  
        },
        transition:{
            fpVisible  : false,
            fpAnimation: 'drop'
        },
        input:{
          slocInput: false
        },
        suitableStaffs:[],
        isGetSuitableStaffDone: false,
        isEstimatedBudgetError: false,
        isDeclineSuggest: false
    }

    show = element => () => {
        if(element != 'SuitableStaffsModal')
        {
            this.props.setAcceptSuggestionStatus(NOT_DECIDED);
        }
        // this.setState({[element]: true })  
        if(element != 'SLOCModal')
        {
          let currentState;
          if (this.props.estimateReducer.KLOC == 0)
          {
            currentState                 = {...this.state};
            currentState.input.slocInput = true;
            this.setState(currentState);
            if(!this.state.transition.fpVisible)
              document.querySelectorAll('#sloc')[0].focus();
            return
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

            // let budget = document.querySelectorAll('input[name="budget"]')[0].value;
            //check budget & deadline is entered
            if(this.props.projectReducer.projectWillCreate.budget == 0)
            {
                this.props.changeFindTeamBugdetError(true);
                document.querySelectorAll('input[name="budget"]')[0].focus();
                return;
            }
            if(!this.state.transition.fpVisible)
            {
            
                setTimeout(() =>{
                    document.querySelectorAll('#sloc')[0].value = this.props.estimateReducer.KLOC * 1000
                },100);
              
            }
        }

        for(let modal_name in this.state.modal)
        {
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

    render() {
        const { SLOCModal, CostDriverModal, ScaleFactorModal, SuitableStaffsModal } = this.state.modal
        const { fpVisible, fpAnimation } = this.state.transition
        const { slocInput } = this.state.input
        const estimateStep = 
              <Step.Group >
                <Step active = {SLOCModal} completed ={!SLOCModal} onClick={this.show('SLOCModal')}>
                    <Icon name='align justify' />
                  <Step.Content>
                    <Step.Title>Size In Source Lines of Code</Step.Title>
                    <Step.Description>Xác định độ lớn của dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {ScaleFactorModal} completed={((SLOCModal == false) && (ScaleFactorModal == false)) ? true : false}
                      onClick={this.show('ScaleFactorModal')}>
                  <Icon name='signal' />
                  <Step.Content>
                    <Step.Title>Scale Factors</Step.Title>
                    <Step.Description>Đánh giá yếu tố ảnh hưởng đến dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {CostDriverModal} completed={((SLOCModal == false) && (ScaleFactorModal == false) && (CostDriverModal == false)) ? true : false}
                      onClick={this.show('CostDriverModal')}>
                  <Icon name='tasks' />
                  <Step.Content>
                    <Step.Title>Cost Drivers</Step.Title>
                    <Step.Description>Đánh giá các tiêu chí về: dự án, nhân lực,...</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SuitableStaffsModal} onClick={this.estimate}>
                  <Icon name='trophy' />
                  <Step.Content>
                    <Step.Title>Your Team</Step.Title>
                    <Step.Description>Đội ngũ nhân viên</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>

        return (
        <div id="estimate">
                <Button type='button' color='orange' onClick={this.show('SLOCModal')}><Icon name='wizard' /> Find suitable team</Button>
                <Modal 
                    id = "fp-modal"
                    size="fullscreen"
                    open={SLOCModal} onClose={this.close('SLOCModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
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
                              <Label basic color='red' pointing='left'>Hãy nhập số lượng SLOC</Label>
                            }
                        </Grid.Column>
                  </Grid>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close('SLOCModal')} > <Icon name='remove' /> Hủy bỏ </Button>
                    <Button onClick={this.show('ScaleFactorModal')} primary> Tiếp <Icon name='right chevron' /></Button>
                </Modal.Actions>
                </Modal>

                <Modal 
                    id = "scale-driver-modal"
                    size="fullscreen"
                    open={ScaleFactorModal} onClose={this.close('ScaleFactorModal')}
                    closeOnDimmerClick={false}
                    closeOnDocumentClick={false}
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
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content id="suitable_staff_content" className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    
                    <Grid columns={2}>
                        <Grid.Row textAlign="center">
                            <Grid.Column textAlign="left">
                                <SuggestSuitableStaffsView />
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
                    <Button onClick={this.show('SLOCModal')} > <Icon name='repeat' color='black'/> Thử lại </Button>
                    <Button onClick={this.show('CostDriverModal')} > <Icon name='left chevron' /> Quay lại </Button>
                    <Button onClick={this.close('SuitableStaffsModal')} color='green' 
                        disabled={(!this.state.isGetSuitableStaffDone) ||  (this.props.projectReducer.acceptSuggestionStatus == NOT_DECIDED)}>
                        <Icon name='checkmark' /> Xong
                    </Button>
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
        projectReducer: state.projectReducer
    };
}

const mapDispatchToProps = {
    changeKLOC,
    getSuitableStaffs,
    changeResponsibleUser,
    changeEstimatedResult,
    changeFindTeamBugdetError,
    setAcceptSuggestionStatus,
    changeProjectWillCreate
};

export default connect(mapStateToProps, mapDispatchToProps)(Estimate);