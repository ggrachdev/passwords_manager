import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Table, Icon, Button, Label } from 'semantic-ui-react';
import HistoryApi from '../../src/Api/HistoryApi';
const equal = require('deep-equal');

export default class HistoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            page: 1,
            response: null
        };

        this.loadDataForPage(this.state.page);
    }

    loadDataForPage(page)
    {
        HistoryApi.getOnPage(page).then((response) => {
            this.setState({
                response: response.getData()
            });
        });
    }

    render() {

        let pagination = [];
        let table = '';
        let tableRows = [];

        if (this.state.response !== null)
        {
            for (let i = 1; i <= this.state.response.count_pages; i++) {
                let history = this.state.response.history[i];
                let color = this.state.page == i ? 'green' : 'primary';
                pagination.push(
                    <Button onClick={() => {
                        this.setState({
                            page: i
                        });
                        this.loadDataForPage(i);
                        window.scrollTo(0, 0);
                    }} color={color} icon>
                        {i}
                    </Button>
                );
            }
            
            this.state.response.history.forEach((history) => {
                tableRows.push(
                    <Table.Row>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.id}} /></Table.Cell>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.desc}} /></Table.Cell>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.date}} /></Table.Cell>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.ip}} /></Table.Cell>
                    </Table.Row>
                );
            });
        }
        
        
        if(tableRows.length > 0)
        {
            table = (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Описание действия</Table.HeaderCell>
                            <Table.HeaderCell>Дата</Table.HeaderCell>
                            <Table.HeaderCell>IP</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {tableRows}
                    </Table.Body>
                </Table>
            );
        }
            
        return (
            <React.Fragment>
                <Container>
                    <Header as='h1'>История действий:</Header>
                    <div>
                        <div>
                            <Button.Group>
                                {pagination}
                            </Button.Group>
                            <br/>
                            <br/>
                        </div>
                        <div>{table}</div>
                        <div>
                            <br/>
                            <Button.Group>
                                {pagination}
                            </Button.Group>
                        </div>
                    </div>
                </Container>
            </React.Fragment>
        );
    }
}