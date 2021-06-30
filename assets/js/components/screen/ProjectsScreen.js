import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Icon, Input, Popup, Modal, Button } from 'semantic-ui-react';
import ProjectsApi from '../../src/Api/ProjectsApi';
import PasswordsApi from '../../src/Api/PasswordsApi';
import Search from '../../src/Search/Search';
import PasswordsTable from '../passwords-table/passwords-table';
import ProjectsMenu from '../projects-menu/projects-menu';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AddProjectForm from '../form/AddProjectForm';
import AddFolderForm from '../form/AddFolderForm';
import Toastify from 'toastify-js';

const equal = require('deep-equal');

export default class ProjectsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeProject: null,
            activeFolder: null,
            
            name_project_for_add_folder: null,
            id_project_for_add_folder: null,
            
            projects: [],
            passwords: [],
            
            modal_add_folder_is_open: false,
            modal_add_project_is_open: false
        };
        
        this.onClickIconAddFolder = (e, project) => {
            this.setState({
                modal_add_folder_is_open: true,
                name_project_for_add_folder: project.name,
                id_project_for_add_folder: project.id
            });
        };
        
        this.onChangeFolderProject = (e, folder, project) => {
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
                        backgroundColor: "#8b0000",
                        duration: 3000
                    }).showToast();
                }
            });
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
                                <ProjectsMenu 
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