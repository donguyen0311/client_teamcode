import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from './UserActions';
import { Table, Image, Button, Modal, Form, Dropdown } from 'semantic-ui-react';
import { updateUserInfo } from './UserActions';
import axios from 'axios';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateEdit: false,
            workedAtOptions: [...this.formatDropdownValue(this.props.data.profile.worked_at)],
            studiedAtOptions: [...this.formatDropdownValue(this.props.data.profile.studied_at)],
            languageProgrammingOptions: [...this.formatDropdownValue(this.props.data.profile.language_programming)],
            first_name: this.props.data.profile.firstname,
            last_name: this.props.data.profile.lastname,
            gender: this.props.data.profile.gender,
            worked_at: this.props.data.profile.worked_at,
            studied_at: this.props.data.profile.studied_at,
            language_programming: this.props.data.profile.language_programming
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeView = this.changeView.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.createElementUpload = this.createElementUpload.bind(this);
    }

    formatDropdownValue(arrayValue) {
        var formatValue = [];
        for (let value of arrayValue) {
            formatValue.push({ text: value, value });
        }
        return formatValue;
    }

    changeView(state) {
        if (state === 'edit') {
            this.setState({
                stateView: false,
                stateEdit: true
            });
        } else if (state === 'view') {
            this.setState({
                stateView: true,
                stateEdit: false
            });
        }
    }

    handleChange(e, { name, value }) {
        console.log(name, value);
        this.setState({
            [name]: value
        });
    }

    handleAddition(e, { name, value }) {
        let mapName = {
            worked_at: 'workedAtOptions', 
            studied_at: 'studiedAtOptions', 
            language_programming: 'languageProgrammingOptions'
        };
        this.setState({
            [ mapName[name] ]: [{ text: value, value }, ...this.state[ mapName[name] ]],
        });
    }

    updateProfile() {
        axios.put(`/api/users/${this.props.data.profile._id}`, {
            firstname: this.state.first_name,
            lastname: this.state.last_name,
            gender: this.state.gender,
            worked_at: this.state.worked_at,
            studied_at: this.state.studied_at,
            language_programming: this.state.language_programming
        }, {
            headers: { 'x-access-token': localStorage.token }
        }).then(response => {
            this.props.updateUserInfo(response.data.user);
            this.changeView('view');
        });
    }

    createElementUpload() {
        let upload = document.createElement('input');
        upload.style.display = 'none';
        upload.type = 'file';
        upload.name = 'file';
        upload.accept = 'image/*';
        upload.onchange = (e) => {
            console.log(upload.files, e);
            let selectedFile = upload.files[0];
            let fd = new FormData();
            fd.append('file', selectedFile);
            axios.put(`/api/users/image/${this.props.data.profile._id}`, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': localStorage.token
                }
            }).then(response => {
                console.log(response);
                this.props.updateUserInfo(response.data.user);
                this.changeView('view');
            });
        };
        return upload;
    }

    updateAvatar() {
        let upload = this.createElementUpload();
        upload.click();
    }

    render() {
        if (this.state.stateView) {
            return [
                <Image key={'avatar_profile'} wrapped size='medium' src={this.props.data.profile.image} />,
                <Modal.Description key={'info_profile_table'}>
                    <Table basic='very'>           
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell width={4}>
                                    <h4>First Name</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.firstname}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Last Name</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.lastname}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Gender</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.gender === true ? 'Male' : 'Female'}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Email</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.email} 
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Username</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.username}
                                </Table.Cell>
                            </Table.Row> 
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Password</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    *************
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Worked At</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.worked_at.join()}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Studied At</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.studied_at.join()}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Language Programming</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.language_programming.join()}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                    <Button fluid onClick={this.changeView.bind(this, 'edit')}>Update Profile</Button>
                                </Table.Cell>
                            </Table.Row>                 
                        </Table.Body>
                    </Table>
                </Modal.Description>
            ];
        }
        if (this.state.stateEdit) {
            return [
                <Image key={'avatar_profile_edit'} wrapped size='medium' style={{cursor: 'pointer'}} src={this.props.data.profile.image} onClick={this.updateAvatar} />,
                <Modal.Description key={'info_profile_table_edit'}>
                    <Form onSubmit={this.updateProfile}>
                        <Table basic='very'>           
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={4}>
                                        <h4>First Name</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='first_name' type='text' value={this.state.first_name} onChange={this.handleChange} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Last Name</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='last_name' type='text' value={this.state.last_name} onChange={this.handleChange} />  
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Gender</h4>
                                    </Table.Cell>
                                    <Table.Cell> 
                                        <Form.Group inline style={{marginBottom: 0}}>
                                            <Form.Radio label='Male' name='gender' value={true} checked={this.state.gender === true} onChange={this.handleChange} />
                                            <Form.Radio label='Female' name='gender' value={false} checked={this.state.gender === false} onChange={this.handleChange} />
                                        </Form.Group>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Email</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='email' type='text' value={this.props.data.profile.email} readOnly />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Username</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='username' type='text' value={this.props.data.profile.username} readOnly />
                                    </Table.Cell>
                                </Table.Row> 
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Password</h4>
                                    </Table.Cell>
                                    <Table.Cell> 
                                        <Form.Input name='password' type='password' value={'*************'} readOnly />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Worked At</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            name='worked_at'
                                            options={this.state.workedAtOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.worked_at}
                                            onAddItem={this.handleAddition}
                                            onChange={this.handleChange}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Studied At</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            name='studied_at'
                                            options={this.state.studiedAtOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.studied_at}
                                            onAddItem={this.handleAddition}
                                            onChange={this.handleChange}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Language Programming</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            name='language_programming'
                                            options={this.state.languageProgrammingOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.language_programming}
                                            onAddItem={this.handleAddition}
                                            onChange={this.handleChange}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan='2'>
                                        <Form.Group widths='equal'>
                                            <Button fluid type='submit' color='green' >Update</Button>
                                            <Button fluid type='button' onClick={this.changeView.bind(this, 'view')}>View Profile</Button>
                                        </Form.Group>
                                    </Table.Cell>
                                </Table.Row>                 
                            </Table.Body>
                        </Table>
                    </Form>
                </Modal.Description>
            ];
        }
    }
}

const mapStateToProps = (state) => {
    return {data: state.userReducer};
}

const mapDispatchToProps = {
    getUserInfo,
    updateUserInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);