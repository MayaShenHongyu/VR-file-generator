import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function TrialFileHome() {
    return (
        <div className="App">
            <Link className="back-button" to="/">
                Back
            </Link>
            <header className="App-header">
                <p>Generate trial file</p>
                <div className="horizontal">
                    <Link className="App-link" to="/createScene">
                        Create scene
                    </Link>
                    <Link className="App-link" to="/generateFile">
                        Generate trial
                    </Link>
                </div>
            </header>
        </div>
    );
}

export default TrialFileHome;
