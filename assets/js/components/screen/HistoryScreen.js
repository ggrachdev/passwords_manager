import React, { Component } from 'react';
import { Container, Header, Menu, Grid, Table, Icon, Button, Label, Pagination } from 'semantic-ui-react';
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
        let pagination = '';
        let table = '';
        let tableRows = [];

        if (this.state.response !== null)
        {
            this.state.response.history.forEach((history) => {
                tableRows.push(
                    <Table.Row>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.id}} /></Table.Cell>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.desc}} /></Table.Cell>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.date}} /></Table.Cell>
                        <Table.Cell><div dangerouslySetInnerHTML={{__html: history.ip}} /></Table.Cell>
                        <Table.Cell><Icon link color='grey' name='eye' onClick={() => { alert(JSON.stringify(history.meta, undefined, 4)); }} /></Table.Cell>
                    </Table.Row>
                );
            });
            
            pagination = (
                 <Pagination size='mini' activePage={this.state.page} defaultActivePage={1} totalPages={this.state.response.count_pages} onPageChange={(event, data) => { 
                    this.setState({
                        page: data.activePage
                    });
                    this.loadDataForPage(data.activePage);
                    window.scrollTo(0, 0);
                }} />
            );
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
                            <Table.HeaderCell></Table.HeaderCell>
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