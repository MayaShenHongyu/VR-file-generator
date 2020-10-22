import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    loadConfigFormSetting,
    storeConfigFormSetting,
    loadObjectFormSetting,
    storeObjectFormSetting,
} from "./database/formSettingsDB";
import { Tabs, Input, Button, Col, Row, message } from "antd";
import "./layout.css";
import { parseFormSetting } from "./form_config_parser/parser";
import { ScrollPanel } from "./ScrollPanel";
import { Header } from "./Header";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");

/**
 * Form settings page for users to customize configuration file form and object form.
 */
export const FormSettingsPage = () => {
    return (
        <ScrollPanel>
            <Link className="back-button" to="/">
                Back
            </Link>
            <Header title="Form Settings" />
            <div style={{ margin: "0 10vw" }}>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Configuration file form" key="1">
                        <FormSetting
                            loadFormSetting={loadConfigFormSetting}
                            storeFormSetting={storeConfigFormSetting}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Object form" key="2">
                        <FormSetting
                            loadFormSetting={loadObjectFormSetting}
                            storeFormSetting={storeObjectFormSetting}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </ScrollPanel>
    );
};

/**
 * A single form setting importer.
 */
const FormSetting = ({ loadFormSetting, storeFormSetting }) => {
    const [formSetting, setFormSetting] = useState([]);
    const [generalMessage, setGeneralMessage] = useState(undefined); // General message indicating whether there is a problem with the imported form setting
    const [entryErrorMessages, setEntryErrorMessages] = useState(undefined); // Error messages for each Form Entry Definition
    const [unsaved, setUnsaved] = useState(false); // True if a form setting is imported but not yet saved

    useEffect(() => {
        loadFormSetting(setFormSetting);
    }, [loadFormSetting]);

    const parseNewConfig = (newSetting) => {
        setFormSetting(newSetting);
        setUnsaved(true);
        if (!Array.isArray(newSetting)) {
            setGeneralMessage(
                "Form setting should be a list of Form Entry Definitions. Please revise and import again."
            );
        } else {
            const entryErrorMessages = parseFormSetting(newSetting);
            setEntryErrorMessages(entryErrorMessages);
            if (entryErrorMessages === undefined) {
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

    const maybeRenderEntryMessages = () => {
        return (
            entryErrorMessages &&
            Array.from(entryErrorMessages).map((val) => renderEntryMessage(val))
        );
    };

    const renderErrorMessages = () => {
        return (
            <div className="small-margin" style={{ color: "red" }}>
                <Row style={{ fontSize: "1.1em" }}>{generalMessage}</Row>
                {maybeRenderEntryMessages()}
            </div>
        );
    };

    // File selecting dialog
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

    const renderSaveOrCancelButton = () => {
        const canSave = generalMessage === undefined; // Indicates there is no problem with the form setting
        const visibility = unsaved ? "visible" : "hidden";
        const onClick = () => {
            setUnsaved(false);
            if (canSave) { // `Save settings`
                storeFormSetting(formSetting);
                message.success("Successfully saved.");
            } else { // `Cancel`
                loadFormSetting(setFormSetting);
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
                value={JSON.stringify(formSetting, null, 4)}
            />
            <div
                className="small-margin"
                style={{ display: "flex", justifyContent: "space-between" }}
            >
                <Button onClick={loadFile}>Import new settings</Button>
                {renderSaveOrCancelButton()}
            </div>
            {renderErrorMessages()}
        </div>
    );
};
