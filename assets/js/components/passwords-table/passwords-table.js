import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Icon, Container, Input, Table } from 'semantic-ui-react';
import Search from '../../src/Search/Search';

const equal = require('deep-equal');

export default class PasswordsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: props.passwords,
            searchStringPasswords: ''
        };

        this.onChangeSearchPasswords = (e) => {
            this.setState({
                searchStringPasswords: e.target.value
            });
        };

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
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.passwords, this.props.passwords))
        {
            this.setState({
                passwords: this.props.passwords
            });
        }
    }
    
    render() {
        return (
            <React.Fragment>
                <Input onChange={this.onChangeSearchPasswords} placeholder='Поиск...' />
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
            </React.Fragment>
        );
    }
}