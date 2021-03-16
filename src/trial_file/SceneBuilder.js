import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Col, Result, message } from "antd";
import {
    loadSceneFormSetting,
    loadObjectFormSetting,
} from "../database/formSettingsDB";
import { DynamicForm } from "../dynamic_form/DynamicForm";
import { addScene } from "../database/scenesDB";
import { ScrollPanel } from "../ScrollPanel";
import { Header } from "../Header";
import "../layout.css";

/**
 * This is the page where user creates a scene.
 * The user is initially on the `scene page` to fill out `scene form` -- basic information about the scene.
 * Then after submitting the `scene form`, user is on `object page` to edit objects
 */
export const SceneBuilder = () => {
    const [sceneFormSetting, setSceneFormSetting] = useState(undefined);
    const [objectFormSetting, setObjectFormSetting] = useState(undefined);
    const [numObjects, setNumObjects] = useState(0);
    const [objectFormResults, setObjectFormResults] = useState([]);
    const [sceneFormResult, setSceneFormResult] = useState(undefined);
    const [isOnObjectPage, setIsOnObjectPage] = useState(false);
    const [isEditingObject, setIsEditingObject] = useState(false);
    const [editingObjectIndex, setEditingObjectsIndex] = useState(undefined);
    const [canCreateScene, setCanCreateScene] = useState(false);
    const [finishedCreatingScene, setFinishedCreatingScene] = useState(false);

    useEffect(() => {
        loadSceneFormSetting(setSceneFormSetting);
        loadObjectFormSetting(setObjectFormSetting);
    }, []);

    useEffect(() => {
        setObjectFormResults(
            [...Array(numObjects).keys()].map((_i) => undefined)
        );
    }, [numObjects]);

    // Check if user has initialized all objects
    useEffect(() => {
        setCanCreateScene(
            objectFormResults.every((form) => form !== undefined)
        );
    }, [objectFormResults]);

    const onFinishSceneForm = (values) => {
        const { numObjects } = values;
        if (numObjects === undefined) {
            message.error(
                "ERROR: No numObjects field. This field indicates the number of objects to be created."
            );
        }
        setNumObjects(numObjects);
        delete values["numObjects"];
        setSceneFormResult(values);
        setIsOnObjectPage(true);
    };

    const onCreateScene = () => {
        if (canCreateScene) {
            // Add a objNum entry to every object
            const processedObjectForms = objectFormResults.map((val, i) => ({
                objNum: i + 1,
                ...val,
            }));
            const scene = { ...sceneFormResult, objects: processedObjectForms };
            addScene(scene);
            setFinishedCreatingScene(true);
        } else {
            message.error("Please finish creating all objects.");
        }
    };

    const renderObjectPage = () => {
        const renderEditObjectButtons = () => {
            return [...Array(numObjects).keys()].map((i) => {
                const edited = objectFormResults[i] !== undefined;
                const text = edited
                    ? `Edit object ${i + 1}`
                    : `Create object ${i + 1}`;
                const onClick = () => {
                    setEditingObjectsIndex(i);
                    setIsEditingObject(true);
                };
                return (
                    <div key={i} className="medium-margin">
                        <Col offset={6} span={12}>
                            <Button
                                block
                                type="dashed"
                                danger={!edited}
                                onClick={onClick}
                            >
                                {text}
                            </Button>
                        </Col>
                    </div>
                );
            });
        };

        const onCloseModal = () => setIsEditingObject(false);

        const onFinishObjectForm = (index, form) => {
            setObjectFormResults([
                ...objectFormResults.slice(0, index),
                form,
                ...objectFormResults.slice(index + 1),
            ]);
            onCloseModal();
        };

        const renderObjectForm = () => {
            if (editingObjectIndex === undefined) {
                return undefined;
            }

            return (
                <DynamicForm
                    formEntryDefinitions={objectFormSetting}
                    onSubmit={(values) =>
                        onFinishObjectForm(editingObjectIndex, values)
                    }
                    initialValues={objectFormResults[editingObjectIndex]}
                    submitButtonText="Finish edit object"
                />
            );
        };

        return (
            <React.Fragment>
                <Modal
                    centered
                    visible={isEditingObject}
                    title="Edit object"
                    maskClosable={false}
                    onCancel={onCloseModal}
                    footer={[]}
                >
                    {renderObjectForm()}
                </Modal>
                {renderEditObjectButtons()}
                <div className="medium-margin">
                    <Col offset={6} span={12}>
                        <Button block type="primary" onClick={onCreateScene}>
                            Save Scene
                        </Button>
                    </Col>
                </div>
            </React.Fragment>
        );
    };

    const renderScenePage = () => (
        <DynamicForm
            formEntryDefinitions={sceneFormSetting}
            onSubmit={onFinishSceneForm}
            submitButtonText="Continue to create objects"
        />
    );

    if (finishedCreatingScene) {
        return (
            <div className="center">
                <Result
                    status="success"
                    title="Successfully created scene!"
                    extra={[
                        <Link
                            key={"back"}
                            className="App-link"
                            to="/generateTrialFileHome"
                        >
                            Back to generate trial page
                        </Link>,
                    ]}
                />
            </div>
        );
    }

    const backButton = isOnObjectPage ? (
        <Link className="back-button" onClick={() => setIsOnObjectPage(false)}>
            Back
        </Link>
    ) : (
        <Link className="back-button" to="/manualInput">
            Back
        </Link>
    );

    return (
        <ScrollPanel>
            {backButton}
            <Header
                title="Scene builder"
                description={
                    isOnObjectPage
                        ? "Please finish creating the objects."
                        : "Enter some basic information about this scene."
                }
            />
            {isOnObjectPage ? renderObjectPage() : renderScenePage()}
        </ScrollPanel>
    );
};
