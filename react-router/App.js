import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link , Redirect } from "react-router-dom";

const fackAuth = {
    isAuthenticated : false , 
    authenticate(cb){
        this.isAuthenticated = true , 
        setTimeout(cb ,100);
    },
    signOut(cb){
        this.isAuthenticated = false ,
        setTimeout(cb , 100);
    }
}
const Public = () => (
    <div>
        Public
    </div>
)
const Protected = () => (
    <div>
        Protected
    </div>
)
const AuthButton = () => (
    fackAuth.isAuthenticated === true ? 
    <p> Welcome ! <button onClick={()=> ({})}>sign Out</button></p>
    : <p> You are not logged in </p>
)
const PrivateRoute = ({component : Component , ...rest }) => (
    <Route {...rest} render = {(props) => (
        fackAuth.isAuthenticated ? <Component /> : <Redirect to={{
            pathname : '/login',
            state:{ from :props.location }
        }}/>
    )} />
) 
export class Login extends React.Component {
    state = {
        redirectToReferrer : false
    }
    login = () => {
        fackAuth.authenticate( () =>{
            this.setState(() =>({
                redirectToReferrer : true
            }))
        })
    }
    render() {
        const { redirectToReferrer } = this.state   
        const { from } = this.props.location.state || { from :{ pathname : '/'}}
        if( redirectToReferrer === true ) {
            return (
                <Redirect to={from}/>
            )
        }
        return (
            <div>
             <p>You must login to view this page at {from.pathname}</p>
             <button onClick = { this.login}> Login </button>
        </div>
    )
    }
}

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                <AuthButton />
                    <ul>
                        <li> <Link to='/public'>Public </Link> </li>
                        <li> <Link to='/protected'>Protected </Link> </li>
                        {/* <li> <Link to='/login'>Login </Link> </li> */}
                    </ul>
                    <hr />
                    <Route path='/public' component={Public} />
                    <Route path='/login' component={Login} />
                    <PrivateRoute path='/protected' component = {Protected}/>
                </div>
            </Router>
        )
    }
}



render(
    <App />
    ,
    document.getElementById('container')
)
