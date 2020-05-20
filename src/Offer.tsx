import React, { Component } from 'react'
import { Route, RouteChildrenProps } from 'react-router-dom'
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
            {(route:RouteChildrenProps<{ id?: string }>) =>
                <Load match={route.match}>
                    {(match) => // keeps match if route no longer matches but you can't navigate away yet
                        <Query<{ user: { name: string }}> query={Q} variables={{ login: match.params.id }} children={(queryResult) =>
                            <Show match={match} result={queryResult}>
                                {({match, result}) => // keeps current match and result till all loading of new results finished
                                    <h1>Offer {match?.params.id}<br /> 
                                    :<i>{result?.data?.user?.name}</i>:</h1>
                                }
                            </Show>
                        } />
                    }
                </Load>
            }
        </Route>;
    }
}
