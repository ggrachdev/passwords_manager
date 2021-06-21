import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label } from 'semantic-ui-react';
import UsersApi from '../../src/Api/UsersApi';

const equal = require('deep-equal');

export default class UsersScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            path: location.pathname,
            errors: [],
            users: []
        };

        UsersApi.getList().then((response) => {
            this.setState({
                users: response.getData()['users']
            });
        });
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.global_state, this.props.global_state))
        {
            this.setState({
                global_state: this.props.global_state
            });
        }
    }

    render() {

        const {path, errors, users} = this.state;

        let usersView = [];

        users.forEach((user) => {
            usersView.push(<Item>
                <Item.Content>
                    <Item.Header as='a'>{user.second_name} {user.first_name} {user.middle_name}</Item.Header>
                    <Item.Extra>
                        <Label color='blue'>Администраторы</Label>
                    </Item.Extra>
                </Item.Content>
            </Item>);
        });

        return (
            <React.Fragment>
                <Container>
                    <Item.Group divided>
                        {usersView}
                    </Item.Group>
                </Container>
            </React.Fragment>
            );
    }
}