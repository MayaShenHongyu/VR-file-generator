import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Home } from "./Home";
import { ConfigFileBuilder } from "./config_file/ConfigFileBuilder";
import { SceneBuilder } from "./trial_file/SceneBuilder";
import { TrialFileBuilder } from "./trial_file/TrialFileBuilder";
import { TrialFileHome } from "./trial_file/TrialFileHome";
import { FormSettingsPage } from "./form_settings/FormSettingsPage";
import { CSVTrialFileConverter } from "./trial_file/CSVTrialFileConverter";
import { TrialFileManualInput } from "./trial_file/TrialFileManualInputHome";
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
            <Route path="/manualInput" component={TrialFileManualInput} />
            <Route path="/importFromCSV" component={CSVTrialFileConverter} />
        </Router>
    );
}

export default App;
