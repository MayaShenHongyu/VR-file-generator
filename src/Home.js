import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { SettingOutlined, FormOutlined } from "@ant-design/icons";

/**
 * Home page for the application.
 */
export const Home = () => {
    return (
        <div className="App">
            <header className="App-header">
                <p>VR File Generator</p>
                <div>
                    <Link className="App-link" to="/configFileBuilder">
                        <FormOutlined />
                        Generate configuration file
                    </Link>
                    <Link className="App-link" to="/generateTrialFileHome">
                        <FormOutlined />
                        Generate trial file
                    </Link>
                    <Link className="App-link" to="/formSettings">
                        <SettingOutlined />
                        Change form settings
                    </Link>
                </div>
            </header>
        </div>
    );
};
