import React, { Component } from 'react';
import { Form, Header, Message, Radio } from 'semantic-ui-react'
import RolesApi from '../../src/Api/RolesApi';

export default class RegistrationUserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: props.errors || [],
            roles: [

            ]
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {
        };



        RolesApi.getList().then((response) => {
            this.setState({
                roles: response.getData()['roles']
            });
        });
    }

    render() {

        const {errors, roles} = this.state;

        const renderRadioRoles = () => {
            let viewRadio = [];
            roles.forEach((role) => {
                viewRadio.push(
                    <Form.Field>
                        <Radio
                            label={role.name}
                            name={role.name}
                            value={role.key}
                        />
                    </Form.Field>
                    );
            });
            return viewRadio;
        };

        const ButtonSubmit = <Form.Button>Зарегистрировать</Form.Button>;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                                label="Email:" 
                                name="registration_user_form[email]" 
                                type="email" 
                                placeholder="Введите email" />
                    <Form.Input fluid 
                                label="Имя:" 
                                name="registration_user_form[first_name]" 
                                type="text" 
                                placeholder="Введите имя" />
                    <Form.Input fluid 
                                label="Фамилия:" 
                                name="registration_user_form[second_name]" 
                                type="text" 
                                placeholder="Введите фамилию" />
                    <Form.Input fluid 
                                label="Отчество:" 
                                name="registration_user_form[middle_name]" 
                                type="text" 
                                placeholder="Введите отчество" />
                    <Form.Input fluid 
                                label="Пароль для входа:" 
                                name="registration_user_form[password]" 
                                type="text" 
                                placeholder="Введите пароль" />
                    <Form.Input fluid 
                                label="Повторите пароль:" 
                                name="registration_user_form[re_password]" 
                                type="text" 
                                placeholder="Повторите пароль" />
                    {renderRadioRoles()}
                    {ButtonSubmit}
                </Form>
            </React.Fragment>
            );
    }
}