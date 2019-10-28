import { match as RouterMatch } from 'react-router'
import { Component } from 'react'
import { DeferContextType } from './DeferNavigation'

type Props = { match: null|RouterMatch, context: DeferContextType };
type State = { match: null|RouterMatch  };
export class LoadIn extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { match: null };
    }
    
    static getDerivedStateFromProps(props:Props, state:State) {
        if (props.context.canNavigate && !props.context.loading && state.match !== props.match) {
            return { match: props.match };
        }
        return null
    }
    render() {
        if(this.props.match || this.state.match) {
            if(typeof this.props.children === "function") {
                return this.props.children(this.props.match || this.state.match);
            }
            return this.props.children;
        }
        return null;
    }
}