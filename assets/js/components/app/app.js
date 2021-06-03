import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react';
import LoginScreen from '../screen/LoginScreen';
import MainMenu from '../main-menu/main-menu';
import { Container } from 'semantic-ui-react';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname
        };
    }

    render() {

        const {path} = this.state;
        
        return (
            <Router>
                <MainMenu path={path}/>
                <Route path="/">
                    <LoginScreen/>
                </Route>
            </Router>
            );
    }
}