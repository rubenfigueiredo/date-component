import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import DateComponent from "./routes/DateComponent";
const App = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/date-component" component={DateComponent} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
