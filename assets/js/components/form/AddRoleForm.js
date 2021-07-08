import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import SimplePermissionsList from '../permission/simple-permissions-list';

export default class AddRoleForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
        };
        
        this.permissionsList = {
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
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                        label="Идентификатор роли:" 
                        required="true" 
                        name="add_role_form[role_key]" 
                        type="text" 
                        placeholder="Введите идентификатор роли, его нельзя будет поменять после добавление роли" />
                    <Form.Input fluid 
                        label="Название роли:" 
                        required="true" 
                        name="add_role_form[name]" 
                        type="text" 
                        placeholder="Введите название роли" />
                    <Form.Input fluid 
                        label="Цвет роли:" 
                        required="true" 
                        name="add_role_form[color]" 
                        type="text" 
                        placeholder="Введите цвет роли" />
                        
                    <SimplePermissionsList permissionsList={this.permissionsList} />
                        
                    <Form.Button positive>Добавить роль</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}