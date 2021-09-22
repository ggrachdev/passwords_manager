import React, { Component } from 'react';

export default class ErrorApplication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, error: '', errorInfo: ''};
    }

    static getDerivedStateFromError(error) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error, errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Что-то пошло не так.</h1>
                    <div>
                        {this.state.error}
                    </div>
                    <div>
                        {this.state.errorInfo}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}