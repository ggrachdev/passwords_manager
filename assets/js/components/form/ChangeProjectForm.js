import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

export default class ChangeProjectForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            id_project_change: props.id_project_change
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                        label="Название проекта:" 
                        required="true" 
                        name="change_project_form[name]" 
                        type="text" 
                        placeholder="Введите название проекта" />
                    <Form.Button>Изменить Проект</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}