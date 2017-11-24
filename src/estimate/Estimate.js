import React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Container,
    Divider,
    Grid,
    Input,
    Label,
    Modal,
    Header,
    Icon,
    Transition,
    Step,
    Image,
    Statistic,
    Rating,
    Table
} from 'semantic-ui-react';
import {
    SCALE_FACTORS,
    NOMINAL_RATING_VALUE,
    EAF,
    COEFFICIENT,
    FUNCTION_POINT,
    FUNCTION_POINT_TO_SLOC
 } from '../app/COCOMO.js'
 
import CostDriver from './CostDriver';
import ScaleFactor from './ScaleFactor';
import FunctionPoint from './FunctionPoint';

import {
    changeKLOC,
    getSuitableStaffs
} from './estimateActions'

class Estimate extends React.Component {
    constructor(props) {
        super(props);
        this.estimate = this.estimate.bind(this);
        this.onInputSLOCChange = this.onInputSLOCChange.bind(this);
        this.caculateEAF = this.caculateEAF.bind(this);
        this.caculateScaleFactors = this.caculateScaleFactors.bind(this);

    }
    estimate(){
        

        let currentState;

        if(this.state.estimatedResult.projectCost != 0)
        {
          currentState = {...this.state}
          currentState.estimatedResult.projectCost = 0
          this.setState(currentState) 
        }

        if(this.state.modal.CostDriverModal)
        {
            currentState = {...this.state}
            currentState.modal['CostDriverModal'] = false
            currentState.modal['SuitableStaffsModal'] = true
            this.setState(currentState)
        }

        var E = COEFFICIENT.B+0.01*(this.caculateScaleFactors(this.props.input_project));

        //persons-months nominal schedule
        var PMns = COEFFICIENT.A * Math.pow(this.props.input_project.KLOC,E) * this.caculateEAF(this.props.input_project);

        //persons-months
        var PMs = COEFFICIENT.A * Math.pow(this.props.input_project.KLOC,E) * this.caculateEAF(this.props.input_project);

        // time development
        var TDEV = COEFFICIENT.C * Math.pow(PMns,(COEFFICIENT.D+0.2*(E-COEFFICIENT.B)));

        //total person need (person count)
        var PM = PMs / TDEV;

        currentState = {...this.state}
        currentState.estimatedResult.original.PMs = PMs;
        currentState.estimatedResult.original.TDEV = TDEV;
        currentState.estimatedResult.original.PM = PM;

        currentState.estimatedResult.ceil.PMs = Math.ceil(PMs);
        currentState.estimatedResult.ceil.TDEV = Math.ceil(TDEV);
        currentState.estimatedResult.ceil.PM = Math.ceil(PM);
        this.setState(currentState)

        // document.getElementById("PMs").innerHTML = PMs;
        // document.getElementById("TDEV").innerHTML = TDEV;
        // document.getElementById("PM").innerHTML = PM;

        currentState = {...this.state}
        this.props.getSuitableStaffs({
          person_month: this.state.estimatedResult.ceil.PM,
          analyst_capability: (this.props.input_project.EAF.ACAP == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.ACAP)+1,
          programmer_capability: (this.props.input_project.EAF.PCAP == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.PCAP)+1,
          application_experience: (this.props.input_project.EAF.APEX == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.APEX)+1,
          platform_experience: (this.props.input_project.EAF.PLEX == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.PLEX)+1,
          language_and_toolset_experience: (this.props.input_project.EAF.LTEX == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.LTEX)+1,
        })
        .then((response) => {
            let data = response.data
            // console.log(data)
            currentState.suitableStaffs = data.suitableStaffs
            currentState.estimatedResult.projectCost = data.projectCost
            this.setState(currentState)
        })

        // this.props.getSuitableStaffs({
        //   person_month: this.state.estimatedResult.ceil.PM,
        //   analyst_capability: (this.props.input_project.EAF.ACAP == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.ACAP)+1,
        //   programmer_capability: (this.props.input_project.EAF.PCAP == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.PCAP)+1,
        //   application_experience: (this.props.input_project.EAF.APEX == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.APEX)+1,
        //   platform_experience: (this.props.input_project.EAF.PLEX == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.PLEX)+1,
        //   language_and_toolset_experience: (this.props.input_project.EAF.LTEX == undefined) ? NOMINAL_RATING_VALUE : parseInt(this.props.input_project.EAF.LTEX)+1,
        // }).then(abc){
        //   console.log(abc);
        // });


    }

