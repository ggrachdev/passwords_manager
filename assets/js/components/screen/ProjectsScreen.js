import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Table, Icon } from 'semantic-ui-react';

const equal = require('deep-equal');

export default class ProjectsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            activeItem: 'enterprise'
        };

        this.handleItemClick = (e, { name }) => this.setState({activeItem: name})
    }

    render() {

        const {errors, activeItem} = this.state;

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
                    <Table.Row>
                        <Table.Cell>Пароль от ФТП</Table.Cell>
                        <Table.Cell>testLogin</Table.Cell>
                        <Table.Cell>password</Table.Cell>
                        <Table.Cell>Заходить через порт 22</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );

        const MenuProjects = () => (
            <Menu size='large' vertical>
                <Menu.Item>
                    <Menu.Header>Академ18 <Icon className='icon_edit_project' size='small' color='grey' link name='edit' /></Menu.Header>
            
                    <Menu.Menu>
                        <Menu.Item
                            name='enterprise'
                            active={activeItem === 'enterprise'}
                            onClick={this.handleItemClick}
                            />
                        <Menu.Item
                            name='consumer'
                            active={activeItem === 'consumer'}
                            onClick={this.handleItemClick}
                            />
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
        );

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>Проекты:</Header>
                    <Grid divided>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                {MenuProjects()}
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