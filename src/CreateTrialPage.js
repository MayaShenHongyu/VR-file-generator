import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { loadScenes, storeScenes } from "./database/scenes";
import {
    loadTrialOutputPath,
    storeTrialOutputPath,
} from "./database/form_config";
import { Header } from "./Header";
import {
    Form,
    Input,
    Button,
    Result,
    message,
    InputNumber,
    Popconfirm,
} from "antd";
import "./layout.css";
import "./CreateTrialPage.css";
import { ScrollPanel } from "./ScrollPanel";
import { DeleteOutlined } from "@ant-design/icons";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

const CreateTrialPage = () => {
    const [availableScenes, setAvailableScenes] = useState([]);
    const [selectedScenes, setSelectedScenes] = useState([]);
    const [outputPath, setOutputPath] = useState(undefined);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        loadScenes(setAvailableScenes);
        loadTrialOutputPath(setOutputPath);
    }, []);

    useEffect(
        () => () => storeScenes([...availableScenes, ...selectedScenes]),
        [availableScenes, selectedScenes]
    );

    const selectScene = (index) => {
        const selectedScene = availableScenes[index];
        setAvailableScenes([
            ...availableScenes.slice(0, index),
            ...availableScenes.slice(index + 1),
        ]);
        setSelectedScenes([...selectedScenes, selectedScene]);
    };

    const removeSceneFromSelected = (index) => {
        const removedScene = selectedScenes[index];
        setSelectedScenes([
            ...selectedScenes.slice(0, index),
            ...selectedScenes.slice(index + 1),
        ]);
        setAvailableScenes([...availableScenes, removedScene]);
    };

    const renderAvailableScenes = () => {
        const deleteScene = (index) => {
            setAvailableScenes([
                ...availableScenes.slice(0, index),
                ...availableScenes.slice(index + 1),
            ]);
        };
        return availableScenes.map((scene, index) => {
            if (scene.sceneName === undefined) {
                return undefined;
            }
            return (
                // <Button block key={index} onClick={() => selectScene(index)}>
                //     {scene.sceneName}
                // </Button>
                <div key={index} className="available-scene">
                    <Button
                        className="available-scene-button"
                        onClick={() => selectScene(index)}
                    >
                        {scene.sceneName}
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this form entry?"
                        onConfirm={() => deleteScene(index)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            );
        });
    };

    const renderSelectedScenes = () => {
        return selectedScenes.map((scene, index) => {
            if (scene.sceneName === undefined) {
                return undefined;
            }
            return (
                <Button
                    block
                    type="primary"
                    key={index}
                    onClick={() => removeSceneFromSelected(index)}
                >
                    {scene.sceneName}
                </Button>
            );
        });
    };

    const randomizeList = (list) => {
        return list
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value);
    };

    const onGenerateTrial = (values) => {
        if (selectedScenes.length === 0) {
            message.error("Please select at least one scene");
        } else {
            const { fileName, repeatedTimes } = values;
            const preprocessedScenes = [...Array(repeatedTimes).keys()].reduce(
                (list, _i) => list.concat(selectedScenes),
                []
            );
            const processedSelectedScenes = randomizeList(
                preprocessedScenes
            ).map((scene, i) => ({ trialNum: i + 1, ...scene }));
            const trileFile = { trials: processedSelectedScenes };
            saveFile(trileFile, fileName);
        }
    };

    const saveFile = (file, fileName) => {
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
                    storeTrialOutputPath(path);
                    setOutputPath(path);
                    return path;
                } else {
                    throw new Error("No path selected.");
                }
            })
            .then((dirPath) => {
                const filepath = path.join(dirPath, `${fileName}.json`);
                setSubmitted(true);

                fs.writeFileSync(
                    filepath,
                    JSON.stringify(file, null, 4),
                    (error) => {
                        if (error) {
                            console.log(error);
                            setSubmitted(false);
                            alert(`ERROR: Could not save file to ${filepath}`);
                        }
                    }
                );
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
                    title="Successfully generated trial file!"
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
            <Link className="back-button" to="/generateTrialFileHome">
                Back
            </Link>
            <Header
                title="Trial file builder"
                description="Select the desired scenes to be included in the trial file."
            />
            <div className="content">
                <div className="boxes-wrapper">
                    <div className="scenes">
                        <h3>Available Scenes</h3>
                        <div className="box">{renderAvailableScenes()}</div>
                    </div>
                    <div className="scenes">
                        <h3>Selected Scenes</h3>
                        <div className="box">{renderSelectedScenes()}</div>
                        {/* <Button onClick={randomizeSelectedScenes} >Randomize</Button> */}
                    </div>
                </div>
                <div className="form-container">
                    <Form
                        onFinish={onGenerateTrial}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 8 }}
                    >
                        <Form.Item
                            label="File name"
                            name="fileName"
                            initialValue="trial"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input addonAfter=".json" />
                        </Form.Item>
                        <Form.Item
                            label="Repeated times"
                            name="repeatedTimes"
                            initialValue={1}
                            rules={[{ required: true }]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                            <Button block type="primary" htmlType="submit">
                                Generate Trial File
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ScrollPanel>
    );
};

export default CreateTrialPage;
