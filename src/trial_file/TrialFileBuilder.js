import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadScenes, storeScenes } from "../database/scenesDB";
import {
    loadTrialOutputPath,
    storeTrialOutputPath,
} from "../database/formSettingsDB";
import { Header } from "../Header";
import {
    Form,
    Input,
    Button,
    Result,
    message,
    InputNumber,
    Popconfirm,
} from "antd";
import "../layout.css";
import "./TrialFileBuilder.css";
import { ScrollPanel } from "../ScrollPanel";
import { DeleteOutlined } from "@ant-design/icons";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

// Helper method for randomizing the elements in a list
const randomizeList = (list) =>
    list
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);

/**
 * Page for users to generated trial files by selecting avaliable scenes.
 */
export const TrialFileBuilder = () => {
    const [availableScenes, setAvailableScenes] = useState(undefined);
    const [selectedScenes, setSelectedScenes] = useState([]);
    const [outputPath, setOutputPath] = useState(undefined);
    const [finishedGeneratingFile, setFinishedGeneratingFile] = useState(false);

    useEffect(() => {
        loadScenes(setAvailableScenes);
        loadTrialOutputPath(setOutputPath);
    }, []);

    // useEffect(() => {
    //     console.log(`After available scenes change: ${availableScenes ? availableScenes.map(s => s.sceneName) : availableScenes}`);
    // }, [availableScenes]);

    // Stores updated scenes to the database
    useEffect(() => {
        if (availableScenes !== undefined) {
            // console.log(`cleanup: ${availableScenes.map(s => s.sceneName)}`)
            storeScenes([...availableScenes, ...selectedScenes]);
        }
    }, [availableScenes, selectedScenes]);

    // Select the scene at a specific index in availableScenes
    const selectScene = (index) => {
        const selectedScene = availableScenes[index];
        setAvailableScenes([
            ...availableScenes.slice(0, index),
            ...availableScenes.slice(index + 1),
        ]);
        setSelectedScenes([...selectedScenes, selectedScene]);
    };

    // Move the scene at a specific index in selectedScenes back to availableScenes
    const removeSceneFromSelected = (index) => {
        const removedScene = selectedScenes[index];
        setSelectedScenes([
            ...selectedScenes.slice(0, index),
            ...selectedScenes.slice(index + 1),
        ]);
        setAvailableScenes([...availableScenes, removedScene]);
    };

    // Delete a scene at a specific index in selectedScenes
    const deleteScene = (index) => {
        setAvailableScenes([
            ...availableScenes.slice(0, index),
            ...availableScenes.slice(index + 1),
        ]);
    };

    const renderAvailableScenes = () => {
        if (availableScenes === undefined) {
            // console.log("Render available scenes: undefined")
            return undefined;
        }
        // console.log(`Render available scenes: ${availableScenes.map(s => s.sceneName)}`);
        return availableScenes.map((scene, index) => {
            return (
                <div key={index} className="available-scene">
                    <Button
                        className="available-scene-button"
                        onClick={() => selectScene(index)}
                    >
                        {scene.sceneName ?? `Scene ${index + 1}`}
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this scene?"
                        onConfirm={() => deleteScene(index)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button href="#" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            );
        });
    };

    const renderSelectedScenes = () => {
        return selectedScenes.map((scene, index) => {
            return (
                <Button
                    block
                    type="primary"
                    key={index}
                    onClick={() => removeSceneFromSelected(index)}
                >
                    {scene.sceneName ?? `Scene ${index + 1}`}
                </Button>
            );
        });
    };

    const onSubmit = (values) => {
        if (selectedScenes.length === 0) {
            message.error("Please select at least one scene");
        } else {
            const { fileName, repeatedTimes } = values;
            // Repeat the scenes for `repeatedTimes` times
            const trials = [...Array(repeatedTimes).keys()].reduce(
                (list, _i) => list.concat(selectedScenes),
                []
            );
            // Randomize the scenes, add `trialNum` and `trialName` to each scene.
            const processedTrials = randomizeList(trials).map((scene, i) => {
                const trial = {
                    trialNum: i + 1,
                    trialName: scene.sceneName ?? `Scene ${i + 1}`,
                    ...scene,
                };
                delete trial.sceneName;
                return trial;
            });
            const trileFile = { trials: processedTrials };
            generateTrialFile(trileFile, fileName);
        }
    };

    // Dialog for user to select where to generate the file
    const generateTrialFile = (file, fileName) => {
        dialog
            .showOpenDialog({
                properties: ["openDirectory"],
                defaultPath: outputPath,
                title: "Save file at (please select folder/path)",
            })
            .then((response) => {
                if (!response.canceled) {
                    // Handle fully qualified file name
                    const path = response.filePaths[0];
                    setOutputPath(path);
                    // Store this path into the database so that next time this dialog will automatically navigate to that location
                    storeTrialOutputPath(path);
                    return path;
                } else {
                    throw new Error("No path selected.");
                }
            })
            .then((dirPath) => {
                const filepath = path.join(dirPath, `${fileName}.json`);
                setFinishedGeneratingFile(true);
                fs.writeFileSync(
                    filepath,
                    JSON.stringify(file, null, 4),
                    (error) => {
                        if (error) {
                            console.log(error);
                            setFinishedGeneratingFile(false);
                            alert(`ERROR: Could not save file to ${filepath}`);
                        }
                    }
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Render a success notification if successully generated the file
    if (finishedGeneratingFile) {
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
            <Link className="back-button" to="/manualInput">
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
                        onFinish={onSubmit}
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
                                Generate trial file
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ScrollPanel>
    );
};
