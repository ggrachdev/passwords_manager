import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react';
import LoginScreen from '../screen/LoginScreen';
import { Container } from 'semantic-ui-react';

export default class MainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: props.path
        };
    }

    render() {

        const {path} = this.state;

        return (
            <Menu>
                <Container>
                    <Menu.Item
                        name='main'
                        active={path === '/'}>
                        Вход
                    </Menu.Item>
                </Container>
            </Menu>
            );
    }
}