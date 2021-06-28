import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Table, Icon } from 'semantic-ui-react';

const equal = require('deep-equal');

export default class HistoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: []
        };
    }

    render() {

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>История действий:</Header>
                </Container>
            </React.Fragment>
        );
    }
}