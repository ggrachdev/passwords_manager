import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import ChangeUserForm from '../form/ChangeUserForm';
import UsersApi from '../../src/Api/UsersApi';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import Toastify from 'toastify-js';

const equal = require('deep-equal');

export default class CabinetScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            errors: []
        };
        
        this.onSubmitUserChangeForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            if (dataForm['change_user_form[password]'] === dataForm['change_user_form[re_password]'])
            {
                UsersApi.set(this.state.global_state.user_id, dataForm).then((response) => {
                    this.setState({
                        modal_edit_user_is_open: false
                    });
                    
                    Toastify({
                        text: `Данные пользователя успешно изменены`,
                        backgroundColor: "green",
                        duration: 3000
                    }).showToast();
                    
                    this.initialize();
                }).catch(() => {
                    
                    Toastify({
                        text: "При изменении данных что-то пошло не так",
                        backgroundColor: "darkred",
                        duration: 3000
                    }).showToast();
                
                    location.reload();
                });
            } else
            {
                Toastify({
                    text: "Пароли не совпадают",
                    backgroundColor: "darkred",
                    duration: 3000
                }).showToast();
            }
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

        const {errors, global_state} = this.state;

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>Ваши данные:</Header>
                    <ChangeUserForm withoutRoles user_id={global_state.user_id} onSubmit={this.onSubmitUserChangeForm} />
                </Container>
            </React.Fragment>
        );
    }
}