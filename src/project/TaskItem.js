import React from 'react';
import { Dropdown, Icon, Input, Menu, Header, Container, Label, Popup, Card, Image, Progress, Divider } from 'semantic-ui-react';

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Image floated='right' size='mini' src='https://react.semantic-ui.com/assets/images/avatar/large/steve.jpg' />
                <Header size='small' style={{marginBottom: 5, marginTop: 5}}>
                    <span>Code Web</span>
                </Header>
                <Container style={{marginBottom: 10}}>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                </Container>
                <Label as='a' image size='mini'>
                <img src='https://react.semantic-ui.com/assets/images/avatar/small/joe.jpg' />
                Joe
                </Label>
                <Label as='a' image size='mini'>
                <img src='https://react.semantic-ui.com/assets/images/avatar/small/elliot.jpg' />
                Joe
                </Label>
            </div>
        )
    }
}

export default TaskItem;