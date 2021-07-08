import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import RolesApi from '../../src/Api/RolesApi';
import SimplePermissionsList from '../permission/simple-permissions-list';

export default class ChangeRoleForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: props.errors || [],
            key_role_for_change: props.keyRoleForChange,
            role_data: {
                key: '',
                name: '',
                color: ''
            },
            permissionsList: {
                can_add_users: {
                    name: 'Добавление пользователей',
                    selected: false
                },
                can_edit_users: {
                    name: 'Редактирование пользователей',
                    selected: false
                },
                can_watch_users: {
                    name: 'Просмотр списка пользователей',
                    selected: false
                },
                can_remove_users: {
                    name: 'Удаление пользователей',
                    selected: false
                },
                can_create_projects: {
                    name: 'Создание проектов',
                    selected: false
                },
                can_compromise_passwords_users: {
                    name: 'Возможность компрометировать пароли пользователей',
                    selected: false
                }
            }
        };

        RolesApi.get(this.state.key_role_for_change).then((response) => {
            const newPermissions = {...this.state.permissionsList};
            
            const responseData = response.getData()['role'];
            
            responseData.permissions.forEach((permission) => {
                if(permission in newPermissions)
                {
                    newPermissions[permission]['selected'] = true;
                }
            });
            
            this.setState({
                permissionsList: newPermissions,
                role_data: responseData
            });
        });

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }

    render() {

        const {errors, role_data} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                                label="Идентификатор роли:" 
                                required="true" 
                                readOnly 
                                defaultValue={role_data.key} 
                                name="change_role_form[role_key]" 
                                type="text" 
                                placeholder="Введите идентификатор роли" />
                    <Form.Input fluid 
                                label="Название роли:" 
                                defaultValue={role_data.name} 
                                required="true" 
                                name="change_role_form[name]" 
                                type="text" 
                                placeholder="Введите название роли" />
                    <Form.Input fluid 
                                label="Цвет роли:" 
                                defaultValue={role_data.color} 
                                required="true" 
                                name="change_role_form[color]" 
                                type="text" 
                                placeholder="Введите цвет роли" />
                        
                    <SimplePermissionsList permissionsList={this.state.permissionsList} />
                        
                    <Form.Button positive>Изменить роль</Form.Button>
                </Form>
            </React.Fragment>
            );
    }
}