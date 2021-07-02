import React, { Component } from 'react';
import { Container, Button,  Modal } from 'semantic-ui-react';
import AddProjectForm from '../form/AddProjectForm';

const equal = require('deep-equal');

export default class ModalAddProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onSubmit: props.onSubmit,
            onClickClose: props.onClickClose,
            open: props.open,
        };
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.open, this.props.open))
        {
            this.setState({
                open: this.props.open
            });
        }
    }

    render() {

        const {errors, users, modal_registration_is_open} = this.state;

        return (
            <Modal 
                open={this.state.open} >
                <Modal.Header>Добавить проект</Modal.Header>
                <Modal.Content>
                    <AddProjectForm onSubmit={this.state.onSubmit} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.state.onClickClose}>
                        Закрыть окно
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}