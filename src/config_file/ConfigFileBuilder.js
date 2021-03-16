import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    loadConfigFormSetting,
    loadConfigOutputPath,
    storeConfigOutputPath,
} from "../database/formSettingsDB";
import { Result, message } from "antd";
import "../layout.css";
import { ScrollPanel } from "../ScrollPanel";
import { Header } from "../Header";
import { DynamicForm } from "../dynamic_form/DynamicForm";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

/**
 * This is the page where user fills in information to generate a VR configuration file.
 */
export const ConfigFileBuilder = () => {
    const [formSetting, setFormSetting] = useState(undefined);
    const [outputPath, setOutputPath] = useState(undefined);
    const [finishedGeneratingFile, setFinishedGeneratingFile] = useState(false);


    useEffect(() => {
        loadConfigFormSetting(setFormSetting);
        loadConfigOutputPath(setOutputPath);
    }, []);

    // On finishing the form
    const onSubmitForm = (values) => {
        console.log("Success:", values);
        selectOutputPath(values);
    };

    const generateFileAtPath = (formValues, outputPath) => {
        const filepath = path.join(outputPath, "config.json");
        fs.writeFileSync(
            filepath,
            JSON.stringify(formValues, null, 4),
            (error) => {
                if (error) {
                    message.error(String(error));
                    setFinishedGeneratingFile(false);
                    alert(`ERROR: Could not save file to ${filepath}`);
                }
            }
        );
        // Triggers success message
        setFinishedGeneratingFile(true);
    }

    // This dialogue asks user to select a directory to generate the file in
    const selectOutputPath = (formValues) => {
        dialog
            .showOpenDialog({
                properties: ["openDirectory"],
                defaultPath: outputPath,
                title: "Save file at",
            })
            .then((response) => {
                if (!response.canceled) {
                    // Handle fully qualified file name
                    const path = response.filePaths[0];
                    // This is used to display in the success message
                    setOutputPath(path);
                    // Store path as default path into the database
                    storeConfigOutputPath(path);
                    // Generate the file at the given path
                    generateFileAtPath(formValues, path);
                } else {
                    throw new Error("No directory selected");
                }
            })
            .catch((err) => {
                message.error(String(err));
            });
    };

    if (finishedGeneratingFile) {
        return (
            <div className="center">
                <Result
                    status="success"
                    title="Successfully generated configuration file!"
                    subTitle={`You can find config.json at ${outputPath}`}
                    extra={[
                        <Link key={"back"} className="App-link" to="/">
                            Back to home page
                        </Link>,
                    ]}
                />
            </div>
        );
    }
    return (
        <ScrollPanel>
            <Link className="back-button" to="/">
                Back
            </Link>
            <Header
                title="Configuration File Builder"
                description="Enter the experiment parameters to create a basic configuration file that is formatted for use with the VR Simulator. The experimenter will change certain parameters in this file between experiments."
            />
            <DynamicForm
                formEntryDefinitions={formSetting}
                onSubmit={onSubmitForm}
                submitButtonText="Generate configuration file"
                labelWidth={8}
            />
        </ScrollPanel>
    );
};
