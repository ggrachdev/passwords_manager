import React, { Component } from 'react';
import { Container, Button,  Modal, Checkbox } from 'semantic-ui-react';
import PermissionsApi from '../../src/Api/PermissionsApi';
const equal = require('deep-equal');
import Toasts from '../../src/Toasts/Toasts';

export default class ModalChangePermission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            header: props.header,
            idType: props.idType,
            permissionEdit: props.permissionEdit,
            permissionNameEdit: props.permissionNameEdit,
            onClickClose: props.onClickClose,
            open: props.open,
            users: [],
        };
        
        this.onClickChangeItem = (e, user, type, idType) => {
            if (type === 'folder')
            {
                PermissionsApi.toggleForFolder(idType, user.id, this.state.permissionEdit).
                    then(() => {
                        this.initializeList();
                    }).
                    catch(() => {
                        Toasts.error('Не удалось изменить право, возможно пользователь является администратором');
                    }
                );

            } else if (type === 'project')
            {
                PermissionsApi.toggleForProject(idType, user.id, this.state.permissionEdit).
                    then(() => {
                        this.initializeList();
                    }).
                    catch(() => {
                        Toasts.error('Не удалось изменить право, возможно пользователь является администратором');
                    }
                );
            }
        };
        
        this.initializeList();
    }
    
    initializeList() {
        if(this.state.type === 'project')
        {
            PermissionsApi.getForProject(this.state.idType).then((response) => {
                this.setState({
                   users: response.getData()['users']
                });
            }).catch(() => {
                Toasts.error('Не удалось загрузить данные о правах для проекта');
            });
        }
        else if(this.state.type === 'folder')
        {
            PermissionsApi.getForFolder(this.state.idType).then((response) => {
                this.setState({
                   users: response.getData()['users']
                });
            }).catch(() => {
                Toasts.error('Не удалось загрузить данные о правах для папки');
            });
        }
    }

    componentDidUpdate(prevProps) {

        if (!equal(prevProps.open, this.props.open))
        {
            this.setState({
                open: this.props.open
            });
        }

        if (!equal(prevProps.idType, this.props.idType))
        {
            this.setState({
                idType: this.props.idType
            });
        }

        if (!equal(prevProps.type, this.props.type))
        {
            this.setState({
                type: this.props.type
            });
        }

        if (!equal(prevProps.header, this.props.header))
        {
            this.setState({
                header: this.props.header
            });
        }

        if (!equal(prevProps.permissionEdit, this.props.permissionEdit))
        {
            this.setState({
                permissionEdit: this.props.permissionEdit
            });
        }

        if (!equal(prevProps.permissionNameEdit, this.props.permissionNameEdit))
        {
            this.setState({
                permissionNameEdit: this.props.permissionNameEdit
            });
        }
    }
    
    renderCheckboxList() {
        const list = [];
        
        this.state.users.forEach((user) => {
            
            let hasPermission = user.permissions[this.state.permissionEdit] == true;
            
            if(this.state.permissionEdit === 'add_all_permissions')
            {
                let hasAllPermissions = true;
                
                for(var key in user.permissions)
                {
                    if(user.permissions[key] == false)
                    {
                        hasAllPermissions = false;
                        break;
                    }
                }
                
                hasPermission = hasAllPermissions;
            }
            
            if(this.state.permissionEdit === 'remove_all_permissions')
            {
                let hasNotAllPermissions = true;
                
                for(var key in user.permissions)
                {
                    if(user.permissions[key] == true)
                    {
                        hasNotAllPermissions = false;
                        break;
                    }
                }
                
                hasPermission = hasNotAllPermissions;
            }
            
            list.push(
                <div style={{marginBottom: '10px'}}>
                    <Checkbox 
                        checked={hasPermission} 
                        onClick={(e) => {
                            this.onClickChangeItem(e, user, this.state.type, this.state.idType);
                        }} 
                        name={`user_${user.id}`} 
                        value={user.id} 
                        label={`${user.second_name} ${user.first_name} ${user.middle_name}`} 
                    /> 
                </div>
            );
        });
        
        return list;
    }

    render() {
        return (
            <Modal 
                open={this.state.open} >
                <Modal.Header>{this.state.header}</Modal.Header>
                <Modal.Content>
                    {this.renderCheckboxList()}
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