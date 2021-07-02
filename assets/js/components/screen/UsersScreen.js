import React, { Component } from 'react';
import { Container, Button, Icon, Item, Label, Modal, Form, Header} from 'semantic-ui-react';
import UsersApi from '../../src/Api/UsersApi';
import AuthApi from '../../src/Api/AuthApi';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import RegistrationUserForm from '../form/RegistrationUserForm';
import ChangeUserForm from '../form/ChangeUserForm';
import Toasts from '../../src/Toasts/Toasts';

const equal = require('deep-equal');

export default class UsersScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            errors: [],
            users: [],
            user_id_for_update: null,
            user_id_for_delete: null,
            user_name_for_delete: null,
            modal_delete_user_is_open: false,
            modal_edit_user_is_open: false,
            modal_registration_is_open: false
        };

        this.onSubmitUserChangeForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            if (dataForm['change_user_form[password]'] === dataForm['change_user_form[re_password]'])
            {
                UsersApi.set(this.state.user_id_for_update, dataForm).then((response) => {
                    this.setState({
                        modal_edit_user_is_open: false
                    });
                    
                    Toasts.success(`Данные пользователя успешно изменены`);
                    
                    this.initialize();
                }).catch(() => {
                    
                    Toasts.error("При изменении данных что-то пошло не так");
                
                    location.reload();
                });
            } else
            {
                Toasts.error("Пароли не совпадают");
            }
        };

        this.onSubmitRegistrationForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();
            if (dataForm['registration_user_form[password]'] === dataForm['registration_user_form[re_password]'])
            {
                AuthApi.registration(dataForm).then((data) => {
                    this.setState({
                        modal_registration_is_open: false
                    });
                    
                    Toasts.success("Пользователь успешно зарегистрирован");
                    
                    this.initialize();
                }).catch((e) => {
                    Toasts.error("Не удалось зарегистрировать пользователя");
                });
            } else
            {
                Toasts.error("Пароли не совпадают");
            }
        };

        this.openModalChangeUser = () => this.setState({modal_edit_user_is_open: true});
        this.closeModalChangeUser = () => this.setState({modal_edit_user_is_open: false});

        this.openModalAddUser = () => this.setState({modal_registration_is_open: true});
        this.closeModalAddUser = () => this.setState({modal_registration_is_open: false});

        this.initialize();
    }
    
    initialize() {
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

        const {errors, users, user_id_for_update, modal_registration_is_open, modal_delete_user_is_open, modal_edit_user_is_open, user_name_for_delete} = this.state;

        const usersView = [];

        users.forEach((user) => {

            const labels = [];

            user.roles_full.forEach((roleData) => {
                labels.push(<Label color={roleData.color} style={{ backgroundColor: roleData.color, color: '#ffffff' }}>{roleData.name}</Label>);
            });

            usersView.push(
                <Item>
                    <Item.Content>
                        <Item.Header>{user.second_name} {user.first_name} {user.middle_name}</Item.Header>
                
                        <Item.Meta>
                            {user.email}
                        </Item.Meta>
                
                        <Item.Description>
                
                            <Button 
                                onClick={() => {
                                    this.setState({
                                    user_id_for_update: user.id,
                                        modal_edit_user_is_open: true
                                    });
                                }} 
                                basic color='blue' size='mini'>
                                <Icon name='edit' />
                                Изменить                            
                            </Button> 
                
                            <Button basic color='violet' size='mini'>
                                <Icon name='shield alternate' />
                                Скомпрометировать пароли
                            </Button>
                
                            <Button 
                                onClick={() => {
                                this.setState({
                                    user_name_for_delete: `${user.second_name} ${user.first_name} ${user.middle_name}`,
                                        user_id_for_delete: user.id,
                                        modal_delete_user_is_open: true
                                    });
                                }} 
                                basic color='red' size='mini'>
                                <Icon name='remove' />
                                Удалить
                            </Button>
                
                        </Item.Description>
                
                        <Item.Extra>
                            {labels}
                        </Item.Extra>
                    </Item.Content>
                </Item>
            );
        });

        return (
            <Container>
                <Header as='h1'>Пользователи:</Header>
                
                <Item.Group divided>
                    {usersView}
                </Item.Group>
            
                <Modal 
                    open={modal_registration_is_open} 
                    trigger={
                        <Button positive onClick={this.openModalAddUser}>Добавить пользователя</Button>
                    }>
            
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
            
                <Modal 
                    open={modal_edit_user_is_open} >
                    <Modal.Header>Изменить данные пользователя</Modal.Header>
                    <Modal.Content>
                        <ChangeUserForm user_id={user_id_for_update} onSubmit={this.onSubmitUserChangeForm} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeModalChangeUser}>
                            Закрыть окно
                        </Button>
                    </Modal.Actions>
                </Modal>
            
                <Modal
                    open={modal_delete_user_is_open} 
                    header={`Вы действительно хотите удалить пользователя ${user_name_for_delete}?`}
                    actions={
                        [
                            {
                                key: 'no',
                                content: 'Нет',
                                positive: false,
                                onClick: () => {
                                    this.setState({
                                        modal_delete_user_is_open: false
                                    })
                                }
                            },
                            {
                                key: 'done',
                                content: 'Да',
                                positive: true,
                                onClick: () => {
                                    UsersApi.remove(this.state.user_id_for_delete).then(() => {
                                        this.setState({
                                            modal_delete_user_is_open: false
                                        });
                                        
                                        Toasts.success(`Пользователь ${user_name_for_delete} успешно удален`);
                    
                                        this.initialize();
                                    }).catch(() => {
                                        
                                        Toasts.success(`Не удалось удалить пользователя - ${user_name_for_delete}`);
                                        
                                    });
                                }
                            }
                        ]
                    }
                    />
            
            </Container>
        );
    }
}