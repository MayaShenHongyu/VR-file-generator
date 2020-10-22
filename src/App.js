import React from "react";

import { HashRouter as Router, Route } from "react-router-dom";
import { ConfigFileBuilder } from "./ConfigFileBuilder";
import { SceneBuilder } from "./SceneBuilder";
import { TrialFileBuilder } from "./TrialFileBuilder";
import { Home } from "./Home";
import { TrialFileHome } from "./TrialFileHome";
import { FormSettingsPage } from "./FormSettings";
import "antd/dist/antd.css";

function App() {
    return (
        <Router>
            <Route exact path="/" component={Home} />
            <Route path="/configFileBuilder" component={ConfigFileBuilder} />
            <Route path="/generateTrialFileHome" component={TrialFileHome} />
            <Route path="/sceneBuilder" component={SceneBuilder} />
            <Route path="/trialFileBuilder" component={TrialFileBuilder} />
            <Route path="/formSettings" component={FormSettingsPage} />
        </Router>
    );
}

export default App;
