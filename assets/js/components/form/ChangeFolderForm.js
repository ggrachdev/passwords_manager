import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import ProjectsApi from '../../src/Api/ProjectsApi';
import EditPermissionsList from '../permission/edit-permissions-list';

export default class ChangeFolderForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            folderId: props.folderId,
            onClickRemoveFolder: props.onClickRemoveFolder,
            folderData: {
                name: null,
                id: null
            }
        };
        
        this.permissionsList = {
            can_edit: {
                name: 'Редактирование папки'
            },
            can_watch: {
                name: 'Просмотр папки'
            },
            can_remove: {
                name: 'Удаление папки'
            },
            can_add_password: {
                name: 'Добавление паролей'
            },
            can_edit_passwords: {
                name: 'Редактирование паролей'
            },
            can_remove_passwords: {
                name: 'Удаление паролей'
            },
        };
        
        ProjectsApi.getFolder(this.state.folderId).then((response) => {
            this.setState({
                folderData: response.getData()['folder']
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
                        defaultValue={this.state.folderData.name} 
                        name="change_folder_form[name]" 
                        type="text" 
                        placeholder="Введите название папки" />
                    <Form.Button positive>Изменить папку</Form.Button>
                    <Form.Button onClick={(e) => {e.preventDefault(); this.state.onClickRemoveFolder(e, this.state.folderData);}} negative>Удалить папку</Form.Button>
                        
                    <EditPermissionsList 
                    typeName={this.state.folderData.name} 
                    permissionsList={this.permissionsList} 
                    idType={this.state.folderId} type="folder"/>
                </Form>
            </React.Fragment>
        );
    }
}