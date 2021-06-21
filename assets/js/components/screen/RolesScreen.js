import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label, Modal, Form} from 'semantic-ui-react';
import UsersApi from '../../src/Api/UsersApi';
import AuthApi from '../../src/Api/AuthApi';
import RegistrationUserForm from '../form/RegistrationUserForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';

const equal = require('deep-equal');

export default class RolesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            errors: []
        };
    }

    render() {

        const {errors, users, modal_registration_is_open} = this.state;

        return (
            <Container>
                RolesScreen
            </Container>
            );
    }
}