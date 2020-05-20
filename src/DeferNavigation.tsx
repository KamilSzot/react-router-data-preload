import React, { useContext, useState, PropsWithChildren, useEffect, ReactElement } from 'react'
import { match as RouterMatch } from 'react-router'
import { NavLink } from 'react-router-dom'
import { Location } from 'history'


import { QueryResult } from 'react-apollo';

import { LoadingLink } from './Page';
import { stat } from 'fs'

export type DeferContextType = {canNavigate: boolean, loading: boolean };
const DeferContext = React.createContext<DeferContextType>({ canNavigate: true, loading: false });

export function Url(props: PropsWithChildren<{to: string, exact?:boolean}>) {
    const context = useContext(DeferContext);
    const {to, exact, children} = props;
    return <span>- <NavLink replace={context.loading} activeClassName="active" to={to} exact={exact}>{children}</NavLink> {context.loading?"1":"0"} - </span>;
}

export function Loading() {
    const context = useContext(DeferContext);
    return context.loading ? <div id="loading" /> : null;
}


export function DeferNavigation(props:PropsWithChildren<{ showOnInitialNavigation: boolean, loadingLink: LoadingLink, location: Location }>) {
    var [loading, setLoading] = useState(false);
    var [canNavigate, setCanNavigate] = useState(true);
    var [pathname, setPathname] = useState<string>();

    props.loadingLink.onLoadingChanged = setLoading;

    var [pathChangedCondition, setPathChangedCondition] = useState<boolean>();
    var pc = props.location.pathname != pathname; // navigation occured
    if(pathChangedCondition != pc) {  // condition changed
        setPathChangedCondition(pc);
        if (pc) {  // to true
            setPathname(props.location.pathname);
            setCanNavigate(!props.showOnInitialNavigation ? false : !pathname); // if there is no state.pathname then page just loaded, always allow initial navigation
            setLoading(false) // behave as if everything loaded
        }
    }

    useEffect(() => {
        if (!canNavigate) {
            setCanNavigate(true);
        }
    });

    return <DeferContext.Provider value={{ loading, canNavigate }}>{props.children}</DeferContext.Provider>;
}
type ShowState<RouterMatchType extends RouterMatch, ResultType extends QueryResult> = { match: null|RouterMatchType, result?: ResultType };
export function Show<RouterMatchType extends RouterMatch, ResultType extends QueryResult>(props:ShowState<RouterMatchType, ResultType> & { children: ((props:ShowState<RouterMatchType, ResultType>) => ReactElement) | ReactElement }) {
    const context = useContext(DeferContext);    
    var [ state, setState ] = useState<ShowState<RouterMatchType, ResultType>>({ match: null });

    var nl = context.canNavigate && !context.loading;
    var [ notLoading, setNotLoading ] = useState<boolean>();
    if(notLoading != nl) { // if condition changed
        if (nl) { // to true
            setState({ match: props.match, result: props.result }); // keep props in state
        }        
        setNotLoading(nl);
        return null;
    }

    if(state.match) {
        if(typeof props.children === "function") {
            return props.children(state); // serve kept props from state
        }
        return props.children;
    }
    return null;
}

export function Load<RouterMatchType extends RouterMatch>(props:{ match: null|RouterMatchType, children: (match:RouterMatchType) => ReactElement}) {
    const context = useContext(DeferContext);    
    var [state, setState] = useState<{ match: null|RouterMatchType }>({ match: null });

    var nl = context.canNavigate && !context.loading && state.match !== props.match;
    var [ notLoading, setNotLoading] = useState<boolean>();
    if(notLoading != nl) { // if condition changed
        if (nl) { // to true
            setState({ match: props.match }); // keep match in state
        }
        setNotLoading(nl);
        return null;
    }

    var match = props.match || state.match;
    if(match == null) {
        return null;
    }

    if(typeof props.children === "function") {
        return props.children(match);
    }
    return props.children;
}

