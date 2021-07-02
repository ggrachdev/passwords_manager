import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import ProjectsApi from '../../src/Api/ProjectsApi';

export default class ChangeProjectForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            projectId: props.projectId,
            onClickRemoveProject: props.onClickRemoveProject,
            projectData: {
                name: null,
                id: null
            }
        };
        
        ProjectsApi.get(props.projectId).then((response) => {
            this.setState({
                projectData: response.getData()['project']
            });
        });

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
                        defaultValue={this.state.projectData.name} 
                        name="change_project_form[name]" 
                        type="text" 
                        placeholder="Введите название проекта" />
                    <Form.Button positive>Изменить Проект</Form.Button>
                    <Form.Button onClick={(e) => {e.preventDefault(); this.state.onClickRemoveProject(e, this.state.projectData);}} negative>Удалить Проект</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}