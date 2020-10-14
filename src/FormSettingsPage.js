import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import {
    loadConfigForm,
    storeConfigForm,
    loadObjectForm,
    storeObjectForm,
} from "./database/form_config";
import { Tabs, Input, Button, Col, Row, message } from "antd";
import "./layout.css";
import { parseConfig } from "./form_config_parser/parser";
import { ScrollPanel } from "./ScrollPanel";
import { Header } from "./Header";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");

const FormSettingsPage = () => {
    return (
        <ScrollPanel>
            <Link className="back-button" to="/">
                Back
            </Link>
            <Header title="Form Settings" />
            <div style={{ margin: "0 10vw" }}>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Configuration file form" key="1">
                        <ImportFormSetting
                            loadFormConfig={loadConfigForm}
                            storeFormConfig={storeConfigForm}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Object form" key="2">
                        <ImportFormSetting
                            loadFormConfig={loadObjectForm}
                            storeFormConfig={storeObjectForm}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </ScrollPanel>
    );
};

const ImportFormSetting = ({ loadFormConfig, storeFormConfig }) => {
    const [formConfig, setFormConfig] = useState([]);
    const [generalMessage, setGeneralMessage] = useState(undefined);
    const [entryErrorMessages, setEntryErrorMessages] = useState(undefined);
    const [unsaved, setUnsaved] = useState(false);

    useEffect(() => {
        loadFormConfig(setFormConfig);
    }, [loadFormConfig]);

    const parseNewConfig = (newConfig) => {
        setFormConfig(newConfig);
        setUnsaved(true);
        if (!Array.isArray(newConfig)) {
            setGeneralMessage(
                "Configuration should be a list of objects. Please revise the configuration and import again."
            );
        } else {
            const errorMessages = parseConfig(newConfig);
            setEntryErrorMessages(errorMessages);
            if (errorMessages === undefined) {
                setGeneralMessage(undefined);
            } else {
                setGeneralMessage("Please revise and import again.");
            }
        }
    };

    const renderEntryMessage = (entryMessage) => {
        const { index, messages } = entryMessage;
        return (
            <div key={index}>
                <Row>
                    <Col span={5}>{`Entry ${index + 1}:`}</Col>
                    <Col>{messages[0]}</Col>
                </Row>
                {Array.from(messages)
                    .slice(1)
                    .map((message, i) => (
                        <Row key={i}>
                            <Col offset={5}>{message}</Col>
                        </Row>
                    ))}
            </div>
        );
    };

    const renderEntryMessages = () => {
        return (
            entryErrorMessages &&
            Array.from(entryErrorMessages).map((val) => renderEntryMessage(val))
        );
    };

    const renderErrorMessages = () => {
        return (
            <div className="small-margin" style={{ color: "red" }}>
                <Row style={{ fontSize: "1.1em" }}>{generalMessage}</Row>
                {renderEntryMessages()}
            </div>
        );
    };

    const loadFile = () => {
        dialog
            .showOpenDialog({
                properties: ["openFile"],
                filters: [{ name: "JSON Files", extensions: ["json"] }],
                title: "Import form settings",
            })
            .then((response) => {
                if (!response.canceled) {
                    const path = response.filePaths[0];
                    const rawFile = fs.readFileSync(path);
                    const processed = JSON.parse(rawFile);
                    parseNewConfig(processed);
                    // return path;
                }
            })
            .catch((err) => {
                message.error(`${String(err)}.`);
            });
    };

    const renderSaveButton = () => {
        const canSave = generalMessage === undefined;
        const visibility = unsaved ? "visible" : "hidden";
        const onClick = () => {
            setUnsaved(false);
            if (canSave) {
                storeFormConfig(formConfig);
                message.success("Successfully saved.");
            } else {
                loadFormConfig(setFormConfig);
                setGeneralMessage(undefined);
                setEntryErrorMessages(undefined);
            }
        };
        return (
            <Button style={{ visibility }} type="primary" onClick={onClick}>
                {canSave ? "Save settings" : "Cancel"}
            </Button>
        );
    };

    return (
        <div>
            <Input.TextArea
                rows={10}
                value={JSON.stringify(formConfig, null, 4)}
            />
            <div
                className="small-margin"
                style={{ display: "flex", justifyContent: "space-between" }}
            >
                <Button onClick={loadFile}>Import new settings</Button>
                {renderSaveButton()}
            </div>
            {renderErrorMessages()}
        </div>
    );
};

export default FormSettingsPage;
