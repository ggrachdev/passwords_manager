import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Icon, Container, Input, Table, Button, Popup } from 'semantic-ui-react';
import Search from '../../src/Search/Search';
import Toasts from '../../src/Toasts/Toasts';
const equal = require('deep-equal');

function truncate(str, maxlength) {
    return (str.length > maxlength) ? str.slice(0, maxlength) + '...' : '...';
}
          
export default class PasswordsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwords: props.passwords,
            activeFolder: props.activeFolder,
            canAddPasswordInActiveFolder: props.canAddPasswordInActiveFolder,
            canEditPasswordInActiveFolder: props.canEditPasswordInActiveFolder,
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
            // Step 1: create a textarea element.
            // It is capable of holding linebreaks (newlines) unlike "input" element
            const myFluffyTextarea = document.createElement('textarea');

            // Step 2: Store your string in innerHTML of myFluffyTextarea element        
            myFluffyTextarea.innerHTML = textForCopy;

            // Step3: find an id element within the body to append your myFluffyTextarea there temporarily
            const parentElement = document.querySelector('body');
            parentElement.appendChild(myFluffyTextarea);

            // Step 4: Simulate selection of your text from myFluffyTextarea programmatically 
            myFluffyTextarea.select();

            // Step 5: simulate copy command (ctrl+c)
            // now your string with newlines should be copied to your clipboard 
            document.execCommand('copy');

            // Step 6: Now you can get rid of your fluffy textarea element
            parentElement.removeChild(myFluffyTextarea);
            Toasts.success('Успешно скопировано');
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
                
                const buttonEditPassword = (this.state.canEditPasswordInActiveFolder == true) ? (
                    <Icon onClick={ (e) => { this.state.onClickIconEditPassword(e, password) } } size='small' color='grey' link name='edit' />
                ) : '';
                    
                const bodyPassword = (
                    <React.Fragment>
                        <Table.Cell>
                            { password.tags.includes('compromised') ? ( <Popup content='Пароль скомпрометирован' trigger={(<Icon name='attention' />) } /> ) : '' }
                            { password.tags.includes('not_working') ? ( <Popup content='Пароль не актуален' trigger={(<Icon name='question circle' />) } /> ) : '' }
                            {password.name}
                        </Table.Cell>
                        <Table.Cell>
                            <Icon style={{float: 'right'}} link color='grey' name='copy' onClick={() => { this.copyText(password.login) }} />
                            {password.login}
                        </Table.Cell>
                        <Table.Cell>
                            <Icon style={{float: 'right'}} link color='grey' name='copy' onClick={() => { this.copyText(password.password) }} />
                            <Icon style={{float: 'right'}} link color='grey' name='eye' onClick={() => { alert(password.password) }} />
                            { truncate(password.password, 3) }
                        </Table.Cell>
                        <Table.Cell className='display-linebreak'>{password.description}</Table.Cell>
                        <Table.Cell textAlign="center">
                            {buttonEditPassword}
                            <Icon link color='grey' name='copy' onClick={() => { 
                                const folderName = document.querySelector('.active.menu-projects').innerText;
                                const projectName = document.querySelector('.active.menu-projects').closest('.menu').closest('.item').querySelector('.header').innerText;
                                this.copyText(`Проект: ${projectName} \\ ${folderName}\n\nНазвание: ${password.name}\n\nЛогин: ${password.login}\n\nПароль: ${password.password}`) }
                            } />
                        </Table.Cell>
                    </React.Fragment>
                );
            
            
                let styleTable = '';
                
                if(password.tags.includes('compromised'))
                {
                    styleTable = 'negative';
                }
                else if(password.tags.includes('not_working'))
                {
                    styleTable = 'warning';
                }
                
                passwords.push(
                    <Table.Row {...{[styleTable]: true}}>
                        {bodyPassword}
                    </Table.Row>
                );
            });

            return passwords;

        };
    }

    componentDidUpdate(prevProps) {

        if (
            !equal(prevProps.passwords, this.props.passwords) ||
            !equal(prevProps.canAddPasswordInActiveFolder, this.props.canAddPasswordInActiveFolder) ||
            !equal(prevProps.canAddPasswordInActiveFolder, this.props.canAddPasswordInActiveFolder) ||
            !equal(prevProps.canEditPasswordInActiveFolder, this.props.canEditPasswordInActiveFolder)
        )
        {
            this.setState({
                passwords: this.props.passwords,
                activeFolder: this.props.activeFolder,
                canEditPasswordInActiveFolder: this.props.canEditPasswordInActiveFolder,
                canAddPasswordInActiveFolder: this.props.canAddPasswordInActiveFolder
            });
        }
    }
    
    render() {
        
        const Passwords = this.renderPasswords();
        let ButtonAddPassword = '';
        
        if(this.state.canAddPasswordInActiveFolder == true)
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