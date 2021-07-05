import React, { Component } from 'react';
import { Container, Button,  Modal } from 'semantic-ui-react';
import AddPasswordForm from '../form/AddPasswordForm';

const equal = require('deep-equal');

export default class ModalAddPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            folderId: props.folderId,
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

        if (!equal(prevProps.folderId, this.props.folderId))
        {
            this.setState({
                folderId: this.props.folderId
            });
        }
    }

    render() {

        const {errors, users, modal_registration_is_open} = this.state;

        return (
            <Modal 
                open={this.state.open} >
                <Modal.Header>Добавить пароль</Modal.Header>
                <Modal.Content>
                    <AddPasswordForm onSubmit={this.state.onSubmit} />
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