import React, { Component } from 'react';
import { Form, Header, Message } from 'semantic-ui-react'

export default class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,
            errors: props.errors || []
        };

        this.handlers = {
            email: (e) => {
                this.setState({
                    email: e.target.value
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
    
    componentDidUpdate(prevProps) {
        if(this.props.errors.length != prevProps.errors.length)
        {
          this.setState({
              errors: this.props.errors
          });
        }
      } 

    render() {

        const {value} = this.state;

        let errorEmail = null;

        if (this.state.email !== null && this.state.email.trim().length === 0)
        {
            errorEmail = 'Введите email';
        }

        let errorPassword = null;

        if (this.state.password !== null && this.state.password.trim().length === 0)
        {
            errorPassword = 'Введите пароль';
        }

        let Errors = [];

        if (this.state.errors.length)
        {
            this.state.errors.forEach(function (item) {
                Errors.push(<Message
                    error visible
                    header={item.header}
                    content={item.content}
                    />);
            });
        }

        const ButtonSubmit = (errorPassword === null && errorEmail === null && this.state.password !== null && this.state.email !== null) ? <Form.Button>Войти</Form.Button> : null;

        return (
            <React.Fragment>
                <Header as='h1'>Вход:</Header>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                                label="Ваш email:" 
                                name="email" 
                                onChange={this.handlers.email} 
                                error={errorEmail}
                                type="email" 
                                placeholder="Введите email" />
                    <Form.Input fluid 
                                label="Ваш пароль:" 
                                error={errorPassword} 
                                name="password" 
                                onChange={this.handlers.password} 
                                type="password" 
                                placeholder="Введите пароль" />
                    {ButtonSubmit}
                    {Errors}
                </Form>
            </React.Fragment>
            );
    }
}