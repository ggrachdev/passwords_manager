import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Icon, Input, Popup, Modal, Button } from 'semantic-ui-react';
import ProjectsApi from '../../src/Api/ProjectsApi';
import PasswordsApi from '../../src/Api/PasswordsApi';
import Search from '../../src/Search/Search';
import PasswordsTable from '../passwords-table/passwords-table';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AddProjectForm from '../form/AddProjectForm';
import AddFolderForm from '../form/AddFolderForm';
import Toastify from 'toastify-js';

const equal = require('deep-equal');

export default class ProjectsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            activeFolder: null,
            activeProject: null,
            projects: [],
            passwords: [],
            modal_add_project_is_open: false,
            modal_add_folder_is_open: false,
            name_project_for_add_folder: null,
            id_project_for_add_folder: null,
            searchString: ''
        };

        this.onChangeSearchProjects = (e) => {
            this.setState({
                searchString: e.target.value
            });
        };

        this.renderMenu = () => {
            const menu = [];
            const searchString = this.state.searchString;

            this.state.projects.forEach((project) => {

                const folders = [];

                let projectIsSearched = Search.string(project.name, searchString);
                let folderIsSearched = false;

                project.folders.forEach((folder) => {

                    if (folderIsSearched === false)
                    {
                        folderIsSearched = Search.string(folder.name, searchString);
                    }

                    const isActiveFolder = this.state.activeFolder === folder.id && this.state.activeProject === project.name;

                    folders.push(
                        <Menu.Item
                            name={folder.name} 
                            active={isActiveFolder}
                            onClick={() => {

                                    if (isActiveFolder)
                                        return;

                                    PasswordsApi.getForFolder(folder.id).then((response) => {
                                        this.setState({
                                            activeProject: project.name,
                                            activeFolder: folder.id,
                                            passwords: response.getData()['passwords']
                                        });

                                        if (response.getData()['passwords'].length === 0)
                                        {
                                            Toastify({
                                                text: `Не найдено паролей для папки - ${folder.name}`,
                                                background: "darkred",
                                                duration: 3000
                                            }).showToast();
                                        }
                                    });
                                }}
                            />
                        );
                });

                if (searchString.length > 0)
                {
                    if (!projectIsSearched && !folderIsSearched)
                    {
                        return;
                    }
                }

                menu.push(
                    <Menu.Item>
                        <Menu.Header>
                            {project.name} <Icon content='Редактировать проект' style={{marginLeft: '5px'}} className='icon_project' size='small' color='grey' link name='edit' />
                            <Icon onClick={() => {
                                this.setState({
                                    modal_add_folder_is_open: true,
                                    name_project_for_add_folder: project.name,
                                    id_project_for_add_folder: project.id
                                });
                            }} content='Добавить папку' className='icon_project' size='small' color='grey' link name='add circle' />
                        </Menu.Header>
                        <Menu.Menu>
                            {folders}
                        </Menu.Menu>
                    </Menu.Item>);
            });

            return menu;
        };
        
        this.initialize();
    }
    
    initialize() {
        ProjectsApi.getList().then((response) => {
            this.setState({
                projects: response.getData()['projects']
            });
        });
    }

    render() {

        const {errors, activeFolder} = this.state;

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>
                        Проекты: 
                        <Popup content='Добавить новый проект' trigger={(<Icon onClick={() => {
                            this.setState({
                                modal_add_project_is_open: true
                            });
                        }} className='icon_add-new-project' style={{marginLeft: '5px'}} size='small' color='grey' link name='add circle' />)} /> 
                    </Header>
                    <Grid divided>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Input onChange={this.onChangeSearchProjects} className='w100p' placeholder='Поиск...' />
                                <Menu size='large' vertical className='w100p'>
                                    {this.renderMenu()}
                                </Menu>
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
                                
                                Toastify({
                                    text: `Проект успешно создан`,
                                    backgroundColor: "green",
                                    duration: 3000
                                }).showToast();
                                
                                this.setState({
                                    modal_add_project_is_open: false
                                });
                                
                                this.initialize();
                                
                            }).catch(() => {
                                Toastify({
                                    text: `Не удалось добавить проект`,
                                    backgroundColor: "darkred",
                                    duration: 3000
                                }).showToast();
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
                    open={this.state.modal_add_folder_is_open} >
                    <Modal.Header>Добавить папку в проект - {this.state.name_project_for_add_folder}</Modal.Header>
                    <Modal.Content>
                        <AddFolderForm onSubmit={(e) => {
                            const dataForm = (new FormSerializer(e.target)).getObject();
                            
                            ProjectsApi.addFolder(this.state.id_project_for_add_folder, dataForm).then((response) => {
                                
                                Toastify({
                                    text: `Папка успешно создана`,
                                    backgroundColor: "green",
                                    duration: 3000
                                }).showToast();
                                
                                this.setState({
                                    modal_add_folder_is_open: false
                                });
                                
                                this.initialize();
                                
                            }).catch(() => {
                                Toastify({
                                    text: `Не удалось добавить папку`,
                                    backgroundColor: "darkred",
                                    duration: 3000
                                }).showToast();
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