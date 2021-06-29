import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Table, Icon, Input } from 'semantic-ui-react';
import ProjectsApi from '../../src/Api/ProjectsApi';

const equal = require('deep-equal');

export default class ProjectsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            activeFolder: null,
            activeProject: null,
            projects: [],
            search: '',
        };
        
        ProjectsApi.getList().then((response) => {
            this.setState({
                projects: response.getData()['projects']
            });
        });

        this.renderMenu = () => {
            const menu = [];

            this.state.projects.forEach((project) => {

                const folders = [];

                project.folders.forEach((folder) => {
                    
                    folders.push(
                        <Menu.Item
                            name={folder.name} 
                            active={this.state.activeFolder === folder.name && this.state.activeProject === project.name}
                            onClick={() => {
                                this.setState({
                                    activeProject: project.name,
                                    activeFolder: folder.name
                                });
                            }}
                        />
                    );
                });

                menu.push(
                    <Menu.Item>
                        <Menu.Header>
                            {project.name} <Icon className='icon_edit_project' size='small' color='grey' link name='edit' /><Icon className='icon_edit_project' size='small' color='grey' link name='add circle' />
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
        
        const tableBody = [];
        
        for(var i = 0; i <= 50; i++)
        {
            tableBody.push(
                <Table.Row>
                    <Table.Cell>Пароль от ФТП {i}</Table.Cell>
                    <Table.Cell>testLogin</Table.Cell>
                    <Table.Cell>password</Table.Cell>
                    <Table.Cell>Заходить через порт 22</Table.Cell>
                </Table.Row>
            );
        }

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
                    {tableBody}
                </Table.Body>
            </Table>
        );

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>Проекты:</Header>
                    <Grid divided>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Input className='w100p' placeholder='Поиск...' />
                                <Menu size='large' vertical className='w100p'>
                                    {this.renderMenu()}
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={12}>
                                {PasswordsTable()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
            
                </Container>
            </React.Fragment>
            );
    }
}