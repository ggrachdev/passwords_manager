import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import { Menu } from 'semantic-ui-react';
import LoginScreen from '../screen/LoginScreen';
import CabinetScreen from '../screen/CabinetScreen';
import UsersScreen from '../screen/UsersScreen';
import RolesScreen from '../screen/RolesScreen';
import MainMenu from '../main-menu/main-menu';
import { Container, Loader, Dimmer } from 'semantic-ui-react';
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

        const {path, app_is_initialized, global_state} = this.state;

        if (app_is_initialized)
        {
            return (
                <Router>
                    <MainMenu global_state={global_state} path={path}/>
                    
                    <br/>
                    
                    <Switch>
                        <Route path="/cabinet/">
                            <CabinetScreen global_state={global_state}/>
                        </Route>
                        <Route path="/users/">
                            <UsersScreen global_state={global_state}/>
                        </Route>
                        <Route path="/roles/">
                            <RolesScreen global_state={global_state}/>
                        </Route>
                        <Route path="/">
                            <LoginScreen global_state={global_state}/>
                        </Route>
                    </Switch>
                    
                    <br/>
                    
                </Router>
            );
        } else
        {
            return (
                <React.Fragment>
                    <br/>
                    <br/>
                    <Container>
                        <Dimmer active inverted>
                            <Loader inverted>Загрузка</Loader>
                        </Dimmer>
                    </Container>
                </React.Fragment>
            );
        }
    }
}