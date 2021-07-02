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
import Toasts from '../../src/Toasts/Toasts';

const equal = require('deep-equal');

export default class ProjectsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeProject: null,
            activeFolder: null,

            name_project_for_add_folder: null,
            id_project_for_add_folder: null,
            id_project_for_change: null,
            id_folder_for_change: null,

            projects: [],
            passwords: [],

            modal_add_folder_is_open: false,
            modal_add_project_is_open: false,
            modal_change_project_is_open: false,
            modal_change_folder_is_open: false
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
                    Toasts.error(`Проект ${folder.name} успешно удален`);
                    
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

        this.onChangeFolderProject = (e, folder, project) => {
            PasswordsApi.getForFolder(folder.id).then((response) => {

                if (response.getData()['passwords'].length === 0 && this.state.activeFolder != folder.id)
                {
                    Toasts.error(`Не найдено паролей для папки - ${folder.name}`);
                }
                
                this.setState({
                    activeProject: project.id,
                    activeFolder: folder.id,
                    passwords: response.getData()['passwords']
                });
            }).catch(() => {
                Toasts.error(`Не удалось загрузить папку - ${folder.name}`);
                this.initialize();
            });
        };

        this.initialize();
    }

    initialize() {
        ProjectsApi.getList().then((response) => {
            this.setState({
                projects: response.getData()['projects']
            });
        }).catch(() => {
            Toasts.error(`Не получить данные о проектах`);
            this.initialize();
        });
    }

    render() {

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>
                        Проекты: 
                        <Popup content='Добавить новый проект' 
                        trigger={(<Icon onClick={() => { this.setState({ modal_add_project_is_open: true }); }} 
                        className='icon_add-new-project' 
                        style={{marginLeft: '5px'}} size='small' color='grey' link name='add circle' />)} 
                    /> 
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
                                <PasswordsTable passwords={this.state.passwords}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
            
                </Container>
            
                <Modal 
                    open={this.state.modal_add_project_is_open} >
                    <Modal.Header>Добавить проект</Modal.Header>
                    <Modal.Content>
                        <AddProjectForm onSubmit={(e) => {
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
                        }} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => {
                            this.setState({
                                modal_add_project_is_open: false
                            });
                        }}>
                            Закрыть окно
                        </Button>
                    </Modal.Actions>
                </Modal>
            
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
}