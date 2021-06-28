import React, { Component } from 'react';
import { Container, Button, Icon, Image, Item, Label, Modal, Form} from 'semantic-ui-react';
import RolesApi from '../../src/Api/RolesApi';
import RegistrationUserForm from '../form/RegistrationUserForm';
import AddRoleForm from '../form/AddRoleForm';
import ChangeRoleForm from '../form/ChangeRoleForm';
import FormSerializer from '../../src/FormSerializer/FormSerializer';
import Toastify from 'toastify-js';

const equal = require('deep-equal');

export default class RolesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            global_state: props.global_state,
            errors: [],
            roles: [],
            
            modal_add_role_is_open: false,
            modal_update_role_is_open: false,
            modal_delete_role_is_open: false,
            
            role_name_for_update: null,
            role_key_for_update: null,
            
            role_name_for_delete: null,
            role_key_for_delete: null
        };

        this.onChangeRoleForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();

            RolesApi.update(dataForm, this.state.role_key_for_update).then((response) => {
                this.setState({
                    modal_add_role_is_open: false
                });
                
                Toastify({
                    text: "Роль успешно изменена",
                    backgroundColor: "green",
                    duration: 3000
                }).showToast();
                
                this.initialize();
            }).catch(() => {
                Toastify({
                    text: "Не удалось изменить роль",
                    backgroundColor: "darkred",
                    duration: 3000
                }).showToast();
            });
        };

        this.onAddRoleForm = (e) => {
            const dataForm = (new FormSerializer(e.target)).getObject();

            RolesApi.add(dataForm).then((response) => {
                this.setState({
                    modal_add_role_is_open: false
                });
                
                Toastify({
                    text: "Роль успешно добавлена",
                    backgroundColor: "green",
                    duration: 3000
                }).showToast();
                
                this.initialize();
            }).catch(() => {
                Toastify({
                    text: "Не удалось добавить роль",
                    backgroundColor: "darkred",
                    duration: 3000
                }).showToast();
            });
        };

        this.initialize();
    }

    initialize() {
        RolesApi.getList().then((response) => {
            this.setState({
                roles: response.getData()['roles']
            });
        });
    }

    render() {

        const {errors, roles, modal_add_role_is_open, modal_delete_role_is_open, modal_update_role_is_open, role_name_for_delete, role_name_for_update} = this.state;

        const RolesList = [];

        roles.forEach((role) => {

            const label = (<Label size="large" color={role.color} style={{ backgroundColor: role.color, color: '#ffffff' }}>{role.name}</Label>);

            const buttons = [];

            if (!['ROLE_ADMIN', 'ROLE_USER'].includes(role.key))
            {
                buttons.push(
                    <Button onClick={() => {
                        this.setState({
                            role_name_for_update: role.name,
                            role_key_for_update: role.key,
                            modal_update_role_is_open: true
                        });
                    }} basic color='blue' size='mini'>
                        <Icon name='edit' />
                        Изменить    
                    </Button>
                );

                buttons.push(
                    <Button onClick={() => {
                        this.setState({
                            role_name_for_delete: role.name,
                            role_key_for_delete: role.key,
                            modal_delete_role_is_open: true
                        });
                    }} basic color='red' size='mini'>
                        <Icon name='remove' />
                        Удалить
                    </Button>
                );
            }

            RolesList.push(
                <Item>
                    <Item.Content>
                        <Item.Header>{label}</Item.Header>
                        <Item.Description>
                            {buttons}
                        </Item.Description>
                    </Item.Content>
                </Item>
            );
        });
        
        const ModalChangeRole = (
            <Modal 
                open={modal_update_role_is_open}>
                <Modal.Header>Изменить роль</Modal.Header>
                <Modal.Content>
                    <ChangeRoleForm keyRoleForChange={this.state.role_key_for_update} onSubmit={this.onChangeRoleForm} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => {
                        this.setState({
                            modal_update_role_is_open: false
                        })
                    }}>
                    Закрыть окно
                    </Button>
                </Modal.Actions>
            </Modal>
        );
        
        const ModalAddRole = (
            <Modal 
                open={modal_add_role_is_open} 
                trigger={
                    <Button onClick={() => {
                        this.setState({
                            modal_add_role_is_open: true
                        })
                    }}>
                        Добавить роль
                    </Button>
                }>

                <Modal.Header>Добавить роль</Modal.Header>
                <Modal.Content>
                    <AddRoleForm onSubmit={this.onAddRoleForm} />
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => {
                        this.setState({
                            modal_add_role_is_open: false
                        })
                    }}>
                    Закрыть окно
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    
        const ModalRemoveRole = (
            <Modal
                open={modal_delete_role_is_open} 
                header={`Вы действительно хотите удалить роль - ${role_name_for_delete}?`}
                actions={
                    [
                        {
                            key: 'no',
                            content: 'Нет',
                            positive: false,
                            onClick: () => {
                                this.setState({
                                    modal_delete_role_is_open: false
                                });
                            }
                        },
                        {
                            key: 'done',
                            content: 'Да',
                            positive: true,
                            onClick: () => {
                                RolesApi.remove(this.state.role_key_for_delete).then(() => {
                                    Toastify({
                                        text: `Роль ${role_name_for_delete} успешно удалена`,
                                        backgroundColor: "green",
                                        duration: 3000
                                    }).showToast();

                                    this.setState({
                                        modal_delete_role_is_open: false
                                    });
                                    this.initialize();
                                });
                            }
                        }
                    ]
                }
                />
        );

        return (
            <Container>
                <Item.Group divided>
                    {RolesList}
                </Item.Group>
            
                {ModalChangeRole}
                {ModalAddRole}
                {ModalRemoveRole}
            </Container>
        );
    }
}