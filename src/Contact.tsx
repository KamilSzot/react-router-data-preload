import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Show, Load } from './DeferNavigation'

export default class Contact extends Component {
    render() {
        return <Route path="/contact">
            {(route) =>
                <Load match={route.match}>
                    <h1>Contact</h1>
                </Load>
            }
        </Route>;
    }
}
