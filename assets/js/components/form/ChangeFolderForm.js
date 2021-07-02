import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import ProjectsApi from '../../src/Api/ProjectsApi';

export default class ChangeFolderForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            folderId: props.folderId,
            onClickRemoveFolder: props.onClickRemoveFolder,
            foldertData: {
                name: null,
                id: null
            }
        };
        
        ProjectsApi.getFolder(this.state.folderId).then((response) => {
            this.setState({
                foldertData: response.getData()['folder']
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
                        label="Название папки:" 
                        required="true" 
                        defaultValue={this.state.foldertData.name} 
                        name="change_folder_form[name]" 
                        type="text" 
                        placeholder="Введите название папки" />
                    <Form.Button positive>Изменить папку</Form.Button>
                    <Form.Button onClick={(e) => {e.preventDefault(); this.state.onClickRemoveFolder(e, this.state.foldertData);}} negative>Удалить папку</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}