import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Header, Menu, Grid, Icon, Input, Popup, Modal, Button } from 'semantic-ui-react';
import Search from '../../src/Search/Search';
import Cookies from 'js-cookie';

/**
 * Сохраняет данные о скрытых / не скрытых проектах в куки и достает их
 */
class VisibleProjectsData {
    
    static getData()
    {
        let data = Cookies.get('not_visible_projects_ids');
        return data ? data.split(',') : [];
    }
    
    static saveData(listIds)
    {
        if(listIds.length === 0)
        {
            Cookies.remove('not_visible_projects_ids');
        }
        else
        {
            Cookies.set('not_visible_projects_ids', listIds.join(','));
        }
    }
    
    static showProjectItem(projectId)
    {
        let data = VisibleProjectsData.getData();
        let indexProject = data.indexOf(projectId.toString());
        
        if(indexProject !== -1)
        {
            data.splice(indexProject, 1);
        }
        
        VisibleProjectsData.saveData(data);
    }
    
    static hideProjectItem(projectId)
    {
        let data = VisibleProjectsData.getData();
        
        if(!data.includes(projectId))
        {
            data.push(projectId);
        }
        
        VisibleProjectsData.saveData(data);
    }
    
    static isVisible(projectId)
    {
        return !VisibleProjectsData.isNotVisible(projectId);
    }
    
    static isNotVisible(projectId)
    {
        let data = VisibleProjectsData.getData();
        return data.includes(projectId.toString());
    }
}

window.VisibleProjectsData = VisibleProjectsData;

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
            
            // Перемещаем активный проект вперед
            
            this.state.projects.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })

            let indexActiveProject = _.findIndex(this.state.projects, project => project.id == this.state.activeProject);
            if(indexActiveProject !== -1)
            {
                let activeProject = this.state.projects[indexActiveProject];
                this.state.projects.splice(indexActiveProject, 1);
                this.state.projects.unshift(activeProject);
            }

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
                                window.scrollTo(0, 0);
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
            
                let styleObj = this.state.activeProject === project.id ? {'backgroundColor': '#f9ffe7'} : {};
                
                let projectId = project.id;
                
                let isVisibleProject = VisibleProjectsData.isVisible(projectId) || searchString.length > 0 || this.state.activeProject === projectId;
                    
                let visibleClass = isVisibleProject ? 'project-menu-item' : 'hide project-menu-item';

                menu.push(
                    <Menu.Item className={visibleClass} style={styleObj}>
                        <Menu.Header>
                            <span onClick={(e) => {
                                
                                if(!(searchString.length > 0 || this.state.activeProject === projectId))
                                {
                                    if(isVisibleProject)
                                    {
                                        e.target.closest('.project-menu-item').classList.add('hide');
                                        VisibleProjectsData.hideProjectItem(projectId);
                                        isVisibleProject = false;
                                    }
                                    else
                                    {
                                        e.target.closest('.project-menu-item').classList.remove('hide');
                                        VisibleProjectsData.showProjectItem(projectId);
                                        isVisibleProject = true;
                                    }
                                }
                                
                            }}>{project.name}</span>
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
    
    componentDidMount() {
        setTimeout(() => {
            document.querySelector('#search_from_projects').focus();
        }, 300);
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
                <Input id="search_from_projects" 
                    value={this.state.searchString} 
                    icon={{name: 'close', circular: false, link: true, onClick: () => { this.setState({ searchString: '' }); }}} 
                    onChange={this.onChangeSearchProjects} className='w100p' placeholder='Поиск по проектам' 
                />
            );
        }
        else
        {
            InputSearch = (
                <Input id="search_from_projects" 
                    value={this.state.searchString} 
                    onChange={this.onChangeSearchProjects} className='w100p' placeholder='Поиск по проектам' 
                />
            );
        }
        
        const menu = this.renderMenu();
        return (
            <React.Fragment>
                <form autocomplete="off">
                    {InputSearch}
                </form>
                <Menu style={{display: (menu.length == 0 ? 'none' : '')}} size='large' vertical className='w100p'>
                    {menu}
                </Menu>
                <Header as="h5" style={{display: (menu.length == 0 ? '' : 'none')}}>Не найдено проектов</Header>
            </React.Fragment>
        );
    }
}