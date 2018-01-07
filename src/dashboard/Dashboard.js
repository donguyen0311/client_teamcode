import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Container,
    Header,
    Segment,
    Form,
    Image,
    List,
    Label,
    Input,
    Icon,
    Message,
    Button
} from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css';

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
            userValue: '',
            showAlert: false,
            contentAlert: '',
            typeAlert: 'success',
        };
        this._changeEmail = this._changeEmail.bind(this);
        this._handleInvite = this._handleInvite.bind(this);
        this._getUserWaitingList =this._getUserWaitingList.bind(this);
        this._getUserList = this._getUserList.bind(this);
        this._handleSearchChangeUserWaiting = this._handleSearchChangeUserWaiting.bind(this);
        this._handleSearchChangeUser = this._handleSearchChangeUser.bind(this);
        this._cancelUserWaiting = this._cancelUserWaiting.bind(this);
        this._deleteUser = this._deleteUser.bind(this);
        this._showAlert = this._showAlert.bind(this);
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
                if(response.data.success) {
                    this._showAlert('Invite Successful.', 'success', 2000);
                } else {
                    this._showAlert('Invite Failed.', 'error', 2000);
                }
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
            if(response.data.success) {
                this.setState({
                    userList: response.data.users
                });
            }
            console.log(response);
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
            if(response.data.success) {
                this.setState({
                    userWaitingList: response.data.users
                });
            }
            console.log(response);
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

    _cancelUserWaiting(id) {
        axios
            .delete(`/api/users/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            if(response && response.data.success) {
                this._showAlert('Cancel Successful.', 'success', 2000);
            } else {
                this._showAlert('Cancel Failed.', 'error', 2000);
            }
            console.log(response);
        });
    }

    _deleteUser(id) {
        axios
            .delete(`/api/users/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            if(response && response.data.success) {
                this._showAlert('Delete Successful.', 'success', 2000);
            } else {
                this._showAlert('Delete Failed.', 'error', 2000);
            }
            console.log(response);
        });
    }

    _showAlert(content, type, timeout) {
        this.setState({
            showAlert: true,
            typeAlert: type,
            contentAlert: content
        });
        setTimeout(() => {
            this.setState({
                showAlert: false,
                typeAlert: 'success',
                contentAlert: ''
            });
        }, timeout);
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
                <SweetAlert
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />
                {this.props.profileUser.profile.admin === 1 ? (
                    <Grid>
                        <Grid.Column mobile={16} tablet={16} computer={16}>
                            <Grid.Row>
                                <Segment color='blue'>
                                    <Header as='h2'>Mời nhân viên</Header>
                                    <Form onSubmit={this._handleInvite}>     
                                        <Form.Input size='big' label='Email' placeholder='example@gmail.com' onChange={this._changeEmail} required/>
                                        <Message
                                            visible={!this.state.emailValid}
                                            error
                                            header='Error'
                                            content={this.state.emailErrorMessage}
                                        />
                                        {!this.state.loading ? 
                                            <Form.Button fluid size='large' type='submit' color='blue'>Mời</Form.Button> : 
                                            <Form.Button fluid size='large' loading disabled color='blue'>Mời</Form.Button>
                                        }
                                    </Form>
                                </Segment>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <Grid.Row>
                                <Segment color='red'>
                                    <Header as='h2'>Danh sách đang mời</Header>
                                    <Input
                                        loading={this.state.isLoadingSearchUserWaiting}
                                        onChange={this._handleSearchChangeUserWaiting}
                                        icon='search' 
                                        fluid 
                                        placeholder='Tìm kiếm...'
                                    />
                                    <List animated divided verticalAlign='middle' size='large' style={{maxHeight: 500, overflow: 'auto'}}>
                                        {this.state.userWaitingValue.length > 0 ? 
                                        (
                                            this.state.userWaitingResults.length > 0 ? 
                                                [...this.state.userWaitingResults].map((user) => (
                                                    <List.Item key={user._id}>
                                                        <List.Content floated='right' style={{marginTop: 5}}>
                                                            <Label color='green' size='small'>Đang chờ</Label>
                                                            <Label color='red' size='small' as='button' style={{cursor: 'pointer'}} onClick={this._cancelUserWaiting.bind(this, user._id)}>Hủy</Label>
                                                        </List.Content>
                                                        <Image avatar src={user.image}/>
                                                        <List.Content>
                                                            {user.email}
                                                        </List.Content>
                                                    </List.Item>
                                                )) :
                                                <List.Item>
                                                    <List.Content>
                                                        <h4 style={{textIndent: 10}}>Không tìm thấy kết quả.</h4>
                                                    </List.Content>
                                                </List.Item>
                                        ) :
                                        [...this.state.userWaitingList].map((user) => (
                                            <List.Item key={user._id}>
                                                <List.Content floated='right' style={{marginTop: 5}}>
                                                    <Label color='green' size='small'>Đang chờ</Label>
                                                    <Label color='red' size='small' as='button' style={{cursor: 'pointer'}} onClick={this._cancelUserWaiting.bind(this, user._id)}>Hủy</Label>
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
                                    <Header as='h2'>Danh sách nhân viên</Header>
                                    <Input
                                        loading={this.state.isLoadingSearchUser}
                                        onChange={this._handleSearchChangeUser}
                                        icon='search' 
                                        fluid 
                                        placeholder='Tìm kiếm...'
                                    />
                                    <List animated divided verticalAlign='middle' size='large' style={{maxHeight: 500, overflow: 'auto'}}>
                                        {this.state.userValue.length > 0 ? 
                                        (
                                            this.state.userResults.length > 0 ? 
                                                [...this.state.userResults].map((user) => (
                                                    <List.Item key={user._id}>
                                                        <List.Content floated='right' style={{marginTop: 5}}>
                                                            <ModalEditUserSkills user={user} />
                                                            {/* <Button onClick={this._deleteUser.bind(this, user._id)} >Xóa</Button> */}
                                                        </List.Content>
                                                        <Image avatar src={user.image}/>
                                                        <List.Content>
                                                            {user.email}
                                                        </List.Content>
                                                    </List.Item>
                                                )) :
                                                <List.Item>
                                                    <List.Content>
                                                        <h4 style={{textIndent: 10}}>Không tìm thấy kết quả.</h4>
                                                    </List.Content>
                                                </List.Item>
                                        ) :
                                        [...this.state.userList].map((user) => (
                                            <List.Item key={user._id}>
                                                <List.Content floated='right'>
                                                    <ModalEditUserSkills user={user} />
                                                    {/* <Button onClick={this._deleteUser.bind(this, user._id)} >Xóa</Button> */}
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
                ) : (
                    <h1 style={{textAlign: 'center'}}><Icon name='lock' />Bạn không có quyền truy cập trang này.</h1>
                )}
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