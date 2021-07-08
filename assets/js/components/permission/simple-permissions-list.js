import React, { Component } from 'react';
import { Form, Radio, Header } from 'semantic-ui-react';

const equal = require('deep-equal');

export default class SimplePermissionsList extends Component {
        
    constructor(props) {
        super(props);
        this.state = {
            permissionsList: props.permissionsList
        };
        
        this.changeRadioHandler = (e, valueData) => {

            const value = valueData.value;

            let newPermissionsList = {...this.state.permissionsList};

            newPermissionsList[value]['selected'] = !this.state.permissionsList[value]['selected'];

            this.setState({
                permissionsList: newPermissionsList
            })
        };
    }

    componentDidUpdate(prevProps) {

        if (
            !equal(prevProps.permissionsList, this.props.permissionsList)
        )
        {
            this.setState({
                permissionsList: this.props.permissionsList
            });
        }
    }
    
    renderPermissionsList() {
        let list = [];
        
        for (var permissionKey in this.state.permissionsList) {
            const permission = this.state.permissionsList[permissionKey];
            list.push((
                <Form.Field>
                    <Radio 
                        label={permission.name} 
                        name={`permissions[${permissionKey}]`}
                        checked={permission.selected} 
                        onClick={this.changeRadioHandler} 
                        value={permissionKey} 
                    />
                </Form.Field>
            ));
        }
        
        return list;
    }
    
    render() {
        
        return (
            <React.Fragment>
                <Header as='h4'>Права роли:</Header>
                {this.renderPermissionsList()}
            </React.Fragment>
        );
    }
}