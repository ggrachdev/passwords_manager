import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AuthApi from '../../src/Api/AuthApi';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname,
            errors: []
        };

        this.onSubmitLoginForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            AuthApi.login(dataForm).then((response) => {
                console.log('success');
                console.log(response);
                this.setState({
                    errors: []
                });
            }).catch((response) => {
                console.log('error');
                console.log(response);
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

    render() {

        const {path, errors} = this.state;
        
        console.log(errors);

        return (
            <React.Fragment>
                <Container text>
                    <LoginForm errors={errors} onSubmit={this.onSubmitLoginForm}/>
                </Container>
            </React.Fragment>
            );
    }
}