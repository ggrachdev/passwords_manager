import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

export default class LoginForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {};

        this.handleChange = (e, { value }) => this.setState({value});
         
        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }

    render() {

        const {value} = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Input fluid label='Ваш логин' name="login" placeholder='Введите логин' />
                <Form.Input fluid label='Ваш пароль' name="password" type='password' placeholder='Введите пароль' />
                <Form.Button>Войти</Form.Button>
            </Form>
            );
    }
}