    caculateEAF(){
        let EAF_value = 1;
        
        EAF.forEach((factor, factor_index) => {
            let factor_name = Object.keys(factor)[0];
            let rating_level = this.props.input_project.EAF[factor_name];
            if(rating_level != undefined)
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
            let rating_level = this.props.input_project.SCALE_FACTORS[factor_name];
            
            if(rating_level != undefined)
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
            SLOCModal: false,
            ScaleFactorModal: false,
            CostDriverModal: false,
            SuitableStaffsModal: false  
        },
        transition:{
            fpVisible: false,
            fpAnimation: 'drop'
        },
        input:{
          slocInput: false
        },
        suitableStaffs:[],
        estimatedResult: {
            original:{
                PMs: 0,
                TDEV: 0,
                PM: 0
            },
            ceil:{
                PMs: 0,
                TDEV: 0,
                PM: 0
            },
            projectCost: 0,
        },
        stickyRef: {}
    }
    show = element => () => {
        // this.setState({[element]: true })  
        if(element != 'SLOCModal')
        {
          let currentState;
          if (this.props.input_project.KLOC == 0)
          {
            currentState = {...this.state}
            currentState.input.slocInput = true
            this.setState(currentState)
            if(!this.state.transition.fpVisible)
              document.querySelectorAll('#sloc')[0].focus()
            return
          }
          else
          {

            currentState = {...this.state}
            currentState.input.slocInput = false
            this.setState(currentState)
          }

        }
        else
        {
            
            if(!this.state.transition.fpVisible)
            {
            
                setTimeout(() =>{
                    document.querySelectorAll('#sloc')[0].value = this.props.input_project.KLOC * 1000
                },100);
              
            }
        }

        for(let modal_name in this.state.modal)
        {
            let currentState;
            if(modal_name == element){
                currentState = {...this.state}
                currentState.modal[modal_name] = true
                this.setState(currentState)
            }
            else{
                currentState = {...this.state}
                currentState.modal[modal_name] = false
                this.setState(currentState)
            }
        }   
        // if(element == 'SLOCModal')  
          // document.querySelectorAll('#sloc').focus()
    }
    close = element => () => {
        let currentState = {...this.state}
        currentState.modal[element] = false
        this.setState(currentState)
    }
    handleVisibility = transition_name => () => {
        let currentState = {...this.state}
        currentState.transition[transition_name] = !this.state.transition[transition_name] 
        this.setState(currentState)

        // hidden sloc error message
        currentState = {...this.state}
        currentState.input.slocInput = false
        this.setState(currentState)
    }
    render() {
        const { SLOCModal, CostDriverModal, ScaleFactorModal, SuitableStaffsModal } = this.state.modal
        const { fpVisible, fpAnimation } = this.state.transition
        const { slocInput } = this.state.input
        const { suitableStaffs } = this.state.suitableStaffs
        const { stickyRef } = this.state.stickyRef
        const estimateStep = 
              <Step.Group >
                <Step active = {SLOCModal} completed ={!SLOCModal}>
                    <Icon name='align justify' />
                  <Step.Content>
                    <Step.Title>Size In Source Lines of Code</Step.Title>
                    <Step.Description>Xác định độ lớn của dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {ScaleFactorModal} completed={((SLOCModal == false) && (ScaleFactorModal == false)) ? true : false}>
                  <Icon name='signal' />
                  <Step.Content>
                    <Step.Title>Scale Factors</Step.Title>
                    <Step.Description>Đánh giá yếu tố ảnh hưởng đến dự án</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {CostDriverModal} completed={((SLOCModal == false) && (ScaleFactorModal == false) && (CostDriverModal == false)) ? true : false}>
                  <Icon name='tasks' />
                  <Step.Content>
                    <Step.Title>Cost Drivers</Step.Title>
                    <Step.Description>Đánh giá các tiêu chí về: dự án, nhân lực,...</Step.Description>
                  </Step.Content>
                </Step>

                <Step active = {SuitableStaffsModal}>
                  <Icon name='trophy' />
                  <Step.Content>
                    <Step.Title>Your Team</Step.Title>
                    <Step.Description>Đội ngũ nhân viên</Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>


        const suitableStaffsView = this.state.suitableStaffs.map((staff, staffIndex) => {
            return (
          <Grid.Column className="suitable_staff">
            <Grid.Row>
                <Grid.Column>
                    <Image className="margin_top_7" src={`/images/users/${staff.gender ? 'male' : 'female'}/${Math.round(Math.random()*14+1)}.jpg`} width="173" height="173" centered/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="suitable_staff_content">
                <Grid.Column>
                    <Grid columns={2} className="no_margin">
                        <Grid.Row>
                            <Grid.Column width={13} className="no_padding">
                                <p className="suitable_staff_name">{staff.lastname+' '+staff.firstname}</p>
                            </Grid.Column>
                            <Grid.Column textAlign="right" width={3} className="no_padding">
                                <Icon name={staff.gender ? 'man' : 'woman'} size="large" color={staff.gender ? 'blue' : 'pink'}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid.Row>
                      <Grid.Column className="no_padding">
                        <p><Icon name="money" />Lương: {staff.salary} <Icon name="usd" /></p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid columns={2} className="no_margin">
                            <Grid.Row>
                                <Grid.Column className="no_padding">
                                    <p><Icon name="write" />ACAP: {staff.analyst_capability}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></p>
                                    <p><Icon name="code" />PCAP: {staff.programmer_capability}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></p>
                                </Grid.Column>
                                <Grid.Column className="no_padding">
                                    <p><Icon name="edit" />APEX: {staff.application_experience}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></p>
                                    <p><Icon name="cloud upload" size="medium" />PLEX: {staff.platform_experience}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></p>
                                    <p><Icon name="wrench" size="medium" />LTEX: {staff.language_and_toolset_experience}<Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/></p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Divider section className="no_margin"/>
                    <Grid className="no_margin">
                        <Grid.Row>
                            <Grid.Column textAlign="center">
                                <Button color='blue'>Thông tin cá nhân</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            </Grid.Row>
          </Grid.Column>
            )
        })

        const estimatedStatistics = 
            <Grid columns={1} className="estimated_statistics_fixed">
                <Grid.Row textAlign="center">
                    <Grid.Column textAlign="center">
                      <Header as='h2'>Thông số dự án</Header>
                      <Statistic>
                        <Statistic.Value>
                          {this.state.estimatedResult.ceil.TDEV} <Icon name="calendar"/>
                        </Statistic.Value>
                        <Statistic.Label>Tháng</Statistic.Label>
                      </Statistic>

                      <Statistic>
                        <Statistic.Value>
                          {this.state.estimatedResult.ceil.PM} <Icon name={this.state.estimatedResult.ceil.PM > 1 ? 'users':'user'}/>
                        </Statistic.Value>
                        <Statistic.Label>Người/Tháng</Statistic.Label>
                      </Statistic>

                      <Statistic>
                        <Statistic.Value>
                          {this.state.estimatedResult.projectCost} <Icon name="usd"/>
                        </Statistic.Value>
                        <Statistic.Label>Chi Phí/Tháng</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="left">
                    <Grid.Column textAlign="left">
                      <Table celled>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Tiêu chí về nhân lực</Table.HeaderCell>
                            <Table.HeaderCell>Đánh giá</Table.HeaderCell>
                            <Table.HeaderCell>Khả năng</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          <Table.Row>
                            <Table.Cell><Icon name='write' /> Analyst Capability <code>(ACAP)</code></Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.input_project.EAF.ACAP == undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.input_project.EAF.ACAP)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'ACAP')['ACAP'].rating[
                                (this.props.input_project.EAF.ACAP == undefined) ? NOMINAL_RATING_VALUE : this.props.input_project.EAF.ACAP
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='code' /> Programmer Capability (PCAP)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.input_project.EAF.PCAP == undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.input_project.EAF.PCAP)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'PCAP')['PCAP'].rating[
                                (this.props.input_project.EAF.PCAP == undefined) ? NOMINAL_RATING_VALUE : this.props.input_project.EAF.PCAP
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='edit' /> Application Experience (APEX)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.input_project.EAF.APEX == undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.input_project.EAF.APEX)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'APEX')['APEX'].rating[
                                (this.props.input_project.EAF.APEX == undefined) ? NOMINAL_RATING_VALUE : this.props.input_project.EAF.APEX
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='cloud upload' /> Platform Experience (PLEX)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.input_project.EAF.PLEX == undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.input_project.EAF.PLEX)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'PLEX')['PLEX'].rating[
                                (this.props.input_project.EAF.PLEX == undefined) ? NOMINAL_RATING_VALUE : this.props.input_project.EAF.PLEX
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='wrench' /> Language & Tool Experience (LTEX)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.input_project.EAF.LTEX == undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.input_project.EAF.LTEX)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'LTEX')['LTEX'].rating[
                                (this.props.input_project.EAF.LTEX == undefined) ? NOMINAL_RATING_VALUE : this.props.input_project.EAF.LTEX
                                ].description}
                            </Table.Cell>
                          </Table.Row>                           
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
             
        const estimate = 
            <Container>
                <h2>Kết quả </h2>
                <h3>Persons/Months: <span id="PMs">0</span></h3>
                <h3>Time Development: <span id="TDEV">0</span></h3>
                <h3>Total Person: <span id="PM">0</span></h3>
              </Container>


        return (
        <div id="estimate">
            <Container>
                
                <h2>Nhân Viên Phù Hợp Với Dự Án</h2>
                <Button onClick={this.show('SLOCModal')}>Tiến hành ước lượng</Button>
                <Modal 
                    id = "fp-modal"
                    size="fullscreen"
                    open={SLOCModal} onClose={this.close('SLOCModal')}
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
                    >
                <Modal.Header>{estimateStep}</Modal.Header>
                <Modal.Content id="suitable_staff_content" className="estimate_maxHeight" scrolling>
                  <Modal.Description>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns={3}>
                                    {suitableStaffsView}
                                </Grid>
                            </Grid.Column>
                            <Grid.Column >
                                {estimatedStatistics}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.show('SLOCModal')} > <Icon name='repeat' color='black'/> Thử lại </Button>
                    <Button onClick={this.show('CostDriverModal')} > <Icon name='left chevron' /> Quay lại </Button>
                    <Button onClick={this.close('SuitableStaffsModal')} color='green'> Xong  <Icon name='checkmark' /></Button>
                </Modal.Actions>
                </Modal>

                <Grid divided='vertically'>
                        <Grid.Row columns={3}>
                            <Grid.Column>
                          </Grid.Column>
                          <Grid.Column width={10}>
                            {
                                estimate
                            }
                          </Grid.Column>
                    </Grid.Row>
                  </Grid>                           

            </Container>
        </div>
        );
    }
}

// export default Estimate;


const mapStateToProps = (state) => {
    return {input_project: state.estimateReducer};
}

const mapDispatchToProps = {
    changeKLOC,
    getSuitableStaffs
};

export default connect(mapStateToProps, mapDispatchToProps)(Estimate);