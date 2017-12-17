import React from 'react';
import {
    Grid,
    Container,
    Header,
    Segment,
    Form,
    Button,
    Image,
    List,
    Label,
    Input,
    Message
} from 'semantic-ui-react';
import axios from 'axios';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            submitIntive: false,
            emailValid: true,
            emailErrorMessage: ''
        };
        this._changeEmail = this._changeEmail.bind(this);
        this._handleInvite = this._handleInvite.bind(this);
    }
    _changeEmail(e) {
        this.setState({
            email: e.target.value
        });
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(e.target.value)) {
            this.setState({
                emailValid: regex.test(e.target.value),
                emailErrorMessage: '',
                email: e.target.value
            });
        }
        else {
            this.setState({
                emailValid: regex.test(e.target.value),
                emailErrorMessage: 'Your email is invalid.',
                email: e.target.value
            });
        }
    }
    _handleInvite() {
        this.setState({
            loading: true
        });
        if (this.state.emailValid) {
            console.log(this.state.email);
            axios.post('/api/users/', 
                { email: this.state.email}, 
                { headers: { 'x-access-token': localStorage.token }
            }).then(response => {
                // do some stuff here
                this.setState({
                    loading: false
                });
            });
        }
        else {
            this.setState({
                loading: false
            });
        }
    }
    render() {
        return (
            <Container>
                <Grid>
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                        <Grid.Row>
                            <Segment color='blue'>
                                <Header as='h2'>Invite</Header>
                                <Form onSubmit={this._handleInvite}>     
                                    <Form.Input size='big' label='Email' placeholder='example@gmail.com' onChange={this._changeEmail} required/>
                                    <Message
                                        visible={!this.state.emailValid}
                                        error
                                        header='Error'
                                        content={this.state.emailErrorMessage}
                                    />
                                    {!this.state.loading ? 
                                        <Form.Button fluid size='large' type='submit' color='blue'>Invite</Form.Button> : 
                                        <Form.Button fluid size='large' loading disabled color='blue'>Invite</Form.Button>
                                    }
                                </Form>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Grid.Row>
                            <Segment color='red'>
                                <Header as='h2'>User Waiting</Header>
                                <Input icon='search' fluid placeholder='Search...' />
                                <List divided verticalAlign='middle' size='large' style={{maxHeight: 500, overflow: 'auto'}}>
                                    {[...Array(5)].map(() => (
                                        <List.Item>
                                            <List.Content floated='right' style={{marginTop: 5}}>
                                                <Label color='red' size='small'>Waiting</Label>
                                            </List.Content>
                                            <Image avatar src='/assets/images/no_image.png'/>
                                            <List.Content>
                                                example@gmail.com
                                            </List.Content>
                                        </List.Item>
                                    ))}
                                </List>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Grid.Row>
                            <Segment color='teal'>
                                <Header as='h2'>User List</Header>
                                <Input icon='search' fluid placeholder='Search...' />
                                <List divided verticalAlign='middle' size='large' style={{maxHeight: 500, overflow: 'auto'}}>
                                    {[...Array(25)].map(() => (
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <Button>Add</Button>
                                            </List.Content>
                                            <Image avatar src='/assets/images/no_image.png'/>
                                            <List.Content>
                                                example2@gmail.com
                                            </List.Content>
                                        </List.Item>
                                    ))}
                                </List>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>

                </Grid>
            </Container>
        );
    }
}