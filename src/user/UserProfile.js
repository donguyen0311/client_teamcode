import React from 'react';
import {connect} from 'react-redux';
import { getUserInfo } from './UserActions';

class Profile extends React.Component {
    render() {
        return (
            <div>Profile</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {data: state.userReducer};
}

const mapDispatchToProps = {
    getUserInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);