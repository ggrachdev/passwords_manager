import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Header, Menu, Grid, Icon, Input, Popup, Modal, Button } from 'semantic-ui-react';
import Search from '../../src/Search/Search';

const equal = require('deep-equal');

export default class ProjectsMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeProject: props.activeProject,
            activeFolder: props.activeFolder,
            projects: props.projects,
            onClickIconAddFolder: props.onClickIconAddFolder,
            onChangeFolderProject: props.onChangeFolderProject,
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

                    const isActiveFolder = this.state.activeFolder === folder.id && this.state.activeProject === project.id;

                    folders.push(
                        <Menu.Item
                            name={folder.name} 
                            active={isActiveFolder} 
                            onClick={(e) => {
                                this.state.onChangeFolderProject(e, folder, project);
                            }}
                        >
                            {folder.name} <Icon content='Редактировать проект' style={{marginLeft: '5px'}} className='icon_project' size='small' color='grey' link name='edit' />
                        </Menu.Item>
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
                            {project.name} 
                            <Icon content='Редактировать проект' style={{marginLeft: '5px'}} className='icon_project' size='small' color='grey' link name='edit' />
                            <Icon onClick={(e) => { this.state.onClickIconAddFolder(e, project); }} className='icon_project' size='small' color='grey' link name='add circle' />
                        </Menu.Header>
                        <Menu.Menu>
                            {folders}
                        </Menu.Menu>
                    </Menu.Item>);
            });

            return menu;
        };
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.projects, this.props.projects))
        {
            this.setState({
                projects: this.props.projects
            });
        }

        if (!equal(prevProps.activeFolder, this.props.activeFolder))
        {
            this.setState({
                activeFolder: this.props.activeFolder
            });
        }

        if (!equal(prevProps.activeProject, this.props.activeProject))
        {
            this.setState({
                activeProject: this.props.activeProject
            });
        }
    }
    
    render() {
        
        const menu = this.renderMenu();
        return (
            <React.Fragment>
                <Input onChange={this.onChangeSearchProjects} className='w100p' placeholder='Поиск...' />
                <Menu style={{display: (menu.length == 0 ? 'none' : '')}} size='large' vertical className='w100p'>
                    {menu}
                </Menu>
                <Header as="h5" style={{display: (menu.length == 0 ? '' : 'none')}}>Не найдено проектов</Header>
            </React.Fragment>
        );
    }
}