import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AuthApi from '../../src/Api/AuthApi';

export default class CabinetScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: location.pathname,
            errors: []
        };
    }

    render() {

        const {path, errors} = this.state;

        return (
            <React.Fragment>
                <Container text>
                    Cabinet
                </Container>
            </React.Fragment>
            );
    }
}