import React from 'react';
import { connect } from 'react-redux';
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
    Message,
    Search
} from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';

import ModalEditUserSkills from './ModalEditUserSkills';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            submitIntive: false,
            emailValid: true,
            emailErrorMessage: '',
            userWaitingList: [],
            userList: [],
            isLoadingSearchUserWaiting: false, 
            userWaitingResults: [],
            userWaitingValue: '',
            isLoadingSearchUser: false, 
            userResults: [],
            userValue: ''
        };
        this._changeEmail = this._changeEmail.bind(this);
        this._handleInvite = this._handleInvite.bind(this);
        this._getUserWaitingList =this._getUserWaitingList.bind(this);
        this._getUserList = this._getUserList.bind(this);
        this._handleSearchChangeUserWaiting = this._handleSearchChangeUserWaiting.bind(this);
        this._handleSearchChangeUser = this._handleSearchChangeUser.bind(this);
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
            axios.post(`/api/users/company/${this.props.profileUser.profile.current_company._id}`, 
                { 
                    email: this.state.email
                }, 
                { headers: { 'x-access-token': localStorage.token }
            }).then(response => {
                // do some stuff here
                console.log(response);
                this.setState({
                    loading: false,
                    email: ''
                });
            });
        }
        else {
            this.setState({
                loading: false
            });
        }
    }

    _getUserList(id) {
        axios
            .get(`/api/users/all/company/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            this.setState({
                userList: response.data.users
            });
        });
    }

    _getUserWaitingList(id) {
        axios
            .get(`/api/users/waiting/company/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            this.setState({
                userWaitingList: response.data.users
            });
        });
    }

    _handleSearchChangeUser(e, { value }) {
        this.setState({
            isLoadingSearchUser: true,
            userValue: value
        });
        setTimeout(() => {
            if (value.length < 1) {
                this.setState({
                    isLoadingSearchUser: false,
                    userResults: [],
                });
            }
            else {
                const re = new RegExp(_.escapeRegExp(value), 'i');
                const isMatch = result => re.test(result.email);
          
                this.setState({
                    isLoadingSearchUser: false,
                    userResults: _.filter(this.state.userList, isMatch),
                });
            }
        }, 500);
    }

    _handleSearchChangeUserWaiting(e, { value }) {
        this.setState({
            isLoadingSearchUserWaiting: true,
            userWaitingValue: value
        });
        setTimeout(() => {
            if (value.length < 1) {
                this.setState({
                    isLoadingSearchUserWaiting: false,
                    userWaitingResults: [],
                });
            }
            else {
                const re = new RegExp(_.escapeRegExp(value), 'i');
                const isMatch = result => re.test(result.email);
          
                this.setState({
                    isLoadingSearchUserWaiting: false,
                    userWaitingResults: _.filter(this.state.userWaitingList, isMatch),
                });
            }
        }, 500);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.profileUser.profile.current_company._id) {
            this._getUserWaitingList(nextProps.profileUser.profile.current_company._id);
            this._getUserList(nextProps.profileUser.profile.current_company._id);
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
                                <Input
                                    loading={this.state.isLoadingSearchUserWaiting}
                                    onChange={this._handleSearchChangeUserWaiting}
                                    icon='search' 
                                    fluid 
                                    placeholder='Search...'
                                />
                                <List divided verticalAlign='middle' size='large' style={{maxHeight: 500, overflow: 'auto'}}>
                                    {this.state.userWaitingValue.length > 0 ? 
                                    (
                                        this.state.userWaitingResults.length > 0 ? 
                                            [...this.state.userWaitingResults].map((user) => (
                                                <List.Item>
                                                    <List.Content floated='right' style={{marginTop: 5}}>
                                                        <Label color='red' size='small'>Waiting</Label>
                                                    </List.Content>
                                                    <Image avatar src={user.image}/>
                                                    <List.Content>
                                                        {user.email}
                                                    </List.Content>
                                                </List.Item>
                                            )) :
                                            <List.Item>
                                                <List.Content>
                                                    <h4 style={{textIndent: 10}}>No results found.</h4>
                                                </List.Content>
                                            </List.Item>
                                    ) :
                                    [...this.state.userWaitingList].map((user) => (
                                        <List.Item>
                                            <List.Content floated='right' style={{marginTop: 5}}>
                                                <Label color='red' size='small'>Waiting</Label>
                                            </List.Content>
                                            <Image avatar src={user.image}/>
                                            <List.Content>
                                                {user.email}
                                            </List.Content>
                                        </List.Item>
                                    ))
                                    }
                                </List>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                        <Grid.Row>
                            <Segment color='teal'>
                                <Header as='h2'>User List</Header>
                                <Input
                                    loading={this.state.isLoadingSearchUser}
                                    onChange={this._handleSearchChangeUser}
                                    icon='search' 
                                    fluid 
                                    placeholder='Search...'
                                />
                                <List divided verticalAlign='middle' size='large' style={{maxHeight: 500, overflow: 'auto'}}>
                                    {this.state.userValue.length > 0 ? 
                                    (
                                        this.state.userResults.length > 0 ? 
                                            [...this.state.userResults].map((user) => (
                                                <List.Item>
                                                    <List.Content floated='right' style={{marginTop: 5}}>
                                                        <Label color='red' size='small'>Waiting</Label>
                                                    </List.Content>
                                                    <Image avatar src={user.image}/>
                                                    <List.Content>
                                                        {user.email}
                                                    </List.Content>
                                                </List.Item>
                                            )) :
                                            <List.Item>
                                                <List.Content>
                                                    <h4 style={{textIndent: 10}}>No results found.</h4>
                                                </List.Content>
                                            </List.Item>
                                    ) :
                                    [...this.state.userList].map((user) => (
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <ModalEditUserSkills user={user} />
                                            </List.Content>
                                            <Image avatar src={user.image}/>
                                            <List.Content>
                                                {user.email}
                                            </List.Content>
                                        </List.Item>
                                    ))
                                    }
                                </List>
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>

                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer
	};
}

export default connect(mapStateToProps)(Dashboard);