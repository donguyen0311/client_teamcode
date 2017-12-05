import React from 'react';
import {connect} from 'react-redux';
import { getUserInfo } from './UserActions';
import { Table, Image } from 'semantic-ui-react';

class Profile extends React.Component {
    render() {
        return [
            <Image key={'avatar_profile'} wrapped size='medium' src={this.props.data.profile.image} />,
            <Table key={'info_profile_table'} basic='very'>
                
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={3}>
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
                </Table.Body>
            </Table>
        ];
    }
}

const mapStateToProps = (state) => {
    return {data: state.userReducer};
}

const mapDispatchToProps = {
    getUserInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);