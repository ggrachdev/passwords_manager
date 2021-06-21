import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AuthApi from '../../src/Api/AuthApi';

const equal = require('deep-equal');

export default class UsersScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            path: location.pathname,
            errors: []
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

    render() {

        const {path, errors} = this.state;

        const paragraph = "Paragraph";
        
        return (
            <React.Fragment>
                <Container>
                    <Item.Group divided>
                        <Item>
                            <Item.Content>
                                <Item.Header as='a'>Имя Фамилия Отчество</Item.Header>
                                <Item.Extra>
                                    <Label color='blue'>Администраторы</Label>
                                    <Label color='red'>Программисты</Label>
                                    <Label color='yellow'>Контент-менеджеры</Label>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Container>
            </React.Fragment>
            );
    }
}