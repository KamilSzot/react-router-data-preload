import { match as RouterMatch } from 'react-router'
import { Component } from 'react'
import { DeferContextType } from './DeferNavigation'

type Props = { match: null|RouterMatch, context: DeferContextType };
type State = { match: null|RouterMatch };

export class ShowIn extends Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = { match: null };
    }
    
    static getDerivedStateFromProps(props:Props, state:State) {
        if (props.context.canNavigate && !props.context.loading) {
            return Object.assign(state, props);
        }
        return null;
    }
    render() {
        if(this.state.match) {
            if(typeof this.props.children === "function") {
                return this.props.children(this.state);
            }
            return this.props.children;
        }
        return null;
    }
}
