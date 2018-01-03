import React from 'react';
import {connect} from 'react-redux';
import { Grid } from 'semantic-ui-react';

class Meeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: 'general',
            peers: [],
            pureStream: '',
            stream: '',
            error: '',
        }
        this.room = '';
        this.initMeeting = this.initMeeting.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.onUnload = this.onUnload.bind(this);
    }

    initMeeting(currentRoom) {
        this.room = new window.meeting('');

        this.room.onLocalVideo((s) => {
            console.log('onLocalVideo: ', s);
            var stream = URL.createObjectURL(s);
            console.log("stream", stream);
            this.setState({
                pureStream: s,
                stream: stream
            })
        });
        this.room.onRemoteVideo((stream, participantID) => {
            this.setState({
                peers: [
                    ...this.state.peers, 
                    {
                        id: participantID,
                        stream: URL.createObjectURL(stream),
                        pureStream: stream
                    }
                ]
            });
            console.log('onRemoteVideo: ', stream, participantID);
        });
        this.room.onParticipantHangup((participantID) => {
            var peers = this.state.peers.filter((p) => {
                return p.id !== participantID;
            });
            console.log(participantID);
            console.log(this.state.peers);
            console.log(peers);
            this.setState({
                peers: peers
            })
            console.log('disconnect: ', participantID);
        });
        this.room.onChatReady(() => {
            console.log('Chat is ready');
        });
        this.room.joinRoom(currentRoom);
    }

    leaveMeeting(callback) {
        if(this.room) {
            this.room.stateUnmount();
            this.room = '';
        }
        if(this.state.pureStream) {
            this.state.pureStream.getTracks().forEach(track => track.stop());
        }
        if(this.state.peers.length > 0) {
            this.state.peers.map(peer => {
                peer.pureStream.getTracks().forEach(track => track.stop());
            });
        }
        this.setState({
            room: 'general',
            peers: [],
            pureStream: '',
            stream: '',
            error: '',
        }, callback);
    }

    componentWillMount() {
        console.log(this.props.match.params.project);
        this.initMeeting(this.props.match.params.project);
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.match.params.project);
        console.log(nextProps.match.params.project, '====================');
        console.log(this.room, 'room------------------')
        if(this.props.match.params.project !== nextProps.match.params.project) {
            this.leaveMeeting(() => {
                this.initMeeting(nextProps.match.params.project);
            });  
        }
    }

    onUnload(e) {
        this.leaveMeeting();
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onUnload);
    }

    componentWillUnmount() {
        console.log('unmount~~~~~~~~~');
        this.leaveMeeting();
        window.removeEventListener('beforeunload', this.onUnload);
    }

    render() {
        console.log(this.state);
        return (
            <div style={{width: '100%', height: 'calc(100vh - 59px)', marginTop:'-1rem'}}>
                <video src={this.state.stream} autoPlay muted style={{width: '100%', height: 'inherit', background: '#000'}}></video>
                {this.state.peers.map((peer, index) => (
                    <video key={peer.id} src={peer.stream} autoPlay style={{width: '20%', position: 'absolute', bottom: 0, right: index * 200}} muted></video>
                ))}
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
// 		profileUser: state.userReducer,
// 		socket: state.socketReducer.socket
// 	};
// }
export default Meeting;
//export default connect(mapStateToProps)(Meeting);