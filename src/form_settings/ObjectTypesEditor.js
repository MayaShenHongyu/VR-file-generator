import React, { useState, useEffect } from "react";
import {
    loadObjectFormSetting,
    storeObjectFormSetting,
} from "../database/formSettingsDB";
import { Input, Button, Select, message, Spin } from "antd";
import "../layout.css";

/**
 * Add or delete object types.
 */
export const ObjectTypesEditor = () => {
    const [objectFormSetting, setObjectFormSetting] = useState(undefined);
    const [objectTypes, setObjectTypes] = useState(undefined);
    const [newObjectType, setNewObjectType] = useState("");
    const [objectTypeToDelete, setObjectTypeToDelete] = useState(undefined);

    useEffect(() => {
        loadObjectFormSetting(setObjectFormSetting);
    }, []);

    useEffect(() => {
        if (objectFormSetting !== undefined) {
            if (objectFormSetting[0].key === "objType") {
                setObjectTypes(Object.values(objectFormSetting[0].options));
            } else {
                message.error(
                    "Please make sure 'Object Type' is the first form definition entry in your Object form setting!"
                );
            }
        }
    }, [objectFormSetting]);

    if (!objectTypes) {
        return (
            <div className="center">
                <Spin size="large" />
            </div>
        );
    }

    const updateObjectTypeOptions = (options) => {
        storeObjectFormSetting(
            [
                {
                    ...objectFormSetting[0],
                    options,
                },
            ].concat(objectFormSetting.slice(1))
        );
    };

    const addNewObjectType = (newType) => {
        if (newType === "") return;

        if (objectTypes.includes(newType)) {
            message.error(`${newType} already exists.`);
        } else {
            storeObjectFormSetting(
                [
                    {
                        ...objectFormSetting[0],
                        options: {
                            ...objectFormSetting[0].options,
                            [newType]: newType,
                        },
                    },
                ].concat(objectFormSetting.slice(1))
            );
            setNewObjectType("");
            loadObjectFormSetting(setObjectFormSetting);
            message.success(`Successfully added ${newType}!`);
        }
    };

    const deleteObjectType = (deleteType) => {
        if (deleteType === undefined || deleteType === "") return;
        const optionsAfterDelete = Object.fromEntries(
            objectTypes
                .filter((objType) => objType !== deleteType)
                .map((objType) => [objType, objType])
        );
        updateObjectTypeOptions(optionsAfterDelete);
        setObjectTypeToDelete(undefined);
        loadObjectFormSetting(setObjectFormSetting);
        message.success(`Successfully deleted ${deleteType}!`);
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <div style={{ marginBottom: "20px" }}>
                <div>Add New Object Type: </div>
                <Input
                    style={{ width: "30vw", margin: "10px 20px 0 0" }}
                    value={newObjectType}
                    onChange={(e) => setNewObjectType(e.target.value)}
                />
                <Button onClick={() => addNewObjectType(newObjectType)}>
                    Add
                </Button>
            </div>
            <div>
                <div>Delete Object Type: </div>
                <Select
                    style={{ width: "30vw", margin: "10px 20px 0 0" }}
                    value={objectTypeToDelete}
                    onChange={setObjectTypeToDelete}
                    options={objectTypes.map((objType) => ({
                        label: objType,
                        value: objType,
                    }))}
                />
                <Button onClick={() => deleteObjectType(objectTypeToDelete)}>
                    Delete
                </Button>
            </div>
        </div>
    );
};
