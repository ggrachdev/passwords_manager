import React, { Component, useState } from 'react';
import { Container, Header, Menu, Grid, Table, Icon, Form } from 'semantic-ui-react';
import PasswordGenerator from '../../src/PasswordGenerator/PasswordGenerator';
import TextCopier from '../../src/TextCopier/TextCopier';
import PasswordBreakingTimeCounter from '../../src/PasswordBreakingTimeCounter/PasswordBreakingTimeCounter';
import Toasts from '../../src/Toasts/Toasts';


function PasswordGeneratorComponent() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(15);
    const [isLowerCase, setIsLowerCase] = useState(true);
    const [isUpperCase, setIsUpperCase] = useState(true);
    const [isNumbers, setIsNumbers] = useState(true);
    const [isSymbols, setIsSymbols] = useState(true);

    const generatePassword = () => {

        if (length == 0 || length < 0)
        {
            Toasts.error('Нужно указать длину больше нуля');
        } else if (length > 1000)
        {
            Toasts.error('Серьезно?');
        } else
        {
            const pwd = PasswordGenerator.generate(
                {
                    needNumerics: isNumbers,
                    needUpperChars: isUpperCase,
                    needLowerChars: isLowerCase,
                    needSymbols: isSymbols,
                    length: length
                }
            );

            setPassword(pwd);
        }
    };

    if(password === '')
    {
        generatePassword();
    }

    return (
        <React.Fragment>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input type="number" fluid label='Длина пароля' placeholder='Длина пароля' value={length} onChange={e => setLength(e.target.value)} />
                </Form.Group>
                <Form.Group inline>
                    <label>Правила генерации:</label>
                    <Form.Radio
                        label='Маленькие буквы'
                        value={true}
                        checked={isLowerCase}
                        onClick={() => setIsLowerCase(val => !val)}
                        />
                    <Form.Radio
                        label='Большие буквы'
                        value={true}
                        checked={isUpperCase}
                        onClick={() => setIsUpperCase(val => !val)}
                        />
                    <Form.Radio
                        label='Числа'
                        value={true}
                        checked={isNumbers}
                        onClick={() => setIsNumbers(val => !val)}
                        />
                    <Form.Radio
                        label='Символы'
                        value={true}
                        checked={isSymbols}
                        onClick={() => setIsSymbols(val => !val)}
                        />
                </Form.Group>
        
                <div>
                    <b>Сгенерированный пароль:</b><br/>
                    <Icon link color='grey' name='copy' onClick={() => {
                            TextCopier.copy(password);
                              }} /> {password} 
                    <br/>
                    <br/>
                    <b>Пароль подбирается за:</b><br/>
                    {PasswordBreakingTimeCounter.getTime(password)}
                </div>
        
                <br/>
        
                <Form.Button primary onClick={generatePassword}>Сгенерировать</Form.Button>
            </Form>
        </React.Fragment>
        );
}

export default class PasswordGeneratorScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>Генератор паролей:</Header>
                    <PasswordGeneratorComponent />
                </Container>
            </React.Fragment>
            );
    }
}