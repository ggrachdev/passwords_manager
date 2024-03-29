import React, { Component } from 'react';
import { Container, Header,  Grid, Icon, Input, Popup, Modal, Button } from 'semantic-ui-react';

import ProjectsApi from '../../src/Api/ProjectsApi';
import PasswordsApi from '../../src/Api/PasswordsApi';

import Search from '../../src/Search/Search';

import PasswordsTable from '../passwords-table/passwords-table';

import ProjectsMenu from '../projects-menu/projects-menu';

import FormSerializer from '../../src/FormSerializer/FormSerializer';

import AddProjectForm from '../form/AddProjectForm';
import AddFolderForm from '../form/AddFolderForm';

import ChangeFolderForm from '../form/ChangeFolderForm';
import ChangeProjectForm from '../form/ChangeProjectForm';

import ModalAddProject from '../modal/modal-add-project';
import ModalAddPassword from '../modal/modal-add-password';
import ModalChangePassword from '../modal/modal-change-password';

import Toasts from '../../src/Toasts/Toasts';

const equal = require('deep-equal');

export default class ProjectsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeProject: 'projectId' in props ? parseInt(props['projectId']) : null,
            activeFolder: 'folderId' in props ? parseInt(props['folderId']) : null,
            
            global_state: props.global_state,
            canAddPasswordInActiveFolder: false,
            canEditPasswordInActiveFolder: false,
            canRemovePasswordInActiveFolder: false,
            
            name_project_for_add_folder: null,
            id_project_for_add_folder: null,
            id_project_for_change: null,
            id_password_for_change: null,
            id_folder_for_change: null,

            projects: [],
            passwords: [],

            modal_add_folder_is_open: false,
            modal_add_project_is_open: false,
            modal_change_project_is_open: false,
            modal_change_folder_is_open: false,
            modal_change_password_is_open: false,
            modal_add_password_is_open: false
        };

        this.onClickIconEditPassword = (e, password) => {
            this.setState({
                id_password_for_change: password.id,
                modal_change_password_is_open: true
            });
        };

        this.onClickIconEditFolder = (e, folder) => {
            this.setState({
                modal_change_folder_is_open: true,
                id_folder_for_change: folder.id
            });
        };

        this.onClickIconAddFolder = (e, project) => {
            this.setState({
                modal_add_folder_is_open: true,
                name_project_for_add_folder: project.name,
                id_project_for_add_folder: project.id
            });
        };

        this.onClickIconEditProject = (e, project) => {
            this.setState({
                id_project_for_change: project.id,
                modal_change_project_is_open: true
            });
        };

        this.onClickRemoveFolder = (e, folder) => {
            e.preventDefault();
            
            if(confirm(`Вы действительно хотите удалить папку - ${folder.name} ? Все пароли этой папки будут удалены`))
            {
                ProjectsApi.removeFolder(folder.id).then((response) => {
                    Toasts.success(`Папка ${folder.name} успешно удалена`);
                    this.setState({
                        modal_change_folder_is_open: false
                    });
                    this.initialize();
                }).catch(() => {
                    Toasts.error(`Не удалось удалить папку - ${folder.name}`);
                });
            }
        };

        this.onClickRemoveProject = (e, project) => {
            e.preventDefault();
            
            if(confirm(`Вы действительно хотите удалить проект - ${project.name} ? Все папки и пароли этого проекта будут удалены`))
            {
                ProjectsApi.remove(project.id).then((response) => {
                    Toasts.error(`Проект ${project.name} успешно удален`);
                    this.setState({
                        modal_change_project_is_open: false
                    });
                    this.initialize();
                }).catch(() => {
                    Toasts.error(`Не удалось удалить проект - ${project.name}`);
                });
            }
        };
        
        this.updatePasswords = () => {
            if(this.state.activeFolder != null)
            {
                ProjectsApi.getFolder(this.state.activeFolder).then((response) => {
                    
                    const permissions = response.getData()['folder']['permissions'];
                    
                    this.setState({
                        canAddPasswordInActiveFolder: permissions['can_add_password'],
                        canRemovePasswordInActiveFolder: permissions['can_remove_passwords'],
                        canEditPasswordInActiveFolder: permissions['can_edit_passwords']
                    });
                }).catch(() => {
                    Toasts.error(`Не удалось загрузить папку`);
                });
                
                PasswordsApi.getForFolder(this.state.activeFolder).then((response) => {
                    if(response.getData()['passwords'].length === 0)
                    {
                        Toasts.error(`Не найдено паролей для текущей папки`);
                    }
                    this.setState({
                        passwords: response.getData()['passwords']
                    });
                }).catch(() => {
                    Toasts.error(`Не удалось загрузить пароли для текущей папки`);
                    this.initialize();
                });
            }
        };

        this.onChangeFolderProject = (e, folder, project) => {
            this.setState({
                activeProject: project.id,
                canAddPasswordInActiveFolder: folder.permissions.can_add_password,
                canRemovePasswordInActiveFolder: folder.permissions.can_remove_passwords,
                canEditPasswordInActiveFolder: folder.permissions.can_edit_passwords, 
                activeFolder: folder.id
            });
            history.pushState({}, 'Fred Security', `/projects/project-${project.id}/folder-${folder.id}/`)
            setTimeout(() => {
                this.updatePasswords();
            }, 50);
        };
        
        this.onSubmitFormAddProject = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            ProjectsApi.add(dataForm).then((response) => {
                Toasts.success(`Проект успешно создан`);
                this.setState({
                    modal_add_project_is_open: false
                });
                this.initialize();
            }).catch(() => {
                Toasts.error(`Не удалось добавить проект`);
            });
        };
        
        this.onClickRemovePasswordButton = (e) => {
            if(confirm(`Вы действительно хотите удалить пароль?`))
            {
                PasswordsApi.remove(this.state.id_password_for_change).then(() => {
                    Toasts.success(`Пароль успешно удален`);
                    this.onClickCloseModalChangePasword();
                    this.updatePasswords();
                }).catch(() => {
                    Toasts.error(`Не удалось удалить пароль`);
                });
            }
        };
        
        /**
         * Клик по кнопке с папкой в таблице паролей
         */
        this.onClickFolderPasswordsTable = (folder) => {
            
            if(folder.id != this.state.activeFolder)
            {
                this.setState({
                    activeFolder: folder.id
                });

                setTimeout(() => {
                    this.updatePasswords();
                }, 50);
            }
        };
        
        this.onClickCloseModalAddProject = () => {
            this.setState({
                modal_add_project_is_open: false
            });
        };
        
        this.onSubmitFormAddPassword = (e) => {
            const data = new FormSerializer(e.target).getObject();
            PasswordsApi.add(this.state.activeFolder, data).then(() => {
                this.setState({
                    modal_add_password_is_open: false
                });
                this.updatePasswords();
                Toasts.success(`Пароль успешно добавлен`);
            }).catch(() => {
                Toasts.error(`Не удалось добавить пароль`);
            });
        };
        
        this.onClickCloseModalChangeProject = (e) => {
            this.setState({
                modal_change_project_is_open: false
            });
        };
        
        this.onClickCloseModalChangePasword = (e) => {
            this.setState({
                modal_change_password_is_open: false
            });
        };
        
        this.onClickCloseModalAddPassword = (e) => {
            this.setState({
                modal_add_password_is_open: false
            });
        };
        
        this.onSubmitFormChangePassword = (e) => {
            const data = new FormSerializer(e.target).getObject();
            PasswordsApi.update(this.state.id_password_for_change, data).then(() => {
                Toasts.success(`Пароль успешно изменен`);
                this.onClickCloseModalChangePasword();
                this.updatePasswords();
            }).catch(() => {
                Toasts.error(`Не удалось изменить пароль`);
            });
        };

        this.initialize();
        this.updatePasswords();
    }

    initialize() {
        ProjectsApi.getList().then((response) => {
            this.setState({
                projects: response.getData()['projects']
            });
        }).catch(() => {
            Toasts.error(`Не получить данные о проектах`);
        });
    }
    
    renderModals() {
        // @todo вынести все в отдельные модалки
        return (
            <React.Fragment>
                
                <ModalChangePassword 
                    idPassword={this.state.id_password_for_change} 
                    onSubmit={this.onSubmitFormChangePassword} 
                    canRemovePasswordInActiveFolder={this.state.canRemovePasswordInActiveFolder} 
                    onClickRemovePasswordButton={this.onClickRemovePasswordButton}
                    onClickClose={this.onClickCloseModalChangePasword}
                    open={this.state.modal_change_password_is_open} 
                />
        
                <ModalAddProject 
                    onSubmit={this.onSubmitFormAddProject} 
                    onClickClose={this.onClickCloseModalAddProject}
                    open={this.state.modal_add_project_is_open} 
                />
        
                <ModalAddPassword 
                    onSubmit={this.onSubmitFormAddPassword} 
                    onClickClose={this.onClickCloseModalAddPassword}
                    open={this.state.modal_add_password_is_open} 
                />
            
                <Modal 
                    open={this.state.modal_change_project_is_open} >
                    <Modal.Header>Изменить проект</Modal.Header>
                    <Modal.Content>
                        <ChangeProjectForm 
                            projectId={this.state.id_project_for_change} 
                            onClickRemoveProject={this.onClickRemoveProject} 
                            onSubmit={(e) => {
                                const dataForm = (new FormSerializer(e.target)).getObject();
                                
                                ProjectsApi.update(this.state.id_project_for_change, dataForm).then((response) => {
                                    Toasts.success('Проект успешно изменен');
                                    this.setState({
                                        modal_change_project_is_open: false
                                    });
                                    this.initialize();
                                }).catch(() => {
                                    Toasts.error('Не удалось изменить проект');
                                });
                            }} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => {
                            this.setState({
                                modal_change_project_is_open: false
                            });
                        }}>
                            Закрыть окно
                        </Button>
                    </Modal.Actions>
                </Modal>
            
                <Modal 
                    open={this.state.modal_change_folder_is_open} >
                    <Modal.Header>Изменить папку</Modal.Header>
                    <Modal.Content>
                        <ChangeFolderForm 
                            folderId={this.state.id_folder_for_change} 
                            onClickRemoveFolder={this.onClickRemoveFolder} 
                            onSubmit={(e) => {
                                const dataForm = (new FormSerializer(e.target)).getObject();
                                
                                ProjectsApi.updateFolder(this.state.id_folder_for_change, dataForm).then((response) => {
                                    Toasts.success('Папка успешно изменена');
                                    this.setState({
                                        modal_change_folder_is_open: false
                                    });
                                    this.initialize();
                                }).catch(() => {
                                    Toasts.error('Не удалось изменить папку');
                                });
                            }} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => {
                            this.setState({
                                modal_change_folder_is_open: false
                            });
                        }}>
                            Закрыть окно
                        </Button>
                    </Modal.Actions>
                </Modal>
            
                <Modal 
                    open={this.state.modal_add_folder_is_open} >
                    <Modal.Header>Добавить папку в проект - {this.state.name_project_for_add_folder}</Modal.Header>
                    <Modal.Content>
                        <AddFolderForm onSubmit={(e) => {
                            const dataForm = (new FormSerializer(e.target)).getObject();

                            ProjectsApi.addFolder(this.state.id_project_for_add_folder, dataForm).then((response) => {

                                Toasts.success(`Папка успешно создана`);

                                this.setState({
                                    modal_add_folder_is_open: false
                                });

                                this.initialize();

                            }).catch(() => {
                                Toasts.error(`Не удалось добавить папку`);
                            });
                        }} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => {
                            this.setState({
                                modal_add_folder_is_open: false
                            });
                        }}>
                            Закрыть окно
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }

    render() {
        
        if(this.state.global_state == null) return;
        
        const ButtonAddProject = this.state.global_state.permissions.can_create_projects == true ? 
        (
            <Popup content='Добавить новый проект' 
                trigger={(<Icon onClick={() => { this.setState({ modal_add_project_is_open: true }); }} 
                className='mini' 
                style={{marginLeft: '5px'}} size='small' color='grey' link name='add circle' />)} 
            /> 
        ) : '';
        
        const ButtonHideAllProjects = this.state.projects.length > 0 ? 
        (
            <Popup content='Свернуть все проекты' 
                trigger={(<Icon onClick={() => {
                    let showedProjects = document.querySelectorAll('.project-menu-item:not(.hide) .header > span');

                    if(showedProjects)
                    {
                        showedProjects.forEach((projectMenuNode) => {
                            projectMenuNode.click();
                        });
                    }
                }} 
                className='mini' 
                style={{marginLeft: '5px'}} size='small' color='grey' link name='eye slash' />)} 
            /> 
        ) : '';
        
        const ButtonShowAllProjects = this.state.projects.length > 0 ? 
        (
            <Popup content='Развернуть все проекты' 
                trigger={(<Icon onClick={() => {
                    let hiddenProjects = document.querySelectorAll('.project-menu-item.hide .header > span');

                    if(hiddenProjects)
                    {
                        hiddenProjects.forEach((projectMenuNode) => {
                            projectMenuNode.click();
                        });
                    }
                }} 
                className='mini' 
                style={{marginLeft: '5px'}} size='small' color='grey' link name='eye' />)} 
            /> 
        ) : '';
    
        return (
            <React.Fragment>
                <Container>
                    <Header as='h1' style={{'display': 'flex', 'alignItems': 'center'}}>
                        Проекты: 
                        <div>
                            {ButtonAddProject}
                            {ButtonHideAllProjects}
                            {ButtonShowAllProjects}
                        </div>
                    </Header>
                    <Grid divided>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <ProjectsMenu 
                                    onClickIconEditFolder={this.onClickIconEditFolder} 
                                    onClickIconEditProject={this.onClickIconEditProject}
                                    activeProject={this.state.activeProject} 
                                    activeFolder={this.state.activeFolder} 
                                    onChangeFolderProject={this.onChangeFolderProject} 
                                    onClickIconAddFolder={this.onClickIconAddFolder} 
                                    projects={this.state.projects} />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <PasswordsTable 
                                    onClickFolder={this.onClickFolderPasswordsTable}
                                    onClickAddPasswordButton={() => {this.setState({modal_add_password_is_open: true})}} 
                                    activeFolder={this.state.activeFolder} 
                                    canEditPasswordInActiveFolder={this.state.canEditPasswordInActiveFolder} 
                                    canAddPasswordInActiveFolder={this.state.canAddPasswordInActiveFolder} 
                                    onClickIconEditPassword={this.onClickIconEditPassword} 
                                    activeProject={ this.state.projects.find(project => project.id == this.state.activeProject) } 
                                    passwords={this.state.passwords} 
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {this.renderModals()}
                </Container>
            </React.Fragment>
        );
    }
}