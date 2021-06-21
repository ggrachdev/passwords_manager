import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react';
import LoginScreen from '../screen/LoginScreen';
import { Container } from 'semantic-ui-react';

const equal = require('deep-equal');

export default class MainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: props.path,
            global_state: props.global_state
        };
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.global_state, this.props.global_state))
        {
            this.setState({
                global_state: this.props.global_state
            });
        }

        if (!equal(prevProps.path, this.props.path))
        {
            this.setState({
                path: this.props.path
            });
        }
    }

    render() {

        const {path, global_state} = this.state;

        let menu = [];

        if (global_state.user_is_auth)
        {
            menu.push(<Menu.Item
                name='cabinet' to='/cabinet/' onClick={() => {this.setState({ path: '/cabinet/' });}} 
                as={ Link }
                active={path === '/cabinet/'}>
                Кабинет
            </Menu.Item>);
        
            menu.push(<Menu.Item
                name='users' to='/users/' onClick={() => {this.setState({ path: '/users/' });}} 
                as={ Link }
                active={path === '/users/'}>
                Пользователи
            </Menu.Item>);

            menu.push(<Menu.Item
                name='logout' to='/logout/' onClick={() => {location.href = '/logout'}}
                as={ Link }>
                Выход
            </Menu.Item>);
        } else
        {
            menu.push(<Menu.Item
                name='login' onClick={() => {this.setState({ path: '/login/'});}} 
                active={path === '/'}>  
                Вход
            </Menu.Item>);
        }

        return (
            <Menu>
                <Container>
                    {menu}
                </Container>
            </Menu>
            );
    }
}