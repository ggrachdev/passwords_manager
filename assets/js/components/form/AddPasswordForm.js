import React, { Component } from 'react';
import { Form, TextArea } from 'semantic-ui-react'

export default class AddPasswordForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    
                    <Form.Input fluid 
                        label="Название пароля:" 
                        required="true" 
                        name="add_password_form[name]" 
                        type="text" 
                        placeholder="Введите название пароля" />
                        
                    <Form.Input fluid 
                        label="Логин:" 
                        name="add_password_form[login]" 
                        type="text" 
                        placeholder="Введите логин" />
                        
                    <Form.Input fluid 
                        label="Пароль:" 
                        name="add_password_form[password]" 
                        type="text" 
                        placeholder="Введите пароль" />
                        
                    <Form.Field
                        control={TextArea}
                        label='Описание:' 
                        name="add_password_form[description]" 
                        placeholder='Введите описание' 
                      />
                     
                    <Form.Button positive>Добавить пароль</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}