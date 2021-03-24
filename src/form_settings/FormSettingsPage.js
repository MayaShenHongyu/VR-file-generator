import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    loadConfigFormSetting,
    storeConfigFormSetting,
    loadObjectFormSetting,
    storeObjectFormSetting,
} from "../database/formSettingsDB";
import { Tabs, Button } from "antd";
import "../layout.css";
import { ScrollPanel } from "../ScrollPanel";
import { Header } from "../Header";
import { ObjectTypesEditor } from "./ObjectTypesEditor";
import { FormSettingEditor } from "./FormSettingEditor";

/**
 * Form settings page for users to customize configuration file form and object form.
 */
export const FormSettingsPage = () => {
    const [advanced, setAdvanced] = useState(false);

    const formSettingImport = (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Configuration file form" key="1">
                <FormSettingEditor
                    loadFormSetting={loadConfigFormSetting}
                    storeFormSetting={storeConfigFormSetting}
                />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Object form" key="2">
                <FormSettingEditor
                    loadFormSetting={loadObjectFormSetting}
                    storeFormSetting={storeObjectFormSetting}
                />
            </Tabs.TabPane>
        </Tabs>
    );

    return (
        <ScrollPanel>
            <Link className="back-button" to="/">
                Back
            </Link>
            <Header title="Form Settings" />

            <div style={{ margin: "0 10vw" }}>
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Button
                        style={{ fontSize: "smaller" }}
                        size="small"
                        shape="round"
                        onClick={() => setAdvanced(!advanced)}
                        type={advanced && "primary"}
                    >
                        Advanced...
                    </Button>
                </div>
                {advanced ? formSettingImport : <ObjectTypesEditor />}
            </div>
        </ScrollPanel>
    );
};
