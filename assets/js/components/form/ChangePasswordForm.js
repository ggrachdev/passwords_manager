import React, { Component } from 'react';
import { Form, TextArea } from 'semantic-ui-react'
import PasswordsApi from '../../src/Api/PasswordsApi';

export default class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            idPassword: props.idPassword,
            passwordData: {
                name: '',
                password: '',
                description: '',
                login: ''
            }
        };
        
        PasswordsApi.get(this.state.idPassword).then((response) => {
            this.setState({
                passwordData: response.getData()['password']
            });
        });

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
        this.onClickRemovePassword = 'onClickRemovePassword' in props ? props['onClickRemovePassword'] : (e) => {};
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    
                    <Form.Input fluid 
                        label="Название пароля:" 
                        required="true" 
                        name="change_password_form[name]" 
                        type="text" 
                        defaultValue={this.state.passwordData.name} 
                        placeholder="Введите название пароля" />
                        
                    <Form.Input fluid 
                        label="Логин:" 
                        name="change_password_form[login]" 
                        type="text" 
                        defaultValue={this.state.passwordData.login} 
                        placeholder="Введите логин" />
                        
                    <Form.Input fluid 
                        label="Пароль:" 
                        name="change_password_form[password]" 
                        defaultValue={this.state.passwordData.password} 
                        type="text" 
                        placeholder="Введите пароль" />
                        
                    <Form.Field
                        control={TextArea}
                        label='Описание:' 
                        name="change_password_form[description]" 
                        defaultValue={this.state.passwordData.description} 
                        placeholder='Введите описание' 
                      />
                     
                    <Form.Button positive>Изменить пароль</Form.Button> 
                    <Form.Button onClick={this.onClickRemovePassword} negative>Удалить пароль</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}