import { match as RouterMatch } from 'react-router'
import { Component } from 'react'
import { DeferContextType } from './DeferNavigation'

type Props = { context: DeferContextType };
type State = { context?: DeferContextType };

export class ShowIn extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { };
    }
    
    static getDerivedStateFromProps(props:Props, state:State) {
        if (!state.context || (props.context.canNavigate && !props.context.loading)) {
            return props;
        }
        return null;
    }
    render() {
        if(typeof this.props.children === "function") {
            return this.props.children(this.state);
        }
        return this.props.children;
    }
}
