import React from 'react';
import {connect} from 'react-redux';
const EventEmitter = require('wolfy87-eventemitter');
//var ee = new EventEmitter();


class Room extends EventEmitter {
    constructor(socket) {
        super();
        this.iceConfig = {
            "iceServers": [
                {
                    'urls': [
                        'turn:webrtcweb.com:7788', // coTURN 7788+8877
                        'turn:webrtcweb.com:4455', // restund udp
                        'turn:webrtcweb.com:5544' // restund tcp
                    ],
                    'username': 'muazkh',
                    'credential': 'muazkh'
                }, {
                    'urls': ['stun:stun.l.google.com:19302']
                }
            ]
        };
        this.socket = socket;
        this.peerConnections = {};
        this.currentId = '';
        this.roomId = '';
        this.stream = '';
        this.connected = false;
        this.addHandlers(this.socket);
    }

    joinRoom(r) {
        if(!this.connected) {
            this.socket.emit('init', {room: r}, (roomid, id) => {
                this.currentId = id;
                this.roomId = roomid;
            });
            this.connected = true;
        }
    }

    createOrJoinRoom(r) {
        return new Promise((resolve) => {
            this.socket.emit('init', {room: r}, (roomid, id) => {
                resolve(roomid);
                this.roomId = roomid;
                this.currentId = id;
                this.connected = true;
            });
        });
    }

    init(s) {
        this.stream = s;
    }

    getPeerConnection(id) {
        if (this.peerConnections[id]) {
            return this.peerConnections[id];
        }
        var pc = new RTCPeerConnection(this.iceConfig);
        this.peerConnections[id] = pc;
        pc.addStream(this.stream);
        pc.onicecandidate = (evnt) => {
            this.socket.emit('msg', {
                by: this.currentId,
                to: id,
                ice: evnt.candidate,
                type: 'ice'
            });
        };
        pc.onaddstream = (evnt) => {
            console.log('Received new stream');
            this.trigger('peer.stream', [
                {
                    id: id,
                    stream: evnt.stream
                }
            ]);
        };
        return pc;
    }

    makeOffer(id) {
        var pc = this.getPeerConnection(id);
        pc.createOffer({
            mandatory: {
                OfferToReceiveVideo: true,
                OfferToReceiveAudio: true
            }
        }).then((sdp) => {
            pc.setLocalDescription(sdp);
            console.log('Creating an offer for', id);
            this.socket.emit('msg', {
                by: this.currentId,
                to: id,
                sdp: sdp,
                type: 'sdp-offer'
            });
        })
        .catch((e) => {
            // An error occurred, so handle the failure to connect
            console.log(e);
        });
    }

    handleMessage(data) {
        var pc = this.getPeerConnection(data.by);
        switch (data.type) {
            case 'sdp-offer':
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
                    console.log('Setting remote description by offer');
                    pc.createAnswer((sdp) => {
                        pc.setLocalDescription(sdp);
                        this.socket.emit('msg', {
                            by: this.currentId,
                            to: data.by,
                            sdp: sdp,
                            type: 'sdp-answer'
                        });
                    });
                });
                break;
            case 'sdp-answer':
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
                    console.log('Setting remote description by answer');
                }, (e) => {
                    console.error(e);
                });
                break;
            case 'ice':
                if (data.ice) {
                    console.log('Adding ice candidates');
                    pc.addIceCandidate(new RTCIceCandidate(data.ice));
                }
                break;
        }
    }

    addHandlers(socket) {
        socket.on('peer.connected', (params) => {
            this.makeOffer(params.id);
        });
        socket.on('peer.disconnected', (data) => {
            this.trigger('peer.disconnected', [data]);
        });
        socket.on('msg', (data) => {
            this.handleMessage(data);
        });
    }

}



class Meeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: this.props.match.params.project || 'demo',
            peers: [],
            stream: '',
            error: ''
        }
        window.room.joinRoom('demoxx');
        window.room.onLocalVideo((s) => {
            console.log(stream);
            var stream = URL.createObjectURL(s);
            this.setState({
                stream: stream
            })
        });
        window.room.onRemoteVideo((stream, participantID) => {
            this.setState({
                peers: [
                    ...this.state.peers, 
                    {
                        id: participantID,
                        stream: URL.createObjectURL(stream)
                    }
                ]
            });
            console.log('onRemoteVideo: ====', stream, participantID);
        });
        window.room.onParticipantHangup((participantID) => {
            var peers = this.state.peers.filter((p) => {
                return p.id !== participantID;
            });
            this.setState({
                peers: peers
            })
            console.log(participantID);
        });

        //this.Room = new Room(this.props.socket);
        //this.Init();
    }

    VideoStream() {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia({
                video: true,
                audio: true
            }, (s) => {
                var stream = s;
                resolve(stream);
            }, (e) => {
                reject(e);
            });
        });
    }

    Init() {
        if (!window.RTCPeerConnection || !navigator.getUserMedia) {
            this.setState({
                error: 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.'
            });
            return;
        }
        var stream;
        this.VideoStream().then((s) => {
            stream = s;
            this.Room.init(stream);
            stream = URL.createObjectURL(stream);
            this.setState({
                stream: stream
            });
            this.Room.createOrJoinRoom(this.state.room);

            this.Room.on('peer.stream', (peer) => {
                console.log('Client connected, adding new stream');
                this.setState({
                    peers: [
                        ...this.state.peers, 
                        {
                            id: peer.id,
                            stream: URL.createObjectURL(peer.stream)
                        }
                    ]
                });
            });
            this.Room.on('peer.disconnected', (peer) => {
                console.log('Client disconnected, removing stream');
                var peers = this.state.peers.filter((p) => {
                    return p.id !== peer.id;
                });
                this.setState({
                    peers: peers
                });
            });

        }, (err) => {
            console.log("ERROR: ", err);
        });

    }

    render() {
        console.log(this.state);
        return (
            <div>
                <video src={this.state.stream} autoPlay muted></video>
                {this.state.peers.map((peer) => (
                    <video key={peer.id} src={peer.stream} autoPlay></video>
                ))}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer,
		socket: state.socketReducer.socket
	};
}

export default connect(mapStateToProps)(Meeting);