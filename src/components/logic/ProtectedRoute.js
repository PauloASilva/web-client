import { AuthConsumer } from "../../contexts/AuthContext";
import { Redirect, Route, withRouter } from "react-router-dom";

import React from 'react';

const ProtectedRoute = ({component: Component, ...rest}) => (
    <AuthConsumer>
        {
        ({isAuth}) => (
            <Route render={props => 
                isAuth ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location }}} />
            } />
        )
        }
    </AuthConsumer>
)

export default withRouter(ProtectedRoute)
