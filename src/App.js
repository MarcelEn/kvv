import React, { Component } from 'react';
import axios from 'axios';
import { FormControl, ListGroup, ListGroupItem, PageHeader, Table, Button } from 'react-bootstrap';
import trueImage from './true.png';
import falseImage from './false.png';

class App extends Component {
    constructor(props) {
        super(props);
        const id = localStorage.getItem("id");
        this.state = {
            searchedStops: [],
            stopData: null,
            searchError: false,
            stopError: false,
            stopSearch: "",
            remember: id ? true : false,
            id
        }

        this.searchByName = this.searchByName.bind(this);
        this.handleUseInput = this.handleUseInput.bind(this);
        this.toggleRemember = this.toggleRemember.bind(this);

        const fetch = () => {
            if (this.state.remember) {
                this.getStartsOfStopId(this.state.id);
            }
        }

        fetch();

        setInterval(fetch, 30000)
    }

    async searchByName(name) {
        try {
            this.setState({ searchError: false })
            let response = await axios.get(`searchByName/${name}`);
            this.setState({ searchedStops: response.data.stops, stopData: null })
        } catch (error) {
            this.setState({ searchError: true })
        }
    }

    async getStartsOfStopId(id) {
        if (this.state.remember) {
            localStorage.setItem("id", id);
        }
        try {
            this.setState({ stopError: false, id })
            let response = await axios.get(`getStartsOfStopId/${id}`);
            this.setState({ stopData: response.data, searchedStops: [] })
        } catch (error) {
            this.setState({ stopError: true })
        }
    }

    handleUseInput(proxy) {
        this.setState({ [proxy.target.name]: proxy.target.value })
        if (proxy.target.value.length > 0)
            this.searchByName(proxy.target.value)
    }

    toggleRemember() {
        if (this.state.remember) {
            localStorage.removeItem("id");
            this.setState({ remember: false, id: null })
        } else {
            this.setState({ remember: true })
        }
    }

    render() {
        return (
            <div>
                <ListGroup>
                    <ListGroupItem
                        bsStyle={this.state.remember ? "success" : "default"}
                        onClick={this.toggleRemember}
                    >
                        Haltestelle merken und aktualisieren
                    </ListGroupItem>
                </ListGroup>
                <FormControl
                    type="text"
                    value={this.state.stopSearch}
                    placeholder="Haltestelle eingeben"
                    onChange={this.handleUseInput}
                    name="stopSearch"
                />
                <ListGroup>
                    {
                        this.state.searchedStops.map(
                            (stop, i) =>
                                <ListGroupItem
                                    key={`searchItem-${i}`}
                                    onClick={() => this.getStartsOfStopId(stop.id)}
                                >
                                    {stop.name}
                                </ListGroupItem>
                        )
                    }
                </ListGroup>
                {
                    this.state.stopData ?
                        <div>

                            <PageHeader>
                                {this.state.stopData.stopName}
                            </PageHeader>
                            <h3>
                                {this.state.stopData.timestamp}
                            </h3>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Linie</th>
                                        <th>Ziel</th>
                                        <th>Zeit</th>
                                        <th>Richtung</th>
                                        <th>Echtzeit</th>
                                        <th>Flach</th>
                                        <th>Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.stopData.departures.map(
                                            (departure, i) =>
                                                <tr key={`departure-${i}`}>
                                                    <td>
                                                        {departure.route}
                                                    </td>
                                                    <td>
                                                        {departure.destination}
                                                    </td>
                                                    <td>
                                                        {departure.time}
                                                    </td>
                                                    <td>
                                                        {departure.direction}
                                                    </td>
                                                    <td>
                                                        <img alt="realtimeStatus" src={departure.realtime ? trueImage : falseImage} />
                                                    </td>
                                                    <td>
                                                        <img alt="realtimeStatus" src={departure.lowfloor ? trueImage : falseImage} />
                                                    </td>
                                                    <td>
                                                        {departure.stopPosition}
                                                    </td>
                                                </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                        :
                        ""
                }
            </div>
        );
    }
}

export default App;
