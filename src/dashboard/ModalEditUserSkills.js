import React from 'react';
import { Table, Image, Button, Modal, Form, Dropdown, Header, Input, Label } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';

let skills_description = {
    analyst_capability: [
        {
            value: 0,
            text: '15th percentile.'
        },
        {
            value: 1,
            text: '35th percentile.'
        },
        {
            value: 2,
            text: '55th percentile.'
        },
        {
            value: 3,
            text: '75th percentile.'
        },
        {
            value: 4,
            text: '90th percentile.'
        }
    ],
    programmer_capability: [
        {
            value: 0,
            text: '15th percentile.'
        },
        {
            value: 1,
            text: '35th percentile.'
        },
        {
            value: 2,
            text: '55th percentile.'
        },
        {
            value: 3,
            text: '75th percentile.'
        },
        {
            value: 4,
            text: '90th percentile.'
        }
    ],
    application_experience: [
        {
            value: 0,
            text: 'Kinh nghiệm <= 02 tháng.'
        },
        {
            value: 1,
            text: 'Kinh nghiệm 06 tháng.'
        },
        {
            value: 2,
            text: 'Kinh nghiệm 01 năm.'
        },
        {
            value: 3,
            text: 'Kinh nghiệm 03 năm.'
        },
        {
            value: 4,
            text: 'Kinh nghiệm 06 năm.'
        }
    ],
    platform_experience: [
        {
            value: 0,
            text: 'Kinh nghiệm <= 02 tháng.'
        },
        {
            value: 1,
            text: 'Kinh nghiệm 06 tháng.'
        },
        {
            value: 2,
            text: 'Kinh nghiệm 01 năm.'
        },
        {
            value: 3,
            text: 'Kinh nghiệm 03 năm.'
        },
        {
            value: 4,
            text: 'Kinh nghiệm 06 năm.'
        }
    ],
    language_and_toolset_experience: [
        {
            value: 0,
            text: 'Kinh nghiệm <= 02 tháng.'
        },
        {
            value: 1,
            text: 'Kinh nghiệm 06 tháng.'
        },
        {
            value: 2,
            text: 'Kinh nghiệm 01 năm.'
        },
        {
            value: 3,
            text: 'Kinh nghiệm 03 năm.'
        },
        {
            value: 4,
            text: 'Kinh nghiệm 06 năm.'
        }
    ]
};

class ModalEditUserSkills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateEdit: false,
            analyst_capability: this.props.user.analyst_capability,
            programmer_capability: this.props.user.programmer_capability,
            application_experience: this.props.user.application_experience,
            platform_experience: this.props.user.platform_experience,
            language_and_toolset_experience: this.props.user.language_and_toolset_experience,
            salary: this.props.user.salary,
            analystCapabilityOptions: skills_description.analyst_capability,
            programmerCapabilityOptions: skills_description.programmer_capability,
            applicationExperienceOptions: skills_description.application_experience,
            platformExperienceOptions: skills_description.platform_experience,
            languageAndToolsetExperienceOptions: skills_description.language_and_toolset_experience
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeView = this.changeView.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
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

    convertSkillNumberToDescription(number_skill, type_skill) {
        let index = _.findIndex(skills_description[type_skill], ['value', number_skill]);
        return skills_description[type_skill][index].text;
    }
    
    handleChange(e, { name, value }) {
        console.log(name, value);
        this.setState({
            [name]: value
        });
    }

    updateProfile() {
        axios.put(`/api/users/${this.props.user._id}/skill`, {
            analyst_capability: this.state.analyst_capability,
            programmer_capability: this.state.programmer_capability,
            application_experience: this.state.application_experience,
            platform_experience: this.state.platform_experience,
            language_and_toolset_experience: this.state.language_and_toolset_experience,
            salary: this.state.salary
        }, {
            headers: { 'x-access-token': localStorage.token }
        }).then(response => {
            if(response.data.success) {
                this.changeView('view');
            }
        });
    }

    render() {
        return (
            <Modal size={'small'} closeIcon trigger={<Button color='teal'>View & Edit</Button>} >
                <Modal.Header>
                    <Header size='small' icon='hashtag' content='View & Edit User Skills'/>
                </Modal.Header>
                <Modal.Content image>
                    {this.state.stateView ? 
                        [
                            <Image key={'avatar_profile'} wrapped size='medium' src={this.props.user.image} />,
                            <Modal.Description key={'info_profile_table'}>
                                <Table basic='very'>           
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell width={4}>
                                                <h4>First Name</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.firstname}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Last Name</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.lastname}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Gender</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.gender === true ? 'Male' : 'Female'}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Email</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.email} 
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Username</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.username}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Salary</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                $ {this.props.user.salary}
                                            </Table.Cell>
                                        </Table.Row> 
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Worked At</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.worked_at.join()}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Studied At</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.studied_at.join()}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Language Programming</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.language_programming.join()}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Analyst Capability Skill</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.analyst_capability, 'analyst_capability')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Programmer Capability Skill</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.programmer_capability, 'programmer_capability')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Application Experience Skill</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.application_experience, 'application_experience')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Platform Experience Skill</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.platform_experience, 'platform_experience')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Language And Toolset Experience Skill</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.language_and_toolset_experience, 'language_and_toolset_experience')}
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
                        ] : 
                        [
                            <Image key={'avatar_profile_edit'} wrapped size='medium' style={{cursor: 'pointer'}} src={this.props.user.image} />,
                            <Modal.Description key={'info_profile_table_edit'}>
                                <Form onSubmit={this.updateProfile} >
                                    <Table basic='very'>           
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell width={4}>
                                                    <h4>First Name</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.firstname}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Last Name</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.lastname}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Gender</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.gender === true ? 'Male' : 'Female'}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Email</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.email} 
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Username</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.username}
                                                </Table.Cell>
                                            </Table.Row> 
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Worked At</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.worked_at.join()}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Studied At</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.studied_at.join()}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Language Programming</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.language_programming.join()}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Salary</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input labelPosition='right' type='number' value={this.state.salary} name='salary' fluid placeholder='Amount' onChange={this.handleChange}>
                                                        <Label basic>$</Label>
                                                        <input />
                                                        <Label>.00</Label>
                                                    </Input>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Analyst Capability Skill</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Select Skill Level' 
                                                        name='analyst_capability' 
                                                        value={this.state.analyst_capability} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.analystCapabilityOptions} 
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Programmer Capability Skill</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Select Skill Level' 
                                                        name='programmer_capability'
                                                        value={this.state.programmer_capability} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.programmerCapabilityOptions}
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Application Experience Skill</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Select Skill Level' 
                                                        name='application_experience'
                                                        value={this.state.application_experience} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.applicationExperienceOptions}
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Platform Experience Skill</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Select Skill Level' 
                                                        name='platform_experience'
                                                        value={this.state.platform_experience} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.platformExperienceOptions}
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Language And Toolset Experience Skill</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Select Skill Level' 
                                                        name='language_and_toolset_experience'
                                                        value={this.state.language_and_toolset_experience} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.languageAndToolsetExperienceOptions}
                                                        onChange={this.handleChange} />
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
                        ]
                    }
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalEditUserSkills;