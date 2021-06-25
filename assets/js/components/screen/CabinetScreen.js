import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

const equal = require('deep-equal');

export default class CabinetScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
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

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Container>
                    Cabinet
                </Container>
            </React.Fragment>
        );
    }
}