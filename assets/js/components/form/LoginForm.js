import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

    const options = [
        {key: 'm', text: 'Male', value: 'male'},
        {key: 'f', text: 'Female', value: 'female'},
        {key: 'o', text: 'Other', value: 'other'}
    ];

export default class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = (e, { value }) => this.setState({value});
    }

    render() {

        const {value} = this.state;

        return (
            <Form>
                <Form.Input fluid label='Ваш логин' placeholder='Введите логин' />
                <Form.Input fluid label='Ваш пароль' type='password' placeholder='Введите пароль' />
                <Form.Button>Войти</Form.Button>
            </Form>
            );
    }
}