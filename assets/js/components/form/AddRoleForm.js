import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

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
                        label="Идентификатор роли:" 
                        required="true" 
                        name="add_role_form[role_key]" 
                        type="text" 
                        placeholder="Введите идентификатор роли" />
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
                    <Form.Button>Добавить роль</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}