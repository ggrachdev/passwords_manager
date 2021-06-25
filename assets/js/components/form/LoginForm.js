import React, { Component } from 'react';
import { Form, Header, Message } from 'semantic-ui-react'

const equal = require('deep-equal');

export default class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: props.errors || []
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }
    
    componentDidUpdate(prevProps) {
        if(!equal(this.props.errors, prevProps.errors))
        {
            this.setState({
                errors: this.props.errors
            });
        }
    } 

    render() {

        const {value} = this.state;

        const Errors = [];

        this.state.errors.forEach((item) => {
            Errors.push(
                <Message
                    error visible
                    header={item.header}
                    content={item.content}
                />
            );
        });

        return (
            <React.Fragment>
                <Header as='h1'>Вход:</Header>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                        label="Ваш email:" 
                        name="email" 
                        required 
                        type="email" 
                        placeholder="Введите email" />
                    <Form.Input fluid 
                        label="Ваш пароль:" 
                        name="password" 
                        required 
                        type="password" 
                        placeholder="Введите пароль" />
                    <Form.Button>Войти</Form.Button>
                    {Errors}
                </Form>
            </React.Fragment>
        );
    }
}