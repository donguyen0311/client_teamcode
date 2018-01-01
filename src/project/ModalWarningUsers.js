import React from 'react';
import { Image, Header, Icon, Modal, Button, Card, Dimmer } from 'semantic-ui-react';
import _ from 'lodash';
import project from '../utils/project';

class ModalWarningUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateAdd: false,
            openModal: false,
            users: this.props.users,
            project: this.props.project,
            warningUser: this.getUserReplace(this.props.users, this.props.project)
        }
        this.getUserReplace = this.getUserReplace.bind(this);
    }

    openModal = () => this.setState({ openModal: true })
    closeModal = () => this.setState({ openModal: false })

    getUserReplace(users, project) {
        var warningUserList = Object.keys(project.warning_list);
        var warningUser = users.filter((user) => {
            return _.indexOf(warningUserList, user._id) > -1;
        });
        return warningUser;
    }

    componentDidMount() {
        project
            .getUserReplace(this.state.warningUser, this.state.project._id)
            .then((response) => {
                if(response.success) {

                }
            });
    }

    render() {
        const { openModal } = this.state;
        return (
            <Modal open={openModal} onClose={this.closeModal} trigger={<Button icon='warning sign' content='Warning Users' onClick={this.openModal} />} size='small' closeIcon>
                    <Header icon='hashtag' content='Warning Users'/>
                    <Modal.Content scrolling>
                        {this.state.warningUser.length > 0 ? (
                            <Card.Group itemsPerRow={3}>
                                {this.state.users.map(user => (
                                    <Card key={user._id}>
                                        <Image src={user.image} />
                                        <Card.Content>
                                            <Card.Header>{user.firstname} {user.lastname}</Card.Header>
                                            <Card.Meta>{user.email}</Card.Meta>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </Card.Group>
                            ) : (
                            <Header as='h2' icon textAlign='center'>
                                <Icon name='x' />
                                <Header.Content>
                                    Empty
                                </Header.Content>
                            </Header>
                        )}
                </Modal.Content>
            </Modal>
        );
    }
}

export default ModalWarningUsers;