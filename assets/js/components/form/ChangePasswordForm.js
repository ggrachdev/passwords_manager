import React, { Component } from 'react';
import { Form, TextArea, Radio } from 'semantic-ui-react'
import PasswordsApi from '../../src/Api/PasswordsApi';

export default class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            errors: props.errors || [],
            idPassword: props.idPassword,
            selected_tags: [],
            passwordData: {
                name: '',
                password: '',
                description: '',
                login: '',
                tags: []
            }
        };
        
        PasswordsApi.get(this.state.idPassword).then((response) => {
            this.setState({
                passwordData: response.getData()['password'],
                selected_tags: response.getData()['password']['tags']
            });
        });

        this.changeTagsRadioHandler = (e, valueData) => {

            const value = valueData.value;

            let nowSelectedTags = [...this.state.selected_tags];

            let newSelectedTags = nowSelectedTags.includes(value) ? _.without(nowSelectedTags, value) : _.concat(nowSelectedTags, value);

            this.setState({
                selected_tags: newSelectedTags
            })
        };
        
        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {};
        this.onClickRemovePasswordButton = 'onClickRemovePasswordButton' in props ? props['onClickRemovePasswordButton'] : (e) => {};
    }

    render() {

        const {errors} = this.state;

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
                    
                    <Form.Input fluid 
                        label="Название пароля:" 
                        required="true" 
                        name="change_password_form[name]" 
                        type="text" 
                        defaultValue={this.state.passwordData.name} 
                        placeholder="Введите название пароля" />
                        
                    <Form.Input fluid 
                        label="Логин:" 
                        name="change_password_form[login]" 
                        type="text" 
                        defaultValue={this.state.passwordData.login} 
                        placeholder="Введите логин" />
                        
                    <Form.Input fluid 
                        label="Пароль:" 
                        name="change_password_form[password]" 
                        defaultValue={this.state.passwordData.password} 
                        type="text" 
                        placeholder="Введите пароль" />
                        
                    <Form.Field
                        control={TextArea}
                        label='Описание:' 
                        name="change_password_form[description]" 
                        defaultValue={this.state.passwordData.description} 
                        placeholder='Введите описание' 
                      />
                      
                    <Form.Field>
                        <Radio 
                            checked={this.state.selected_tags.includes("compromised")} 
                            onClick={this.changeTagsRadioHandler} 
                            label="Пароль скомпрометирован"
                            name={`change_password_form[tags][compromised]`}
                            value="compromised" 
                        />
                    </Form.Field>
                      
                    <Form.Field>
                        <Radio 
                            checked={this.state.selected_tags.includes("not_working")} 
                            onClick={this.changeTagsRadioHandler} 
                            label="Пароль не актуален"
                            name={`change_password_form[tags][not_working]`}
                            value="not_working" 
                        />
                    </Form.Field>
                     
                    <Form.Button positive>Изменить пароль</Form.Button> 
                    <Form.Button onClick={(e) => {e.preventDefault(); this.onClickRemovePasswordButton(e);}} negative>Удалить пароль</Form.Button>
                </Form>
            </React.Fragment>
        );
    }
}