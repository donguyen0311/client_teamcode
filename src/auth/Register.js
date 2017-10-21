import React from 'react';
import {connect} from 'react-redux';
import {
    Container,
    Button,
    Checkbox,
    Form,
    Segment,
    Header,
    Input,
    Message
} from 'semantic-ui-react';
import {register} from './AuthActions';

class Register extends React.Component {
    _handleSignup(e) {
        e.preventDefault();
    }
    render() {
        return (
            <Container text>
                <Segment
                    color='black'
                    style={{
                    maxWidth: 450,
                    margin: '0 auto'
                }}>
                    <Header as='h2'>Sign Up</Header>
                    <Form
                        onSubmit={this
                        ._handleSignup
                        .bind(this)}>
                        <Form.Field>
                            <label htmlFor="email">Email</label>
                            <Input type="email" id="email" placeholder='example@gmail.com' required/>
                        </Form.Field>
                        <Form.Field>
                            <label htmlFor="username">Email</label>
                            <Input type="text" id="username" placeholder='donguyen' required/>
                        </Form.Field>
                        <Form.Field>
                            <label htmlFor="password">Password</label>
                            <Input type="password" id="password" placeholder='••••••••••' required/>
                        </Form.Field>
                        <Form.Field>
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <Input type="password" id="confirm_password" placeholder='••••••••••' required/>
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label='I agree to the Terms and Conditions'/>
                        </Form.Field>
                        <Button basic type='submit'>Sign Up</Button>
                    </Form>
                </Segment>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.authReducer
    };
}

const mapDispatchToProps = {
    register
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);