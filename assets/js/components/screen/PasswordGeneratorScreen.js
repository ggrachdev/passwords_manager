import React, { Component, useState } from 'react';
import { Container, Header, Menu, Grid, Table, Icon } from 'semantic-ui-react';

function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(10);
    const [isLowerCase, setIsLowerCase] = useState(true);
    const [isUpperCase, setIsUpperCase] = useState(false);
    const [isNumbers, setIsNumbers] = useState(false);
    const [isSymbols, setIsSymbols] = useState(false);

    const generatePassword = () => {

        const pwd = 12345;
        
        setPassword(pwd);
    }

    return (
        <div>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <label>
                            <span className="lbl-len">Длина:</span>
                            <input
                                type="number"
                                className="input-len form-control"
                                value={length}
                                onChange={e => setLength(e.target.value)}
                                />
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label className="form-control">
                            <input
                                type="checkbox"
                                className="mr-1"
                                checked={isLowerCase}
                                onChange={() => setIsLowerCase(val => !val)}
                                />
                            <span>Буквы нижнего регистра</span>
                        </label>
                    </div>
                    <div class="col">
                        <label className="form-control">
                            <input
                                type="checkbox"
                                className="mr-1"
                                checked={isUpperCase}
                                onChange={() => setIsUpperCase(val => !val)}
                                />
                            <span>Буквы верхнего регистра</span>
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label className="form-control">
                            <input
                                type="checkbox"
                                className="mr-1"
                                checked={isNumbers}
                                onChange={() => setIsNumbers(val => !val)}
                                />
                            <span>Использовать числа</span>
                        </label>
                    </div>
                    <div class="col">
                        <label className="form-control">
                            <input
                                type="checkbox"
                                className="mr-1"
                                checked={isSymbols}
                                onChange={() => setIsSymbols(val => !val)}
                                />
                            <span>Использовать специальные символы</span>
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input
                            type="button"
                            className="btn btn-dark mt-2 mb-3"
                            value="Generate Password"
                            onClick={generatePassword} />
                        <div>
                            Сгенерированный пароль: {password}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}

export default class PasswordGeneratorScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>Генерация паролей:</Header>
                    <PasswordGenerator />
                </Container>
            </React.Fragment>
            );
    }
}