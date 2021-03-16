import React from "react";
import { Link } from "react-router-dom";
import { EditOutlined, FileExcelOutlined } from "@ant-design/icons";

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
                    <Link className="App-link" to="/manualInput">
                        <EditOutlined />
                        Manual input
                    </Link>
                    <Link className="App-link" to="/importFromCSV">
                        <FileExcelOutlined />
                        Import from CSV
                    </Link>
                </div>
            </header>
        </div>
    );
};
