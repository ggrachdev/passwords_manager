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
            onClickIconEditFolder: props.onClickIconEditFolder,
            onClickIconAddFolder: props.onClickIconAddFolder,
            onClickIconEditProject: props.onClickIconEditProject,
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

                    const iconEditFolder = folder.permissions.can_edit ? (
                        <Icon onClick={(e) => {
                                this.state.onClickIconEditFolder(e, folder);
                            }} content='Редактировать папку' style={{marginLeft: '5px'}} className='icon_project' size='small' color='grey' link name='edit' />
                    ) : '';
                           
                    folders.push(
                        <Menu.Item
                            className="menu-projects"
                            name={folder.name} 
                            active={isActiveFolder}
                        >
                            <span className="menu-projects__folder" onClick={(e) => {
                                e.preventDefault();
                                this.state.onChangeFolderProject(e, folder, project);
                            }}>
                            {folder.name}
                            </span>
                            
                            {iconEditFolder}
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

                const iconEditProject = project.permissions.can_edit ? (
                    <Icon onClick={(e) => { this.state.onClickIconEditProject(e, project); }} content='Редактировать проект' style={{marginLeft: '5px'}} 
                            className='icon_project' size='small' color='grey' link name='edit' />
                    ) : '';
                
                const iconAddFolder = project.permissions.can_edit ? (
                    <Icon onClick={(e) => { this.state.onClickIconAddFolder(e, project); }} className='icon_project' size='small' color='grey' link name='add circle' />
                ) : '';

                menu.push(
                    <Menu.Item>
                        <Menu.Header>
                            {project.name} 
                            {iconEditProject}
                            {iconAddFolder}
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
        
        let InputSearch;
        
        if(this.state.searchString.length)
        {
            InputSearch = (
                <Input 
                    value={this.state.searchString} 
                    icon={{name: 'close', circular: false, link: true, onClick: () => { this.setState({ searchString: '' }); }}} 
                    onChange={this.onChangeSearchProjects} className='w100p' placeholder='Введите ключевые слова для поиска по проектам' 
                />
            );
        }
        else
        {
            InputSearch = (
                <Input 
                    value={this.state.searchString} 
                    onChange={this.onChangeSearchProjects} className='w100p' placeholder='Введите ключевые слова для поиска по проектам' 
                />
            );
        }
        
        const menu = this.renderMenu();
        return (
            <React.Fragment>
                {InputSearch}
                <Menu style={{display: (menu.length == 0 ? 'none' : '')}} size='large' vertical className='w100p'>
                    {menu}
                </Menu>
                <Header as="h5" style={{display: (menu.length == 0 ? '' : 'none')}}>Не найдено проектов</Header>
            </React.Fragment>
        );
    }
}