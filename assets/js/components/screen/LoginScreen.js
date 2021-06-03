import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname
        };
        
        this.onSubmitLoginForm = (e) => {
            console.log('custom submit');
            
            const dataForm = (new FormSerializer(e.target)).getJson();
            
            console.log(dataForm);
        };
    }

    render() {

        const {path} = this.state;

        return (
            <Container text>
                <LoginForm onSubmit={this.onSubmitLoginForm}/>
            </Container>
        );
    }
}