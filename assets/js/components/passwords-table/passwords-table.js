import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Icon, Container, Input, Table, Button, Popup, Header } from 'semantic-ui-react';
import Search from '../../src/Search/Search';
import Toasts from '../../src/Toasts/Toasts';
import TextCopier from '../../src/TextCopier/TextCopier';
const equal = require('deep-equal');

function truncate(str, maxlength) {
    return (str.length > maxlength) ? str.slice(0, maxlength) + '...' : '...';
}
          
export default class PasswordsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeProject: props.activeProject,
            passwords: props.passwords,
            activeFolder: props.activeFolder,
            canAddPasswordInActiveFolder: props.canAddPasswordInActiveFolder,
            canEditPasswordInActiveFolder: props.canEditPasswordInActiveFolder,
            onClickIconEditPassword: props.onClickIconEditPassword,
            onClickAddPasswordButton: props.onClickAddPasswordButton,
            onClickFolder: props.onClickFolder,
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
                
                const buttonEditPassword = (this.state.canEditPasswordInActiveFolder == true) ? (
                    <Icon onClick={ (e) => { this.state.onClickIconEditPassword(e, password) } } size='small' color='grey' link name='edit' />
                ) : '';
                    
                let httpRegExp = /(http:\/\/[.\w/=&?-]+)/gi;
                let httpsRegExp = /(https:\/\/[.\w/=&?-]+)/gi;
                
                let desc = '';
                
                // Первая ссылка
                let firstLinkMatch = null;
                
                if(typeof password.description === "string")
                {
                    desc = password.description.replace(httpRegExp, "<a target='_blank' href='$1'>$1</a>").replace(httpsRegExp, "<a target='_blank' href='$1'>$1</a>");
                
                    let httpMatches = password.description.match(httpRegExp);
                    let httpsMatches = password.description.match(httpsRegExp);
                    
                    if(httpMatches)
                    {
                        firstLinkMatch = httpMatches[0];
                    }
                    else if(httpsMatches)
                    {
                        firstLinkMatch = httpsMatches[0];
                    }
                }
                    
                const bodyPassword = (
                    
                    <React.Fragment>
                        <Table.Cell>
                            { password.tags.includes('compromised') ? ( <Popup content='Пароль скомпрометирован' trigger={(<Icon name='attention' />) } /> ) : '' }
                            { password.tags.includes('not_working') ? ( <Popup content='Пароль не актуален' trigger={(<Icon name='question circle' />) } /> ) : '' }
                            {password.name}
                        </Table.Cell>
                        <Table.Cell>
                            <Icon style={{float: 'right'}} link color='grey' name='copy' onClick={() => { TextCopier.copy(password.login) }} />
                            {password.login}
                        </Table.Cell>
                        <Table.Cell>
                            <Icon style={{float: 'right'}} link color='grey' name='copy' onClick={() => { TextCopier.copy(password.password) }} />
                            <Icon style={{float: 'right'}} link color='grey' name='eye' onClick={() => { alert(password.password) }} />
                            { truncate(password.password, 3) }
                        </Table.Cell>
                        <Table.Cell className='display-linebreak'>
                            <div dangerouslySetInnerHTML={{__html: desc}} />
                        </Table.Cell>
                        
                        <Table.Cell textAlign="center">
                            {buttonEditPassword}
                            <Icon link color='grey' name='copy'
                                onClick={() => { 
                                    const folderName = document.querySelector('.active.menu-projects').innerText;
                                    const projectName = document.querySelector('.active.menu-projects').closest('.menu').closest('.item').querySelector('.header').innerText;

                                    let textCopyFull = `Проект: ${projectName} \\ ${folderName}\n\nНазвание: ${password.name}\n\nЛогин: ${password.login}\n\nПароль: ${password.password}`;

                                    if(firstLinkMatch)
                                    {
                                        textCopyFull = `Проект: ${projectName} \\ ${folderName}\n\nНазвание: ${password.name}\n\nСсылка для входа: ${firstLinkMatch}\n\nЛогин: ${password.login}\n\nПароль: ${password.password}                                         `;
                                    }

                                    TextCopier.copy(textCopyFull);
                                }
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
            !equal(prevProps.canEditPasswordInActiveFolder, this.props.canEditPasswordInActiveFolder) || 
            !equal(prevProps.activeProject, this.props.activeProject) ||
            !equal(prevProps.activeFolder, this.props.activeFolder)
        )
        {
            this.setState({
                passwords: this.props.passwords,
                activeFolder: this.props.activeFolder,
                activeProject: this.props.activeProject,
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
            ButtonAddPassword = <Button onClick={this.state.onClickAddPasswordButton} positive style={{position: 'relative', bottom: '1px'}}>Добавить пароль</Button>;
        }
            
        let InputSearch;
        
        if(this.state.passwords.length)
        {

            if(this.state.searchStringPasswords.length)
            {
                InputSearch = (
                    <Input style={{width: '300px', marginRight: '10px'}} value={this.state.searchStringPasswords} 
                        icon={{name: 'close', circular: false, link: true, onClick: () => { this.setState({ searchStringPasswords: '' }); }}} 
                        onChange={this.onChangeSearchPasswords} placeholder='Поиск по паролям' /> 
                );
            }
            else
            {
                InputSearch = (
                    <Input style={{width: '300px', marginRight: '10px'}} value={this.state.searchStringPasswords} onChange={this.onChangeSearchPasswords} placeholder='Поиск по паролям' /> 
                );
            }  
        }
        
        
        let FoldersButtons = [];
            
        if(this.state.activeProject)
        {
            FoldersButtons.push((
                <Header style={{'marginTop': '20px'}} as='h3'>{this.state.activeProject.name}</Header> 
            ));
            if(this.state.activeProject.folders.length > 0)
            {
                this.state.activeProject.folders.forEach((folder) => {
                    let color = this.state.activeFolder === folder.id ? 'green' : '';
                    FoldersButtons.push((
                        <Button onClick={() => { this.state.onClickFolder(folder); }} color={color} size='tiny'>{folder.name}</Button>
                    ));
                });
            }
        }
        
        return (
            <React.Fragment>
                {InputSearch}
                {ButtonAddPassword}
                
                <div>
                    {FoldersButtons}
                </div>
                
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