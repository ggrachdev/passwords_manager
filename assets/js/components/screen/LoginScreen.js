import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AuthApi from '../../src/Api/AuthApi';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname
        };
        
        this.onSubmitLoginForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            AuthApi.login(dataForm);
        };
    }

    render() {

        const {path} = this.state;

        return (
            <React.Fragment>
                <Container text>
                    <LoginForm onSubmit={this.onSubmitLoginForm}/>
                </Container>
            </React.Fragment>
        );
    }
}