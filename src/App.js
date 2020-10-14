import React from "react";

import { HashRouter as Router, Route } from "react-router-dom";
import CreateConfigPage from "./CreateConfigPage";
import CreateScenePage from "./CreateScenePage";
import CreateTrialPage from "./CreateTrialPage";
import Home from "./Home";
import TrialFileHome from "./TrialFileHome";
import FormSettingsPage from "./FormSettingsPage";
import "antd/dist/antd.css";

function App() {
    return (
        <Router>
            <Route exact path="/" component={Home} />
            <Route path="/configGen" component={CreateConfigPage} />
            <Route path="/createScene" component={CreateScenePage} />
            <Route path="/generateTrialFileHome" component={TrialFileHome} />
            <Route path="/generateFile" component={CreateTrialPage} />
            <Route path="/formSettings" component={FormSettingsPage} />
        </Router>
    );
}

export default App;
