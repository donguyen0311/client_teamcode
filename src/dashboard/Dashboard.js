import React from 'react';
import SideBar from '../app/Sidebar';
import { Grid, Container, Header, Segment } from 'semantic-ui-react';

import {Doughnut} from 'react-chartjs-2';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);  
    } 

    componentDidMount() {
        
    }  

    rand(min, max, num) {
        var rtn = [];
        while (rtn.length < num) {
          rtn.push((Math.random() * (max - min)) + min);
        }
        return rtn;
      }

    render() {
        var chartData = {
            labels: ["To Do", "In Progress", "Code Review", "Done"],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: ['rgb(181, 204, 24)', 'rgb(33, 133, 208)', 'rgb(219, 40, 40)', 'rgb(33, 186, 69)'],
                    data: this.rand(32, 100, 4)
                }
            ]
          }
          var options = {
            legend: {
                display: true,
                position: 'left'
            },
            title: {
                display: true,
                text: 'Project 1',
                fontSize: 20
            }
          }
        return (    
            <Grid style={{marginLeft: 250, marginTop: 0}}>
                <Grid.Row>
                    <Grid.Column mobile={8} tablet={4} computer={3}>
                        <Segment>
                            <Header as='h1'>ABC</Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={8} tablet={4} computer={3}>
                        <Segment>
                            <Header as='h1'>ABC</Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={8} tablet={4} computer={3}>
                        <Segment>
                            <Header as='h1'>ABC</Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={8} tablet={4} computer={3}>
                        <Segment>
                            <Header as='h1'>ABC</Header>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={8} tablet={4} computer={3}>
                        <Segment>
                            <Header as='h1'>ABC</Header>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={8} computer={4}>
                        <Segment>
                            <Doughnut data={chartData} options={options}/>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>    
        );
    }
}