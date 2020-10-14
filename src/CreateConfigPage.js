import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import {
    loadConfigForm,
    loadConfigOutputPath,
    storeConfigOutputPath,
} from "./database/form_config";
import { Result, Modal, Button, Input } from "antd";
import "./layout.css";
import { ScrollPanel } from "./ScrollPanel";
import { Header } from "./Header";
import { DynamicForm } from "./dynamic_form/DynamicForm";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

const ConfigForm = () => {
    const [formEntries, setFormEntries] = useState(undefined);
    const [formValues, setFormValues] = useState(undefined);
    const [outputPath, setOutputPath] = useState(undefined);
    const [submitted, setSubmitted] = useState(false);
    const [isGeneratingFile, setIsGeneratingFile] = useState(false);
    const [fileName, setFileName] = useState("config");

    useEffect(() => {
        loadConfigForm(setFormEntries);
        loadConfigOutputPath(setOutputPath);
    }, []);

    const onFinish = (values) => {
        console.log("Success:", values);
        displayDialogue();
        setFormValues(values);
    };

    const generateFile = () => {
        const filepath = path.join(outputPath, `${fileName}.json`);
        fs.writeFileSync(
            filepath,
            JSON.stringify(formValues, null, 4),
            (error) => {
                if (error) {
                    console.log(error);
                    setSubmitted(false);
                    alert(`ERROR: Could not save file to ${filepath}`);
                }
            }
        );
        setSubmitted(true);
    };

    const getModal = () => {
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

    const displayDialogue = () => {
        dialog
            .showOpenDialog({
                properties: ["openDirectory"],
                defaultPath: outputPath,
                title: "Save file at",
            })
            .then((response) => {
                if (!response.canceled) {
                    // handle fully qualified file name
                    const path = response.filePaths[0];
                    console.log(path);
                    setOutputPath(path);
                    storeConfigOutputPath(path);
                    setIsGeneratingFile(true);
                } else {
                    throw new Error("no directory selected");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (submitted) {
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
                formEntries={formEntries}
                onSubmit={onFinish}
                submitButtonText="Generate config file"
            />
            {getModal()}
        </ScrollPanel>
    );
};

export default ConfigForm;
