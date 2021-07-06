import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Icon, Container, Input, Table, Button, Popup } from 'semantic-ui-react';
import Search from '../../src/Search/Search';
import Toasts from '../../src/Toasts/Toasts';
const equal = require('deep-equal');

export default class PasswordsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: props.passwords,
            activeFolder: props.activeFolder,
            onClickIconEditPassword: props.onClickIconEditPassword,
            onClickAddPasswordButton: props.onClickAddPasswordButton,
            searchStringPasswords: ''
        };

        this.onChangeSearchPasswords = (e) => {
            this.setState({
                searchStringPasswords: e.target.value
            });
        };
        
        this.copyText = (textForCopy) => {
            console.log(textForCopy);
            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("value", textForCopy);
            var child = document.querySelector("body").appendChild(input);
            child.select();
            document.execCommand("copy");
            child.remove();
            
            Toasts.success('Текст успешно скопирован');
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
            
                    
                if(password.tags.includes('compromised'))
                {
                    passwords.push(
                        <Table.Row negative>
                            <Table.Cell>
                                <Popup content='Пароль скомпрометирован' trigger={(<Icon name='attention' />)} /> {password.name}
                            </Table.Cell>
                            <Table.Cell><Icon link color='grey' name='copy' onClick={() => { this.copyText(password.login) }} /> {password.login}</Table.Cell>
                            <Table.Cell>
                                <Icon link color='grey' name='copy' onClick={() => { this.copyText(password.password) }} />
                                <Icon link color='grey' name='eye' onClick={() => { alert(password.password) }} />
                            </Table.Cell>
                            <Table.Cell>{password.description}</Table.Cell>
                            <Table.Cell textAlign="center">
                                <Icon onClick={ (e) => { this.state.onClickIconEditPassword(e, password) } } size='small' color='grey' link name='edit' />
                            </Table.Cell>
                        </Table.Row>
                    );
                }
                else
                {
                    if(password.tags.includes('not_working'))
                    {
                        passwords.push(
                            <Table.Row warning>
                                <Table.Cell>
                                    <Popup content='Пароль не актуален' trigger={(<Icon name='question circle' />)} /> {password.name}
                                </Table.Cell>
                                <Table.Cell><Icon link color='grey' name='copy' onClick={() => { this.copyText(password.login) }} /> {password.login}</Table.Cell>
                                <Table.Cell>
                                    <Icon link color='grey' name='copy' onClick={() => { this.copyText(password.password) }} />
                                    <Icon link color='grey' name='eye' onClick={() => { alert(password.password) }} />
                                </Table.Cell>
                                <Table.Cell>{password.description}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Icon onClick={ (e) => { this.state.onClickIconEditPassword(e, password) } } size='small' color='grey' link name='edit' />
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                    else
                    {
                        passwords.push(
                            <Table.Row>
                                <Table.Cell>{password.name}</Table.Cell>
                                <Table.Cell>
                                    <Icon link color='grey' name='copy' onClick={() => { this.copyText(password.login) }} /> {password.login}
                                </Table.Cell>
                                <Table.Cell>
                                    <Icon link color='grey' name='copy' onClick={() => { this.copyText(password.password) }} />
                                    <Icon link color='grey' name='eye' onClick={() => { alert(password.password) }} />
                                </Table.Cell>
                                <Table.Cell>{password.description}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Icon onClick={ (e) => { this.state.onClickIconEditPassword(e, password) } } size='small' color='grey' link name='edit' />
                                </Table.Cell>
                            </Table.Row>
                        );
                    }
                }
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

        if (!equal(prevProps.activeFolder, this.props.activeFolder))
        {
            this.setState({
                activeFolder: this.props.activeFolder
            });
        }
    }
    
    render() {
        
        const Passwords = this.renderPasswords();
        let ButtonAddPassword = '';
        
        if(this.state.activeFolder !== null)
        {
            ButtonAddPassword = <Button onClick={this.state.onClickAddPasswordButton} positive style={{marginLeft: '10px', position: 'relative', bottom: '1px'}}>Добавить пароль</Button>;
        }
        
        return (
            <React.Fragment>
                <Input onChange={this.onChangeSearchPasswords} placeholder='Поиск...' /> 
                {ButtonAddPassword}
                <Table style={{display: (Passwords.length == 0 ? 'none' : '')}} celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Название</Table.HeaderCell>
                            <Table.HeaderCell>Логин</Table.HeaderCell>
                            <Table.HeaderCell>Пароль</Table.HeaderCell>
                            <Table.HeaderCell>Пояснение</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {Passwords}
                    </Table.Body>
                </Table>
            </React.Fragment>
        );
    }
}