import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    loadConfigFormSetting,
    loadConfigOutputPath,
    storeConfigOutputPath,
} from "./database/formSettingsDB";
import { Result, Modal, Button, Input } from "antd";
import "./layout.css";
import { ScrollPanel } from "./ScrollPanel";
import { Header } from "./Header";
import { DynamicForm } from "./dynamic_form/DynamicForm";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

/**
 * This is the page where user fills in information to generate a VR configuration file.
 */
export const ConfigFileBuilder = () => {
    const [formSetting, setFormSetting] = useState(undefined);
    const [formResult, setFormResult] = useState(undefined);
    const [outputPath, setOutputPath] = useState(undefined);
    const [finishedGeneratingFile, setFinishedGeneratingFile] = useState(false);
    const [isGeneratingFile, setIsGeneratingFile] = useState(false);
    const [fileName, setFileName] = useState("config");

    useEffect(() => {
        loadConfigFormSetting(setFormSetting);
        loadConfigOutputPath(setOutputPath);
    }, []);

    // On finishing the form
    const onFinish = (values) => {
        console.log("Success:", values);
        // if (values.trialFile !== undefined) {
        //     values.trialFile = '~\\..\\Assets\\Trials\\' + values.trialFile;
        // }
        setFormResult(values);
        displayDialogue();
    };

    const generateFile = () => {
        const filepath = path.join(outputPath, `${fileName}.json`);
        fs.writeFileSync(
            filepath,
            JSON.stringify(formResult, null, 4),
            (error) => {
                if (error) {
                    console.log(error);
                    setFinishedGeneratingFile(false);
                    alert(`ERROR: Could not save file to ${filepath}`);
                }
            }
        );
        // Triggers success message
        setFinishedGeneratingFile(true);
    };

    // This modal asks users to type in the name of the file to be generated
    const renderSaveFileAsModal = () => {
        const submitButton = (
            <Button key="submit" onClick={generateFile}>
                Save
            </Button>
        );
        const onValueChange = ({ target: { value } }) => setFileName(value);
        return (
            <Modal
                centered
                visible={isGeneratingFile}
                title="Save file as"
                maskClosable={false}
                onCancel={() => setIsGeneratingFile(false)}
                footer={[submitButton]}
            >
                <Input
                    value={fileName}
                    onChange={onValueChange}
                    addonAfter=".json"
                />
            </Modal>
        );
    };

    // This dialogue asks user to select a directory to generate the file in
    const displayDialogue = () => {
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
                    // This is used for display in the success message
                    setOutputPath(path);
                    // Store path as default path into the database
                    storeConfigOutputPath(path);
                    // This will trigger the Save File As Modal to be visible
                    setIsGeneratingFile(true);
                } else {
                    throw new Error("No directory selected");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (finishedGeneratingFile) {
        return (
            <div className="center">
                <Result
                    status="success"
                    title="Successfully generated configuration file!"
                    subTitle={`You can find the file at ${outputPath}`}
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
                onSubmit={onFinish}
                submitButtonText="Generate configuration file"
                labelWidth={8}
            />
            {renderSaveFileAsModal()}
        </ScrollPanel>
    );
};
