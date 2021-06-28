import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import RolesApi from '../../src/Api/RolesApi';

export default class ChangeRoleForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            key_role_for_change: props.keyRoleForChange,
            role_data: {
                key: null,
                name: null,
                color: null
            }
        };
        
        RolesApi.get(this.state.key_role_for_change).then((response) => {
            this.setState({
                role_data: response.getData()['role']
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
                        value={role_data.key} 
                        name="change_role_form[role_key]" 
                        type="text" 
                        placeholder="Введите идентификатор роли" />
                    <Form.Input fluid 
                        label="Название роли:" 
                        value={role_data.name} 
                        required="true" 
                        name="change_role_form[name]" 
                        type="text" 
                        placeholder="Введите название роли" />
                    <Form.Input fluid 
                        label="Цвет роли:" 
                        value={role_data.color} 
                        required="true" 
                        name="change_role_form[color]" 
                        type="text" 
                        placeholder="Введите цвет роли" />
                    <Form.Button>Изменить роль</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}