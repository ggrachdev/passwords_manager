import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Menu, Icon, Container } from 'semantic-ui-react';

const equal = require('deep-equal');

export default class MainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname,
            global_state: props.global_state
        };
        
        this.handlers = {
            changeMenuItem: (e) => {
                this.setState({
                    path: e.target.getAttribute("href") 
                });
            }  
        };
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.global_state, this.props.global_state))
        {
            this.setState({
                global_state: this.props.global_state
            });
        }
    }
    
    renderMenu()
    {
        const {path, global_state} = this.state;
        
        let menu = [];

        if (global_state.user_is_auth)
        {
            menu.push(<Menu.Item 
                name='cabinet' to='/cabinet/' onClick={this.handlers.changeMenuItem} 
                as={ Link }
                active={path === '/cabinet/'}>
                <Icon name='user circle' />
                {global_state.user_name} {global_state.user_second_name}
            </Menu.Item>);
        
            menu.push(<Menu.Item 
                name='cabinet' to='/projects/' onClick={this.handlers.changeMenuItem} 
                as={ Link }
                active={path === '/projects/'}>
                <Icon name='briefcase' />
                Проекты
            </Menu.Item>);
        
            menu.push(<Menu.Item 
                name='cabinet' to='/history/' onClick={this.handlers.changeMenuItem} 
                as={ Link }
                active={path === '/history/'}>
                <Icon name='history' />
                История
            </Menu.Item>);
        
            if(global_state.user_roles.includes('ROLE_ADMIN'))
            {
                menu.push(<Menu.Item 
                    name='users' to='/users/' onClick={this.handlers.changeMenuItem} 
                    as={ Link }
                    active={path === '/users/'}>
                    <Icon name='user' />
                    Пользователи
                </Menu.Item>);
            
                menu.push(<Menu.Item 
                    name='roles' to='/roles/' onClick={this.handlers.changeMenuItem} 
                    as={ Link }
                    active={path === '/roles/'}>
                    <Icon name='users' />
                    Роли
                </Menu.Item>);
            }

            menu.push(<Menu.Item 
                name='logout' onClick={() => {location.href = '/logout'}}
                as={ Link }>
                <Icon name='sign-out' />
                Выход
            </Menu.Item>);
        } else
        {
            menu.push(<Menu.Item 
                name='login' onClick={this.handlers.changeMenuItem} 
                active={path === '/'}>  
                <Icon name='sign-in' />
                Вход
            </Menu.Item>);
        }
        
        return menu;
    }

    render() {

        return (
            <Menu inverted color='blue'>
                <Container>
                    {this.renderMenu()}
                </Container>
            </Menu>
        );
    }
}