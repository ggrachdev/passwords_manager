import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'
import ProjectsApi from '../../src/Api/ProjectsApi';
import EditPermissionsList from '../permission/edit-permissions-list';

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
        
        this.permissionsList = {
            can_edit: {
                name: 'Редактирование проекта',
                desc: 'Право позволяет изменять данные проекта, редактировать права доступа для пользователей относительно этого проекта'
            },
            can_watch: {
                name: 'Просмотр проекта',
                desc: 'Право позволяет видеть проект в списке проектов, но право не дает возможности автоматического просмотра всех папок'
            },
            can_remove: {
                name: 'Удаление проекта',
                desc: 'Право позволяет пользователю удалить проект. При удалении проекта все папки удалятся автоматически'
            },
            add_all_permissions: {
                name: 'Добавить все вышеуказанные права',
                desc: 'Добавляет все вышеуказанные права'
            },
            remove_all_permissions: {
                name: 'Убрать все вышеуказанные права',
                desc: 'Убирает все вышеуказанные права'
            },
            add_watch_permissions_for_children_folders: {
                name: 'Добавить права на просмотр проекта и его подпапок',
                desc: 'Добавить права на просмотр проекта и его подпапок'
            },
            add_all_permissions_for_children_folders: {
                name: 'Добавить все права для папок проекта',
                desc: 'Добавляет все права для папок проекта'
            },
            remove_all_permissions_for_children_folders: {
                name: 'Удалить все права для папок проекта',
                desc: 'Удаляет все права для папок проекта'
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
                        label="Название проекта:" 
                        required="true" 
                        defaultValue={this.state.projectData.name} 
                        name="change_project_form[name]" 
                        type="text" 
                        placeholder="Введите название проекта" />
                        
                    <Form.Button positive>
                        Изменить Проект
                    </Form.Button>
                    
                    <Form.Button onClick={(e) => {e.preventDefault(); this.state.onClickRemoveProject(e, this.state.projectData);}} negative>
                        Удалить Проект
                    </Form.Button>
                        
                    <EditPermissionsList typeName={this.state.projectData.name} 
                        permissionsList={this.permissionsList} 
                        idType={this.state.projectId} 
                        type="project"
                    />
                </Form>
            </React.Fragment>
        );
    }
}