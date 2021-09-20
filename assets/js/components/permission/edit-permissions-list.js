import React, { Component } from 'react';
import { Form, Radio, Header, List, Popup, Icon } from 'semantic-ui-react';
import ModalChangePermission from '../modal/modal-change-permission';
import PermissionsApi from '../../src/Api/PermissionsApi';
import Toasts from '../../src/Toasts/Toasts';

const equal = require('deep-equal');

export default class EditPermissionsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            idType: props.idType,
            permissionsList: props.permissionsList,
            permissionEdit: null,
            permissionNameEdit: null,
            typeName: props.typeName, 
            modal_edit_is_open: false
        };

        this.onClickEditPermission = (permission, name) => {
            this.setState({
                permissionEdit: permission,
                modal_edit_is_open: true,
                permissionNameEdit: name
            });
        };

        this.onClickClose = () => {
            this.setState({
                modal_edit_is_open: false
            });
        };
    }

    componentDidUpdate(prevProps) {
        if (!equal(prevProps.permissionsList, this.props.permissionsList))
        {
            this.setState({
                permissionsList: this.props.permissionsList
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

        if (!equal(prevProps.typeName, this.props.typeName))
        {
            this.setState({
                typeName: this.props.typeName
            });
        }
    }

    renderPermissionsList() {
        let list = [];

        for (let permissionKey in this.state.permissionsList) {
            let permission = this.state.permissionsList[permissionKey];
            let desc = 'desc' in permission ? ( <Popup content={permission.desc} trigger={(<Icon name='question circle' />) } /> ) : '';
            list.push((
                <List.Item className="link_edit-permission-list" 
                    onClick={() => {
                        this.onClickEditPermission(permissionKey, permission.name);
                    }}>
                    <List.Icon name='edit' />
                    <List.Content>
                        <List.Header>
                            {permission.name} {desc}
                        </List.Header>
                    </List.Content>
                </List.Item>
            ));
        }

        return list;
    }

    render() {
        return (
            <React.Fragment>
                <Header as='h4'>
                    Редактирование доступов {this.state.type == 'folder' ? 'папки' : 'проекта'}:
                </Header>
                <List>
                    {this.renderPermissionsList()}
                </List>
                <ModalChangePermission 
                    randomStringForUpdate={this.state.randomStringForUpdate} 
                    idType={this.state.idType} 
                    permissionEdit={this.state.permissionEdit} 
                    permissionNameEdit={this.state.permissionNameEdit} 
                    type={this.state.type} 
                    header={(this.state.typeName) + ' / ' + this.state.permissionNameEdit} 
                    onClickClose={this.onClickClose} 
                    open={this.state.modal_edit_is_open}
                />
            </React.Fragment>
        );
    }
}