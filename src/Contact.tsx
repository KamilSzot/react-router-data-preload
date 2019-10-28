import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Show } from './DeferNavigation'

export default class Contact extends Component {
    render() {
        return <Route path="/contact">
            {(route) =>
                <Show match={route.match}>
                    <h1>Contact</h1>
                </Show>
            }
        </Route>;
    }
}
