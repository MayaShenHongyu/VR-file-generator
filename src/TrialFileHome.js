import React from "react";
import { Link } from "react-router-dom";
import { PlusCircleOutlined, FormOutlined } from "@ant-design/icons";

/**
 * Home page for generating trial files.
 */
export const TrialFileHome = () => {
    return (
        <div className="App">
            <Link className="back-button" to="/">
                Back
            </Link>
            <header className="App-header">
                <p>Generate trial file</p>
                <div>
                    <Link className="App-link" to="/sceneBuilder">
                        <PlusCircleOutlined />
                        Create scene
                    </Link>
                    <Link className="App-link" to="/trialFileBuilder">
                        <FormOutlined />
                        Generate trial
                    </Link>
                </div>
            </header>
        </div>
    );
}
