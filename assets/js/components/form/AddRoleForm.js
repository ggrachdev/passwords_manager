import React, { Component } from 'react';
import { Form, Radio } from 'semantic-ui-react'

export default class AddRoleForm extends Component {

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
                        label="Email:" 
                        required="true" 
                        name="change_user_form[email]" 
                        type="email" 
                        placeholder="Введите email" />
                    <Form.Input fluid 
                        label="Отчество:" 
                        required="true" 
                        name="change_user_form[middle_name]" 
                        type="text" 
                        placeholder="Введите отчество" />
                    <Form.Input fluid 
                        label="Имя:" 
                        required="true" 
                        name="change_user_form[first_name]" 
                        type="text" 
                        placeholder="Введите имя" />
                    <Form.Input fluid 
                        label="Фамилия:" 
                        required="true" 
                        name="change_user_form[second_name]" 
                        type="text" 
                        placeholder="Введите фамилию" />
                    <Form.Input fluid 
                        label="Введите пароль для его изменения:" 
                        name="change_user_form[password]" 
                        type="text" 
                        placeholder="Введите пароль" />
                    <Form.Input fluid 
                        label="Повторите пароль для его изменения:" 
                        name="change_user_form[re_password]" 
                        type="text" 
                        placeholder="Повторите пароль" />
                    {renderRadioRoles()}
                    <Form.Button>Изменить данные</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}