import React, { Component } from 'react';
import { Container, Button,  Modal } from 'semantic-ui-react';
import ChangePasswordForm from '../form/ChangePasswordForm';

const equal = require('deep-equal');

export default class ModalChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            idPassword: props.idPassword,
            onSubmit: props.onSubmit,
            canRemovePasswordInActiveFolder: props.canRemovePasswordInActiveFolder,
            onClickRemovePasswordButton: props.onClickRemovePasswordButton,
            onClickClose: props.onClickClose,
            open: props.open,
        };
    }

    componentDidUpdate(prevProps) {

        if (
            !equal(prevProps.open, this.props.open) ||
            !equal(prevProps.canRemovePasswordInActiveFolder, this.props.canRemovePasswordInActiveFolder)
        )
        {
            this.setState({
                open: this.props.open,
                canRemovePasswordInActiveFolder: this.props.canRemovePasswordInActiveFolder
            });
        }

        if (!equal(prevProps.idPassword, this.props.idPassword))
        {
            this.setState({
                idPassword: this.props.idPassword
            });
        }
    }

    render() {

        return (
            <Modal 
                open={this.state.open} >
                <Modal.Header>Изменить пароль</Modal.Header>
                <Modal.Content>
                    <ChangePasswordForm canRemovePasswordInActiveFolder={this.state.canRemovePasswordInActiveFolder} onClickRemovePasswordButton={this.state.onClickRemovePasswordButton} idPassword={this.state.idPassword} onSubmit={this.state.onSubmit} />
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