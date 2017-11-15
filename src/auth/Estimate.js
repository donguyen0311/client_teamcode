import React from 'react';
import {connect} from 'react-redux';
import {
	Button,
	Container,
	Divider,
	Icon,
	Grid,
	Input,
	Menu,
	Label,
	Table
} from 'semantic-ui-react';
import {login, changeLoginForm} from './AuthActions';
import {
	SCALE_FACTORS,
	NOMINAL_RATING_VALUE,
	EAF,
	COEFFICIENT,
	FUNCTION_POINT,
	FUNCTION_POINT_TO_SLOC
 } from '../app/COCOMO.js'
 
import CostDriver from '../auth/CostDriver';
import ScaleFactor from '../auth/ScaleFactor';
import FunctionPoint from '../auth/FunctionPoint';

class Estimate extends React.Component {
    constructor(props) {
			super(props);

		}
    render() {
    	const estimate = 
  			<Container>
	    		<h2>Kết quả </h2>
	    		<h3>Persons/Month: <span id="PM">0</span></h3>
	    		<h3>Time Development: <span id="TDEV">0</span></h3>
	    		<h3>Total Person: <span id="PC">0</span></h3>
				  <Input
				    label={{ basic: true, content: 'KLOC' }}
				    labelPosition='right'
				    placeholder='Nhập số lượng KSLOC...'
				  />
			    <Button className="inline-block">
				    Tiến hành ước lượng
				  </Button>
			  </Container>
        return (
        	<Container id="estimate">
	    		<CostDriver/>
	    		<Divider section />
	    		<ScaleFactor/>
	    		<Divider section />
	    		<FunctionPoint/>    		
	    		<Divider section />
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

        );
    }
}

export default Estimate;
