import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label, Modal, Form} from 'semantic-ui-react';
import RolesApi from '../../src/Api/RolesApi';
import RegistrationUserForm from '../form/RegistrationUserForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';

const equal = require('deep-equal');

export default class RolesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            errors: [],
            roles: []
        };
        this.initialize();
    }

    initialize() {
        RolesApi.getList().then((response) => {
            this.setState({
                roles: response.getData()['roles']
            });
        });
    }

    render() {

        const {errors, roles} = this.state;

        let rolesViews = [];

        roles.forEach((role) => {

            let label = (<Label size="large" color={role.color}>{role.name}</Label>);
            rolesViews.push(
                <Item>
                    <Item.Content>
                        <Item.Header>{label}</Item.Header>
                
                        <Item.Description>
                
                            <Button onClick={() => {
                                    this.setState({
                                        user_id_for_update: role.key,
                                        modal_edit_user_is_open: true
                                    });
                                        }} basic color='blue' size='mini'>
                                <Icon name='edit' />
                                Изменить    
                            </Button>                        
                
                            <Button onClick={() => {
                                    this.setState({
                                        modal_delete_user_is_open: true
                                    });
                                        }} basic color='red' size='mini'>
                                <Icon name='remove' />
                                Удалить
                            </Button>
                
                        </Item.Description>
                    </Item.Content>
                </Item>
                );
        });

        return (
            <Container>
                <Item.Group divided>
                    {rolesViews}
                </Item.Group>
            </Container>
            );
    }
}