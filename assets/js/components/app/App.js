import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react';
import LoginScreen from '../screen/LoginScreen';
import MainMenu from '../main-menu/main-menu';
import { Container } from 'semantic-ui-react';
import StateApi from '../../src/Api/StateApi';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
            /**
             * Текущий путь
             */
            path: location.pathname,
            
            /**
             * Получены ли первичные данные для инициализации приложения
             */
            app_is_initialized: false,
            
            global_state: null
            
        };
        
        StateApi.get().then((data) => {
            this.setState({
                global_state: data,
                app_is_initialized: true
            });
        });
    }

    render() {

        const {path, app_is_initialized} = this.state;
        
        if (app_is_initialized)
        {
            return (
                <Router>
                    <MainMenu path={path}/>
                    <Route path="/">
                        <LoginScreen/>
                    </Route>
                </Router>
                );
        } else
        {
            return (
                <React.Fragment>
                    <br/>
                    <br/>
                    <Container>
                        Загрузка...
                    </Container>
                </React.Fragment>
                );
        }
    }
}