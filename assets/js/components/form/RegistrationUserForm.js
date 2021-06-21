import React, { Component } from 'react';
import { Form, Header, Message } from 'semantic-ui-react'

export default class RegistrationUserForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,
            first_name: null,
            middle_name: null,
            errors: props.errors || []
        };

        this.handlers = {
            email: (e) => {
                this.setState({
                    email: e.target.value
                });
            },

            first_name: (e) => {
                this.setState({
                    first_name: e.target.value
                });
            },

            second_name: (e) => {
                this.setState({
                    second_name: e.target.value
                });
            },

            middle_name: (e) => {
                this.setState({
                    middle_name: e.target.value
                });
            },

            password: (e) => {
                this.setState({
                    password: e.target.value
                });
            },
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {
        };
    }

    render() {

        const {value, errors, email} = this.state;

        const ButtonSubmit = <Form.Button>Зарегистрировать</Form.Button>;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                                label="Email:" 
                                name="email" 
                                onChange={this.handlers.email} 
                                type="email" 
                                placeholder="Введите email" />
                    <Form.Input fluid 
                                label="Имя:" 
                                name="first_name" 
                                onChange={this.handlers.first_name} 
                                type="text" 
                                placeholder="Введите имя" />
                    <Form.Input fluid 
                                label="Фамилия:" 
                                name="second_name" 
                                onChange={this.handlers.second_name} 
                                type="text" 
                                placeholder="Введите фамилию" />
                    <Form.Input fluid 
                                label="Отчество:" 
                                name="middle_name" 
                                onChange={this.handlers.middle_name} 
                                type="text" 
                                placeholder="Введите отчество" />
                    <Form.Input fluid 
                                label="Пароль для входа:" 
                                name="password" 
                                onChange={this.handlers.password} 
                                type="text" 
                                placeholder="Введите пароль" />
                    {ButtonSubmit}
                </Form>
            </React.Fragment>
            );
    }
}