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
                    {(match) => // keeps match if route no longer matches but you can't navigate away yet
                        <Query<{ user: { name: string }}> query={Q} variables={{ login: match.params.id }} children={(queryResult) =>
                            <Show match={match} response={queryResult}>
                                {(props) => // keeps all current props (match params, response) till all loading of new responses finished
                                    <h1>Offer {props.match.params.id}<br /> {console.log(props)}
                                    <i>{props.response?.data?.user?.name}</i> </h1>
                                }
                            </Show>
                            
                    } />
                    }
                </Load>
            }
        </Route>;
    }
}
