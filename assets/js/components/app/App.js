import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import { Menu } from 'semantic-ui-react';
import LoginScreen from '../screen/LoginScreen';
import CabinetScreen from '../screen/CabinetScreen';
import UsersScreen from '../screen/UsersScreen';
import RolesScreen from '../screen/RolesScreen';
import ProjectsScreen from '../screen/ProjectsScreen';
import HistoryScreen from '../screen/HistoryScreen';
import MainMenu from '../main-menu/main-menu';
import { Container, Loader, Dimmer } from 'semantic-ui-react';
import StateApi from '../../src/Api/StateApi';
import { ToastContainer } from 'react-toastify';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /**
             * Получены ли первичные данные для инициализации приложения
             */
            app_is_initialized: false,

            global_state: null

        };

        StateApi.get().then((data) => {
            this.setState({
                global_state: data,
                // Режим разработки
                app_in_development_mode: false,
                
                // id'ы пользователей для которых доступен режим разработки
                available_user_ids_for_development_mode: [4],
                app_is_initialized: true
            });
        });

    }

    render() {

        const {app_is_initialized, global_state, app_in_development_mode} = this.state;

        if (app_is_initialized)
        {

            if (
                app_in_development_mode && 
                this.state.global_state.user_is_auth == true &&
                !this.state.available_user_ids_for_development_mode.includes(this.state.global_state.user_id)
            )
            {
                setTimeout(() => {
                    location.reload();
                }, 30000);
                
                return (
                    <React.Fragment>
                        <br/>
                        <br/>
                        <Container>
                            <Dimmer active inverted>
                                <Loader inverted>Идут технические работы. Страница обновится автоматически</Loader>
                            </Dimmer>
                        </Container>
                    </React.Fragment>
                );
            } else
            {

                return (
                    <Router>
                        <MainMenu global_state={global_state}/>
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
                        <Route path="/projects/" exact>
                            <ProjectsScreen global_state={global_state}/>
                        </Route>
                        <Route path="/projects/project-:projectId/folder-:folderId/" render={( { match } ) => {
                            return (<ProjectsScreen folderId={match.params.folderId} projectId={match.params.projectId} global_state={global_state}/>);
                        }} />
                        <Route path="/history/">
                            <HistoryScreen global_state={global_state}/>
                        </Route>
                        <Route path="/" exact>
                            <LoginScreen global_state={global_state}/>
                        </Route>
                        </Switch>
                        <br/>
                        <ToastContainer />
                    </Router>
                );
            }
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