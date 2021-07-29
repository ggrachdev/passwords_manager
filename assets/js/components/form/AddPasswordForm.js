import React, { Component } from 'react';
import { Form, TextArea, Radio } from 'semantic-ui-react';
import PasswordGenerator from '../../src/PasswordGenerator/PasswordGenerator';

export default class AddPasswordForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected_tags: [],
            errors: props.errors || [],
        };

        this.changeTagsRadioHandler = (e, valueData) => {

            const value = valueData.value;

            let nowSelectedTags = [...this.state.selected_tags];

            let newSelectedTags = nowSelectedTags.includes(value) ? _.without(nowSelectedTags, value) : _.concat(nowSelectedTags, value);

            this.setState({
                selected_tags: newSelectedTags
            })
        };

        this.onSubmit = 'onSubmit' in props ? props['onSubmit'] : (e) => {
        };
    }

    render() {

        const {errors} = this.state;

        let defalutPassword = PasswordGenerator.generate({
            needNumerics: true,
            needUpperChars: true,
            needLowerChars: true,
            needSymbols: true,
            length: 25
        });

        return (
            <React.Fragment>
                <Form autoComplete="off" onSubmit={this.onSubmit}>
            
                    <Form.Input fluid 
                                label="Название пароля:" 
                                required="true" 
                                name="add_password_form[name]" 
                                type="text" 
                                placeholder="Введите название пароля" />
            
                    <Form.Input fluid 
                                label="Логин:" 
                                name="add_password_form[login]" 
                                type="text" 
                                placeholder="Введите логин" />
            
                    <Form.Input fluid 
                                label="Пароль:" 
                                name="add_password_form[password]" 
                                type="text" 
                                defaultValue={defalutPassword}
                                placeholder="Введите пароль" />
            
                    <Form.Field
                        control={TextArea}
                        label='Описание:' 
                        name="add_password_form[description]" 
                        placeholder='Введите описание' 
                        />
            
                    <Form.Field>
                        <Radio 
                            checked={this.state.selected_tags.includes("compromised")} 
                            onChange={this.changeTagsRadioHandler} 
                            label="Пароль скомпрометирован"
                            name={`add_password_form[tags][compromised]`}
                            value="compromised" 
                            />
                    </Form.Field>
            
                    <Form.Field>
                        <Radio 
                            checked={this.state.selected_tags.includes("not_working")} 
                            onChange={this.changeTagsRadioHandler} 
                            label="Пароль не актуален"
                            name={`add_password_form[tags][not_working]`}
                            value="not_working" 
                            />
                    </Form.Field>
            
                    <Form.Button positive>Добавить пароль</Form.Button>
                </Form>
            </React.Fragment>
            );
    }
}