
import React, { Component } from 'react'
import { ApolloLink, Observable, Operation, NextLink } from 'apollo-link';
import { Route } from 'react-router-dom';
import { FetchResult } from 'react-apollo';
import { DeferNavigation } from './DeferNavigation';



export class LoadingLink extends ApolloLink {
    running: number;
    constructor() {
        super();
        this.running = 0;
    }
    onLoadingChanged = (nowLoading:boolean) => {}

    request(operation: Operation, forward?: NextLink):null|Observable<FetchResult> {
        if(forward === undefined) return null;

        this.onLoadingChanged(!!++this.running);

        const subscriber = forward(operation);
        return new Observable(observer => {
            subscriber.subscribe({
                next: (result:FetchResult) => observer.next(result),
                error: error => observer.error(error),
                complete: () => observer.complete(),
            });
            return () => {
                setTimeout(() => this.onLoadingChanged(!!--this.running),
                    1500);
            };
        });
    }
}

export class Site extends Component<{showOnInitialNavigation: boolean, loadingLink: LoadingLink }> {
    static defaultProps = {
        showOnInitialNavigation: true
    }
    render() {
        return <Route 
            path="/" 
            children={(props) => 
                <DeferNavigation 
                    showOnInitialNavigation={this.props.showOnInitialNavigation} 
                    loadingLink={this.props.loadingLink} 
                   location={props.location}
                   children={(dnProps) => this.props.children} />} 
        />
            
    }
}


