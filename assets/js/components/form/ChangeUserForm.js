import React, { Component } from 'react';
import { Form, Radio } from 'semantic-ui-react'
import RolesApi from '../../src/Api/RolesApi';
import UsersApi from '../../src/Api/UsersApi';

export default class ChangeUserForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            all_roles_list: [],
            user_data: {
                id: '',
                email: '',
                first_name: '',
                middle_name: '',
                second_name: '',
                roles: []
            },
            user_id: props.user_id,
            errors: props.errors || [],
            selected_roles: []
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};

        this.changeRolesRadioHandler = (e, valueData) => {

            const value = valueData.value;

            let nowSelectedRoles = [...this.state.selected_roles];

            let newSelectedRoles = nowSelectedRoles.includes(value) ? _.without(nowSelectedRoles, value) : _.concat(nowSelectedRoles, value);

            this.setState({
                selected_roles: newSelectedRoles
            })
        };

        UsersApi.get(props.user_id).then((response) => {
            this.setState({
                selected_roles: response.getData()['user']['roles'],
                user_data: response.getData()['user']
            });
        });

        RolesApi.getList().then((response) => {
            this.setState({
                all_roles_list: response.getData()['roles']
            });
        });
    }

    render() {

        const {errors, all_roles_list, user_data} = this.state;

        const renderRadioRoles = () => {
            const viewRadio = [];

            all_roles_list.forEach((role) => {
                viewRadio.push(
                    <Form.Field>
                        <Radio 
                            label={role.name} 
                            name={`change_user_form[role][${role.key}]`}
                            checked={this.state.selected_roles.includes(role.key)} 
                            onClick={this.changeRolesRadioHandler} 
                            value={role.key} 
                        />
                    </Form.Field>
                );
            });
            return viewRadio;
        };

        const ButtonSubmit = <Form.Button>Изменить данные</Form.Button>;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                        label="Email:" 
                        required="true" 
                        name="change_user_form[email]" 
                        type="email" 
                        defaultValue={user_data.email} 
                        placeholder="Введите email" />
                    <Form.Input fluid 
                        label="Отчество:" 
                        defaultValue={user_data.middle_name} 
                        required="true" 
                        name="change_user_form[middle_name]" 
                        type="text" 
                        placeholder="Введите отчество" />
                    <Form.Input fluid 
                        label="Имя:" 
                        defaultValue={user_data.first_name} 
                        required="true" 
                        name="change_user_form[first_name]" 
                        type="text" 
                        placeholder="Введите имя" />
                    <Form.Input fluid 
                        label="Фамилия:" 
                        defaultValue={user_data.second_name} 
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
                    {ButtonSubmit}
                </Form>
            </React.Fragment>
        );
    }
}