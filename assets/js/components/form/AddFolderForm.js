import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

export default class AddFolderForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    <Form.Input fluid 
                        label="Название папки:" 
                        required="true" 
                        name="add_folder_form[name]" 
                        type="text" 
                        placeholder="Введите название папки" />
                    <Form.Button>Добавить папку</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}