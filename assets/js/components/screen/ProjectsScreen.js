import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Table, Icon, Input, Popup } from 'semantic-ui-react';
import ProjectsApi from '../../src/Api/ProjectsApi';
import PasswordsApi from '../../src/Api/PasswordsApi';
import Search from '../../src/Search/Search';
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
            searchString: '',
            searchStringPasswords: ''
        };

        this.onChangeSearchProjects = (e) => {
            this.setState({
                searchString: e.target.value
            });
        };

        this.onChangeSearchPasswords = (e) => {
            this.setState({
                searchStringPasswords: e.target.value
            });
        };

        ProjectsApi.getList().then((response) => {
            this.setState({
                projects: response.getData()['projects']
            });
        });

        this.renderPasswords = () => {
            const passwords = [];

            const searchString = this.state.searchStringPasswords;

            this.state.passwords.forEach((password) => {

                if (searchString.length > 0)
                {
                    if (
                        !Search.string(password.name, searchString) && 
                        !Search.string(password.description, searchString) &&
                        !Search.string(password.login, searchString)
                    ) {
                        return;
                    };
                }

                passwords.push(
                    <Table.Row>
                        <Table.Cell>{password.name}</Table.Cell>
                        <Table.Cell>{password.login}</Table.Cell>
                        <Table.Cell>{password.password}</Table.Cell>
                        <Table.Cell>{password.description}</Table.Cell>
                    </Table.Row>
                    );
            });

            return passwords;

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

                    const isActiveFolder = this.state.activeFolder === folder.name && this.state.activeProject === project.name;

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
                                            activeFolder: folder.name,
                                            passwords: response.getData()['passwords']
                                        });

                                        if (response.getData()['passwords'].length === 0)
                                        {
                                            Toastify({
                                                text: `Не найдено паролей для папки - ${folder.name}`,
                                                backgroundColor: "darkred",
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
                            <Icon content='Добавить папку' className='icon_project' size='small' color='grey' link name='add circle' />
                        </Menu.Header>
                        <Menu.Menu>
                            {folders}
                        </Menu.Menu>
                    </Menu.Item>);
            });

            return menu;
        };
    }

    render() {

        const {errors, activeFolder} = this.state;
        const PasswordsTable = () => (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Название</Table.HeaderCell>
                            <Table.HeaderCell>Логин</Table.HeaderCell>
                            <Table.HeaderCell>Пароль</Table.HeaderCell>
                            <Table.HeaderCell>Пояснение</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                
                    <Table.Body>
                        {this.renderPasswords()}
                    </Table.Body>
                </Table>
                );

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>
                        Проекты: 
                        <Popup content='Добавить новый проект' trigger={(<Icon className='icon_add-new-project' style={{marginLeft: '5px'}} size='small' color='grey' link name='add circle' />)} /> 
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
                                <Input onChange={this.onChangeSearchPasswords} placeholder='Поиск...' />
                                {PasswordsTable()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
            
                </Container>
            </React.Fragment>
        );
    }
}