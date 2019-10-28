import React, { Component, FunctionComponent } from 'react';

import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { resolve } from 'q';
import { thisExpression } from '@babel/types';

import NavBar from './NavBar'
import Contact from './Contact'
import Offer from './Offer'
import { Site, LoadingLink } from './Page'
import { Loading, Show, Load, DeferNavigation } from './DeferNavigation'

// 1
import { ApolloProvider, Query, ApolloContext } from 'react-apollo'
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'



const GITHUB_ACCESS_TOKEN = 'b7b53915442112fbb58c0e914e504882bde14056';

// 2
const httpLink = createHttpLink({
	uri: 'https://api.github.com/graphql',
	headers: { Authorization: 'bearer ' + GITHUB_ACCESS_TOKEN }

})

// 3

const l = console.log.bind(console);

const loadingLink:LoadingLink = new LoadingLink();

const client = new ApolloClient({
	link: ApolloLink.from([loadingLink, httpLink]),
	cache: new InMemoryCache()
})

const Q = gql`query {
	user(login: "nanuk") {
		name
	} 
	}`;
/*
client.query({query: gql`query {
	user(login: "nanuk") {
		name
	} 
}`}).then((r) => l(r));
*/

const Dbg = (props:any) => <hr />;

// const Home = () => <h1>Home</h1>;
// const About = () => <h1>About</h1>;
//const Contact = () => <h1>Contact</h1>;



class Home extends Component {
	render() {
		return <Route exact path="/" children={(route) =>
			<Load match={route.match}>{(match) =>
				<Query<{}> query={Q} children={(response) =>
					<Show match={match} response={response}>{(props) =>
						<div>
							<Dbg {...props.response} />
							<h1 >Home</h1>
							<div>{JSON.stringify(props.response && props.response.data, null, 2)}</div>
						</div>
					}
					</Show>
				} />
			}
			</Load>
		} />
	}
}

class Refresher extends Component<{children:(r:number) => {}}, { r: number }> {
  constructor(props: {children:(r:number) => {}}) {
    super(props);
    this.state = { r: 0 }
    setInterval(() => this.setState({ r: Math.random() }), 1000);
  }
  render() {
    return <div>{this.state.r}<div>{this.props.children(this.state.r)}</div></div>;
  }
}

const About = (props:{}) => <Route path="/about">{(route) => <Show match={route.match}><h1>About</h1></Show>}</Route>;


const App: FunctionComponent<{}> = () =>
	<ApolloProvider client={client}>
		<div className="App">
			<header className="App-header">
				<Router>
					<Site showOnInitialNavigation={true} loadingLink={loadingLink}> 
            <NavBar />
						<Loading />

						<Home />
						<Offer />
						<About />
						<Contact />
					</Site>
          
				</Router>
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
			</a>
			</header>
			<p className="App-intro">
				To get started, edit <code>src/App.js</code> and save to reload.
			</p>
		</div>
	</ApolloProvider>

export default App;
