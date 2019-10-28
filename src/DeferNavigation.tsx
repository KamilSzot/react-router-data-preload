import React, { Component } from 'react'
import { match as RouterMatch } from 'react-router'
import { NavLink } from 'react-router-dom'
import { Location } from 'history'

import { ShowIn } from './ShowIn'
import { LoadIn } from './LoadIn'
import { QueryResult } from 'react-apollo';

import { LoadingLink } from './Page';

export type DeferContextType = {canNavigate: boolean, loading: boolean };
const DeferContext = React.createContext<DeferContextType|null>(null);

class Consumer extends Component<{ children: (context:DeferContextType) => JSX.Element | null }> {
    render() {
        return <DeferContext.Consumer>{(context) => {
            if(context == null) {
                throw Error('Consumer used outside of provider');
            } else {
                return this.props.children(context);
            }
        }}</DeferContext.Consumer>;
    }
}


export class Url extends Component<{ to: string, exact?:boolean }> {
    render() {
      return <Consumer>{(context) => <span><NavLink replace={context.loading} activeClassName="active" {...this.props}></NavLink> {context.loading?"1":"0"}</span>}</Consumer>;
    }
}
  
export class Loading extends Component {
    render() {
        return <Consumer>{(context) => context.loading ? <div id="loading" /> : null}</Consumer>;
    }
}

type Props = { children: (dnProps: {}) => React.ReactNode, showOnInitialNavigation: boolean, loadingLink: LoadingLink, location: Location };
type State = { canNavigate: boolean, loading: boolean, pathname?: string };

export class DeferNavigation extends Component<Props, State> {
    state = { canNavigate: true, loading: false }
    constructor(props:Props) {
        super(props);        
        props.loadingLink.onLoadingChanged = (nowLoading) => this.setState({ loading: nowLoading });
    }
    static getDerivedStateFromProps(props:Props, state:State) {
        if (props.location.pathname != state.pathname) {
            return {
                pathname: props.location.pathname,
                canNavigate: !props.showOnInitialNavigation ? false : !state.pathname // if there is no state.pathname then page just loaded, always allow initial navigation
            }
        }
        return null;
    }
    componentDidUpdate(prevProps:Props, prevState:State) {
        if (!this.state.canNavigate) {
            this.setState({ canNavigate: true });
        }
    }
    render() {
        return <DeferContext.Provider value={this.state}>{this.props.children({ ...this.state })}</DeferContext.Provider>;
    }
}

type ShowProps<ResponseType> = {
    match:null|RouterMatch, 
    response?: ResponseType, 
    children: (({ match, response }: { match: RouterMatch<{ id: string }>, response?:ResponseType}) => React.ReactNode ) | React.ReactNode
};

export class Show<ResponseType extends QueryResult> extends Component<ShowProps<ResponseType>> {
    render() { 
         return <Consumer>{(context) => <ShowIn {...this.props} context={context} />}</Consumer>; 
    }
}
export const Load = (props: {match:null|RouterMatch, children:(match:RouterMatch<{ id: string }>) => React.ReactNode }) => <Consumer>{(context) => <LoadIn {...props} context={context} />}</Consumer>;


