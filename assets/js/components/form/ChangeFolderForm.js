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
                name: 'Редактирование папки',
                desc: 'Позволяет редактировать данные папки и её права доступа для пользователей'
            },
            can_watch: {
                name: 'Просмотр папки',
                desc: 'Позволяет пользователю просматривать пароли, которые находятся в текущей папке'
            },
            can_remove: {
                name: 'Удаление папки',
                desc: 'Позволяет пользователю удалить текущую папку. Внимание: при удалении папки все пароли в папке удалятся автоматически'
            },
            can_add_password: {
                name: 'Добавление паролей',
                desc: 'Позволяет пользователю добавлять новые пароли в текущую папку. Пояснение: не позволяет изменять уже существующие'
            },
            can_edit_passwords: {
                name: 'Редактирование паролей',
                desc: 'Позволяет пользователю изменять существующие пароли в папке. Пояснение: не позволяет добавлять новые пароли, только изменять существующие'
            },
            can_remove_passwords: {
                name: 'Удаление паролей',
                desc: 'Позволяет пользователю удалять пароли в текущей папке'
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