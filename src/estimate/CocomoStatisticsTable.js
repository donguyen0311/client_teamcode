import React from 'react';
import {connect} from 'react-redux';
import {
    Grid,
    Icon,
    Rating,
    Table
} from 'semantic-ui-react';

import {
    NOMINAL_RATING_VALUE,
    EAF
 } from '../app/COCOMO.js'

class CocomoStatisticsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid>
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
                              {(this.props.estimateReducer.EAF.ACAP === undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.estimateReducer.EAF.ACAP)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'ACAP')['ACAP'].rating[
                                (this.props.estimateReducer.EAF.ACAP === undefined) ? NOMINAL_RATING_VALUE : this.props.estimateReducer.EAF.ACAP
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='code' /> Programmer Capability (PCAP)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.estimateReducer.EAF.PCAP === undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.estimateReducer.EAF.PCAP)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'PCAP')['PCAP'].rating[
                                (this.props.estimateReducer.EAF.PCAP === undefined) ? NOMINAL_RATING_VALUE : this.props.estimateReducer.EAF.PCAP
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='edit' /> Application Experience (APEX)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.estimateReducer.EAF.APEX === undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.estimateReducer.EAF.APEX)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'APEX')['APEX'].rating[
                                (this.props.estimateReducer.EAF.APEX === undefined) ? NOMINAL_RATING_VALUE : this.props.estimateReducer.EAF.APEX
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='cloud upload' /> Platform Experience (PLEX)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.estimateReducer.EAF.PLEX === undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.estimateReducer.EAF.PLEX)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'PLEX')['PLEX'].rating[
                                (this.props.estimateReducer.EAF.PLEX === undefined) ? NOMINAL_RATING_VALUE : this.props.estimateReducer.EAF.PLEX
                                ].description}
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell><Icon name='wrench' /> Language & Tool Experience (LTEX)</Table.Cell>
                            <Table.Cell textAlign="center">
                              {(this.props.estimateReducer.EAF.LTEX === undefined) ? NOMINAL_RATING_VALUE : (parseInt(this.props.estimateReducer.EAF.LTEX)+1) }
                              <Rating maxRating={1} defaultRating={1} icon='star' size='mini' disabled/>
                            </Table.Cell>
                            <Table.Cell>
                              {EAF.find(factor => Object.keys(factor) == 'LTEX')['LTEX'].rating[
                                (this.props.estimateReducer.EAF.LTEX === undefined) ? NOMINAL_RATING_VALUE : this.props.estimateReducer.EAF.LTEX
                                ].description}
                            </Table.Cell>
                          </Table.Row>                           
                        </Table.Body>
                      </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        estimateReducer: state.estimateReducer
    };
}

export default connect(mapStateToProps)(CocomoStatisticsTable);