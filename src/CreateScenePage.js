import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { loadSceneForm, loadObjectForm } from "./database/form_config";
import { Modal, Button, Col, Result, message } from "antd";
import "./layout.css";
import { DynamicForm } from "./dynamic_form/DynamicForm";
import { addScene } from "./database/scenes";
import { ScrollPanel } from "./ScrollPanel";
import { Header } from "./Header";

const CreateScenePage = () => {
    const [sceneFormEntries, setSceneFormEntries] = useState([]);
    const [objectFormEntries, setObjectFormEntries] = useState([]);
    const [numObjects, setNumObjects] = useState(0);
    const [objectForms, setObjectForms] = useState([]);
    const [sceneForm, setSceneForm] = useState(undefined);
    const [isOnEditObjectPage, setIsOnEditObjectPage] = useState(false);
    const [isEditingObject, setIsEditingObject] = useState(false);
    const [editingObjectIndex, setEditingObjectsIndex] = useState(undefined);
    const [canSubmit, setCanSubmit] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        loadSceneForm(setSceneFormEntries);
        loadObjectForm(setObjectFormEntries);
    }, []);

    useEffect(() => {
        setObjectForms([...Array(numObjects).keys()].map((_i) => undefined));
    }, [numObjects]);

    useEffect(() => {
        setCanSubmit(
            objectForms.filter((form) => form === undefined).length === 0
        );
    }, [objectForms]);

    const onFinish = (values) => {
        if (!values.numObjects) {
            console.log("No numObjects field. Error!");
        }
        setNumObjects(values.numObjects);
        setSceneForm(values);
        setIsOnEditObjectPage(true);
    };

    const renderEditObjectButtons = () => {
        return [...Array(numObjects).keys()].map((i) => {
            const edited = objectForms[i] !== undefined;
            const text = edited ? `Edit object ${i}` : `Create object ${i}`;
            const danger = edited ? {} : { danger: true };

            return (
                <div key={i} className="medium-margin">
                    <Col offset={6} span={12}>
                        <Button
                            block
                            type="dashed"
                            {...danger}
                            onClick={() => {
                                setEditingObjectsIndex(i);
                                setIsEditingObject(true);
                            }}
                        >
                            {text}
                        </Button>
                    </Col>
                </div>
            );
        });
    };

    const onCreateScene = () => {
        if (canSubmit) {
            const processedObjectForms = objectForms.map((val, i) => ({
                objNum: i + 1,
                ...val,
            }));
            const scene = { ...sceneForm, objects: processedObjectForms };
            addScene(scene);
            setSubmitted(true);
        } else {
            message.error("Please finish creating all objects.");
        }
    };

    const renderEditObjectPage = () => {
        return (
            <React.Fragment>
                <Modal
                    centered
                    visible={isEditingObject}
                    title="Edit object"
                    onCancel={onCloseModal}
                    footer={[]}
                >
                    {renderMoadalForm()}
                </Modal>
                {renderEditObjectButtons()}
                <div className="medium-margin">
                    <Col offset={6} span={12}>
                        <Button block type="primary" onClick={onCreateScene}>
                            Create Scene
                        </Button>
                    </Col>
                </div>
            </React.Fragment>
        );
    };

    const onCloseModal = () => setIsEditingObject(false);

    const onSubmitObjectForm = (index, form) => {
        setObjectForms([
            ...objectForms.slice(0, index),
            form,
            ...objectForms.slice(index + 1),
        ]);
        onCloseModal();
    };

    const renderMoadalForm = () => {
        if (editingObjectIndex === undefined) {
            return undefined;
        }

        return (
            <DynamicForm
                formEntries={objectFormEntries}
                onSubmit={(values) =>
                    onSubmitObjectForm(editingObjectIndex, values)
                }
                initialValues={objectForms[editingObjectIndex]}
                submitButtonText="Finish edit object"
            />
        );
    };

    const renderEditScenePage = () => (
        <DynamicForm
            formEntries={sceneFormEntries}
            onSubmit={onFinish}
            submitButtonText="Continue to create objects"
        />
    );

    if (submitted) {
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

    const backButton = isOnEditObjectPage ? (
        <Link
            className="back-button"
            onClick={() => setIsOnEditObjectPage(false)}
        >
            Back
        </Link>
    ) : (
        <Link className="back-button" to="/generateTrialFileHome">
            Back
        </Link>
    );

    return (
        <ScrollPanel>
            {backButton}
            <Header
                title="Scene builder"
                description="Enter the experiment parameters to create a basic configuration file that is formatted for use with the VR Simulator. The experimenter will change certain parameters in this file between experiments."
            />
            {isOnEditObjectPage
                ? renderEditObjectPage()
                : renderEditScenePage()}
        </ScrollPanel>
    );
};

export default CreateScenePage;
