import React, { Component } from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import { NavbarComponents } from './components';
import { Home, Sukses } from './pages';

export default class App extends Component {
  render() {
    return (
      
      <BrowserRouter>
        <NavbarComponents />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/sukses" component={Sukses} />
          </Switch>
        </main>
      </BrowserRouter>
    )
  }
}
