import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import LoginForm from '../form/LoginForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import AuthApi from '../../src/Api/AuthApi';

const equal = require('deep-equal');

export default class CabinetScreen extends Component {

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

        return (
            <React.Fragment>
                <Container>
                    Cabinet
                </Container>
            </React.Fragment>
            );
    }
}