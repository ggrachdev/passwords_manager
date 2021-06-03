import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname
        };
    }

    render() {

        const {path} = this.state;

        return (
            <Container text>
                <LoginForm/>
            </Container>
        );
    }
}