import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AuthApi from '../../src/Api/AuthApi';

const equal = require('deep-equal');

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: []
        };

        this.onSubmitLoginForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            AuthApi.login(dataForm).then((response) => {
                location.href = '/cabinet/';
                this.setState({
                    errors: []
                });
            }).catch((event) => {
                this.setState({
                    errors: [
                        {
                            header: 'Ошибка авторизации',
                            content: 'Не удалось авторизоваться'
                        }
                    ]
                });
            });
        };
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.errors, this.props.errors))
        {
            this.setState({
                errors: this.props.errors
            });
        }
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Container text>
                    <LoginForm errors={errors} onSubmit={this.onSubmitLoginForm}/>
                </Container>
            </React.Fragment>
        );
    }
}