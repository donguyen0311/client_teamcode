import React from 'react';
import {connect} from 'react-redux';
import {
    Container,
    Dropdown,
    Input,
    Icon,
    Menu,
    Label,
    Table,
    Rating,
    Popup,
    Grid,
    Statistic
} from 'semantic-ui-react';
import {
    FUNCTION_POINT,
    FUNCTION_POINT_TO_SLOC
 } from '../app/COCOMO.js'

 import {
    changeKLOC
} from './estimateActions'

class FunctionPoint extends React.Component {
        constructor(props) {
            super(props);
            this.caculateAndDisplaySLOC = this.caculateAndDisplaySLOC.bind(this);
            this.caculateAndDisplayTotalFP = this.caculateAndDisplayTotalFP.bind(this);
            this.dropdownOnChange = this.dropdownOnChange.bind(this);
            this.onInputChange = this.onInputChange.bind(this);
            this.selectedLanguage = '';
            this.languageList = [
                {
                    key:'c',
                    value:'c',
                    text: 'C',
                    SLOC: 128
                },
                {
                    key:'c++',
                    value:'c++',
                    text: 'C++',
                    SLOC: 29
                },
                {
                    key:'php',
                    value:'php',
                    text: 'PHP',
                    SLOC: 67
                },
                {
                    key:'java',
                    value:'java',
                    text: 'Java',
                    SLOC: 31
                },
            ];
        this.FUNCTION_POINT = {};
        }
        caculateAndDisplayTotalFP(){
            var totalFP = 0;
            var inputsFP = document.getElementsByClassName("FP");
            Array.prototype.forEach.call(inputsFP, function(inputFP) {
                var fpCount = inputFP.value;
                    var elementId = inputFP.id;
                    var fp_type = elementId.split("_")[0];
                    var weightLevel = elementId.split("_")[1];
                if(fpCount != 0)
                {
                    totalFP+= fpCount*FUNCTION_POINT.find(fps_type => Object.keys(fps_type) == fp_type)[fp_type].weight[weightLevel];
                }
            });
            document.getElementById("total_fp").innerHTML=totalFP;
            return totalFP;
            
        }
        caculateAndDisplaySLOC(totalFP, selectedLanguage){
            var SLOC = 0;
            if(totalFP > 0)
            {
                SLOC=totalFP*FUNCTION_POINT_TO_SLOC[selectedLanguage];
            }
            if(!(isNaN(SLOC)))
                document.getElementById('total_SLOC').innerHTML=SLOC;
            
            this.props.changeKLOC(SLOC/1000);
            return SLOC;
        }
        
        dropdownOnChange(event,selectedOption){
            this.selectedLanguage = selectedOption.value;
            var totalFP = this.caculateAndDisplayTotalFP();
            this.caculateAndDisplaySLOC(totalFP, selectedOption.value);
        }
        
        onInputChange(e){
            var totalFP = this.caculateAndDisplayTotalFP();
            this.caculateAndDisplaySLOC(totalFP, this.selectedLanguage);
        }
    render() {

            
            const NOMINAL_RATING_VALUE = 2;
            const fpHelpTable = 
                <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Loại FP</Table.HeaderCell>
                        <Table.HeaderCell>Mô tả</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                                FUNCTION_POINT.map((fpType, fpTypeIndex) => {
                                    return (
                                        <Table.Row>
                                            <Table.Cell>
                                                {fpType[Object.keys(fpType)].standfor+' ('+Object.keys(fpType)+')'}
                                            </Table.Cell>
                                            <Table.Cell width={12}>
                                                {fpType[Object.keys(fpType)].description}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                      }
                    </Table.Body>                   
                </Table>

            const fpTypes = FUNCTION_POINT.map((fpType, fpTypeIndex) => {
                return (
                    <Table.Row>
                        <Table.Cell>{fpType[Object.keys(fpType)].standfor+' ('+Object.keys(fpType)+')'}</Table.Cell>
                        {
                            fpType[Object.keys(fpType)].weight.map((fpWeight, fpWeightIndex) => {
                                return (
                                    <Table.Cell>
                                        <div className="ui input">
                                            <input  type="text" 
                                                    id={Object.keys(fpType)+'_'+fpWeightIndex} 
                                                    className="FP"
                                                    placeholder="0" size="10" 
                                                    onChange={this.onInputChange}
                                                    val={0}/>
                                        </div>
                                    </Table.Cell>
                                    )
                            })
                        }
                        
                    </Table.Row>
                )
            })

        return (
        <section id="function_point">
            <h2> Function Point 
                <Popup
                            trigger={<Icon name="help circle"/>}
                            position='top left'
                            flowing
                            hoverable
                          >
                            {fpHelpTable}
                      </Popup>
            </h2>
            <Grid divided='vertically'>
                <Grid.Row columns={2}>
                    <Grid.Column textAlign="center" width={11}>
                        <Table celled>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>Function Point</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Simple</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Average</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">High</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {fpTypes}
                            </Table.Body>                   
                        </Table>
                      </Grid.Column>
                  
                      <Grid.Column width={5}>
                        <Icon name="world" size="big" />
                        <Dropdown placeholder='Hãy chọn một ngôn ngữ' search selection options={this.languageList} onChange={this.dropdownOnChange}/>
                        <Statistic.Group>
                            <Statistic color='blue'>
                              <Statistic.Value><span id="total_fp">0</span></Statistic.Value>
                              <Statistic.Label>FP</Statistic.Label>
                            </Statistic>
                            <Statistic color='red'>
                              <Statistic.Value><span id="total_SLOC">0</span></Statistic.Value>
                              <Statistic.Label>SLOC</Statistic.Label>
                            </Statistic>
                        </Statistic.Group>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
            </section>

        );
    }
}

const mapStateToProps = (state) => {
    return {input_project: state.estimateReducer};
}

const mapDispatchToProps = {
    changeKLOC
};

export default connect(mapStateToProps, mapDispatchToProps)(FunctionPoint);