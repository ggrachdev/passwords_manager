import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label, Modal, Form} from 'semantic-ui-react';
import UsersApi from '../../src/Api/UsersApi';
import AuthApi from '../../src/Api/AuthApi';
import RegistrationUserForm from '../form/RegistrationUserForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';

const equal = require('deep-equal');

export default class UsersScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            errors: [],
            users: [],
            modal_registration_is_open: false
        };

        this.onSubmitRegistrationForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            if(dataForm['registration_user_form[password]'] === dataForm['registration_user_form[re_password]'])
            {
                AuthApi.registration(dataForm).then((data) => {
                    location.reload();
                }).catch((response) => {
                    alert(response);
                });
            }
            else
            {
                alert('Пароли не совпадают');
            }
        };
        this.openModalAddUser = () => this.setState({modal_registration_is_open: true});
        this.closeModalAddUser = () => this.setState({modal_registration_is_open: false});

        UsersApi.getList().then((response) => {
            this.setState({
                users: response.getData()['users']
            });
        });
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

        const {errors, users, modal_registration_is_open} = this.state;

        let usersView = [];

        users.forEach((user) => {
            
            let labels = [];
            
            user.roles.forEach((roleData) => {
                labels.push(<Label color={roleData.color}>{roleData.name}</Label>);
            });
            
            usersView.push(<Item>
                <Item.Content>
                    <Item.Header as='a'>{user.second_name} {user.first_name} {user.middle_name}</Item.Header>
                    <Item.Extra>
                        {labels}
                    </Item.Extra>
                </Item.Content>
            </Item>);
        });

        return (
            <Container>
                <Item.Group divided>
                    {usersView}
                </Item.Group>
            
                <Modal 
                    open={modal_registration_is_open} 
                    trigger={
                        <Button onClick={this.openModalAddUser}>Добавить пользователя</Button>
                    }
                    >
            
                    <Modal.Header>Добавить пользователя</Modal.Header>
                    <Modal.Content>
                        <RegistrationUserForm onSubmit={this.onSubmitRegistrationForm} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeModalAddUser}>
                            Закрыть окно
                        </Button>
                    </Modal.Actions>
                </Modal>
            
            </Container>
            );
    }
}