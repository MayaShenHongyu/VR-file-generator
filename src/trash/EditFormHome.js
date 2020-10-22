import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import "./App.css";
import { Button, Layout } from "antd";
import { Header } from "../Header";
import "./TrialFileBuilder.css";

function Home() {
    const [selectedForm, setSelectedForm] = useState(undefined);

    const getMenu = () => {
        if (selectedForm === undefined) {
            return (
                <React.Fragment>
                    <Button onClick={() => setSelectedForm(0)}>
                        Configuration
                    </Button>
                    <Button onClick={() => setSelectedForm(1)}>Scene</Button>
                    <Button onClick={() => setSelectedForm(2)}>Object</Button>
                </React.Fragment>
            );
        }
    };

    const maybeConfigForm = () => {
        if (selectedForm === 0) {
        }
    };

    return (
        <Layout style={{ height: "100vh", overflow: "hidden" }}>
            <div style={{ overflow: "scroll" }}>
                <Link className="back-button" to="/generateTrialFileHome">
                    Back
                </Link>
                <Header title="Select the form you want to edit:" />
                <div className="content"></div>
            </div>
        </Layout>
    );
}

export default Home;
