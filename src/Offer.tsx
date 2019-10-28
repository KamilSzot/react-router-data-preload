import React, { Component } from 'react'
import { match as RouterMatch } from 'react-router'
import { Route } from 'react-router-dom'
import { Show, Load } from './DeferNavigation'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const Q = gql`
    query($login:String!) {
        user(login: $login) {
            name
        } 
    }
`;

export default class Offer extends Component {
    render() {
        return <Route path="/offer/:id">
            {(route) =>
                <Load match={route.match}>
                    {(match) =>
                        <Query<{ user: { name: string }}> query={Q} variables={{ login: match.params.id }} children={(routeResponse) =>
                            <Show match={match} response={routeResponse}>
                                {(props) =>
                                    <h1>Offer {props.match.params.id}<br /> {props.response && props.response.data && props.response.data.user &&
                                    <i>{props.response.data.user.name}</i> || null}</h1>
                                }
                            </Show>
                        } />
                    }
                </Load>
            }
        </Route>;
    }
}
