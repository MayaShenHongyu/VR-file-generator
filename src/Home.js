import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Home() {
    return (
        <div className="App">
            <header className="App-header">
                <p>VR File Generator</p>
                <div>
                    <Link className="App-link" to="/configGen">
                        Generate configuration
                    </Link>
                    <Link className="App-link" to="/generateTrialFileHome">
                        Generate trial
                    </Link>
                    <Link className="App-link" to="/formSettings">
                        Import form settings
                    </Link>
                </div>
            </header>
        </div>
    );
}

export default Home;
