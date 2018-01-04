import React from 'react';
import {connect} from 'react-redux';
import { Sidebar, Icon, Segment, Menu, Form, Comment, Header, Button, Ref } from 'semantic-ui-react';
import meeting from '../utils/meeting';
import TimeAgo from 'react-timeago';
import _ from 'lodash';

class Meeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: 'general',
            peers: [],
            pureStream: '',
            stream: '',
            error: '',
            messages: [],
            projectId: '',
            containerMessageRef: '',
            limit: 30,
            offset: 0,
            blockRequest: false
        }
        this.textInput = '';
        this.room = '';
        this.initMeeting = this.initMeeting.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.onUnload = this.onUnload.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.loadMessage = this.loadMessage.bind(this);
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
            });
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
            });
            console.log('disconnect: ', participantID);
        });
        this.room.onChatReady(() => {
            console.log('Chat is ready');
        });

        this.room.onReceiveMessage((message) => {
            this.setState({
                messages: [...this.state.messages, message]
            }, () => {
                if (this.state.containerMessageRef.scrollTop + this.state.containerMessageRef.offsetHeight + 51 === this.state.containerMessageRef.scrollHeight) {
                    this.scrollToBottom();
                }
            });
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

    getQueryParams(paramsString, param) {
		let params = new URLSearchParams(paramsString); 
		let value = params.get(param);
		return value;
	}

    componentWillMount() {
        console.log(this.props);
        var projectId = this.getQueryParams(this.props.location.search, 'id');
        this.loadMessage(projectId);
        this.setState({
            projectId: projectId
        });
        this.initMeeting(this.props.match.url);
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.match.params.project);
        console.log(nextProps.match.params.project, '====================');
        console.log(this.room, 'room------------------')
        if(this.props.match.params.project !== nextProps.match.params.project) {
            var projectId = this.getQueryParams(nextProps.location.search, 'id');
            this.loadMessage(projectId);
            this.setState({
                projectId: projectId
            });
            this.leaveMeeting(() => {
                this.initMeeting(nextProps.match.url);
            });
        }
    }

    sendMessage(e) {
        var message = e.target.elements.text_input.value;
        if (message) {
            this.room.sendChatGroupMessage(this.props.profileUser.profile._id, this.state.projectId, message);
            e.target.elements.text_input.value = '';
        }
    }

    loadMessage(projectId) {
        meeting
            .getMessage(projectId, this.state.limit, this.state.offset)
            .then((response) => {
                if(response.success && response.messages.length !== 0) {
                    console.log(response.messages);
                    this.setState({
                        messages: [...response.messages.reverse(), ...this.state.messages],
                        offset: this.state.offset + 30
                    }, () => {
                        if (this.state.offset === 30) {
                            this.scrollToBottom();
                        }
                    });
                } else {
                    this.setState({
                        blockRequest: true
                    });
                } 
            });
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

    handleRef = node => this.setState({ containerMessageRef: node })

    scrollToBottom = () => {
        if(this.state.containerMessageRef) {
            this.state.containerMessageRef.scrollTo(0, this.state.containerMessageRef.scrollHeight);
        }
    }
    handleScroll = (event) => {
        if(event.currentTarget.scrollTop === 0 && !this.state.blockRequest) {
            this.loadMessage(this.state.projectId);
        }
    }

    render() {
        console.log(this.state);
        return (
            <div style={{marginTop:'-1rem', height: 'calc(100vh - 59px)'}}>
                <div key={'video'} style={{width: '80%', display: 'inline-block', height: 'calc(100vh - 59px)'}}>
                    <video src={this.state.stream} autoPlay muted style={{width: '100%', height: 'inherit', background: '#000'}}></video>
                    {this.state.peers.map((peer, index) => (
                        <video key={peer.id} src={peer.stream} autoPlay style={{width: '20%', position: 'absolute', bottom: 0, right: index * 200}} muted></video>
                    ))}
                </div>
                <div key={'chat'} style={{width: '20%', display: 'inline-block', height: 'calc(100vh - 59px)'}}>
                    <Sidebar.Pushable>
                        <Sidebar animation='overlay' style={{width: '100%', paddingLeft: 1, paddingRight: 1}} visible={true} icon='labeled' vertical>
                            <Header as='h3' attached='top'>Message</Header>
                            <Ref innerRef={this.handleRef}>
                                <Segment attached style={{height: 'calc(100% - 83px)', overflow: 'auto'}} onScroll={this.handleScroll}>
                                    <Comment.Group>
                                        {this.state.messages.map((message) => (
                                            <Comment key={message._id}>
                                                <Comment.Avatar src={message.from.image} />
                                                <Comment.Content>
                                                    <Comment.Author as='a'>{message.from.firstname} {message.from.lastname}</Comment.Author>
                                                    <Comment.Metadata>
                                                        <TimeAgo date={message.createdAt} />
                                                    </Comment.Metadata>
                                                    <Comment.Text>
                                                        {message.message}
                                                    </Comment.Text>
                                                </Comment.Content>
                                            </Comment>
                                        ))}
                                    </Comment.Group>
                                </Segment>
                            </Ref>
                            <Header as='div' attached='bottom' style={{padding: 0}}>
                                <Form onSubmit={this.sendMessage}>
                                    <Form.Input type='text' name='text_input' size='mini' action={<Button type='submit' content='Send' primary />} />
                                </Form>
                            </Header>
                        </Sidebar>
                    </Sidebar.Pushable>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer
	};
}

export default connect(mapStateToProps)(Meeting);
//export default Meeting;