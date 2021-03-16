import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    loadSceneFormSetting,
    loadObjectFormSetting,
} from "../database/formSettingsDB";
import {
    Button,
    Input,
    Result,
    message,
    Spin,
    Form,
    InputNumber,
    Switch,
} from "antd";
import "../layout.css";
import { ScrollPanel } from "../ScrollPanel";
import { Header } from "../Header";
import { parseCSV } from "../util/trialFileCSVParser";
import { randomizeList } from "../util/functions";
import {
    loadTrialOutputPath,
    storeTrialOutputPath,
} from "../database/formSettingsDB";

const { dialog } = window.require("electron").remote;
const parse = window.require("csv-parse");
const fs = window.require("fs");
const path = window.require("path");

/**
 * This is the page where the user converts a CSV file containing a list of scenes
 * to a JSON format trial file.
 */
export const CSVTrialFileConverter = () => {
    const [sceneFormSetting, setSceneFormSetting] = useState(undefined);
    const [objectFormSetting, setObjectFormSetting] = useState(undefined);

    const [errorMessages, setErrorMessages] = useState(undefined);
    const [parsedScenes, setParsedScenes] = useState(undefined);
    const [isProcessingCSV, setIsProcessingCSV] = useState(false);
    const [finishedGeneratingJSON, setFinishedGeneratingJSON] = useState(false);

    const [outputPath, setOutputPath] = useState(undefined);

    useEffect(() => {
        loadSceneFormSetting(setSceneFormSetting);
        loadObjectFormSetting(setObjectFormSetting);
        loadTrialOutputPath(setOutputPath);
    }, []);

    // File selection dialog
    const loadCSVFile = () => {
        dialog
            .showOpenDialog({
                properties: ["openFile"],
                filters: [{ name: "CSV files", extensions: ["csv"] }],
                title: "Select CSV file",
            })
            .then((response) => {
                if (!response.canceled) {
                    const path = response.filePaths[0];
                    fs.readFile(path, (err, fileData) => {
                        if (err) {
                            message.error(`${String(err)}.`);
                        } else {
                            processCSVFile(fileData);
                        }
                    });
                    setIsProcessingCSV(true);
                }
            })
            .catch((err) => {
                message.error(`${String(err)}.`);
            });
    };

    const processCSVFile = (fileData) => {
        parse(
            fileData,
            {
                skip_empty_lines: true,
                trim: true,
            },
            (error, rows) => {
                if (error) {
                    message.error(`${String(error)}.`);
                }
                const { scenes, errorMessages } = parseCSV(
                    rows,
                    sceneFormSetting,
                    objectFormSetting
                );
                errorMessages.forEach((error) => console.log(error));
                if (errorMessages.length === 0) {
                    setParsedScenes(scenes);
                } else {
                    setErrorMessages(errorMessages);
                }
                setIsProcessingCSV(false);
            }
        );
    };

    const maybeRenderErrorMessages = () => {
        if (errorMessages === undefined) return undefined;
        return (
            <div>
                <h4 style={{ color: "red" }}>Errors:</h4>
                <Input.TextArea rows={10} value={errorMessages.join("\n")} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        justifyContent: "space-between",
                        marginTop: 30,
                    }}
                >
                    <Button onClick={() => setErrorMessages(undefined)}>
                        Cancel
                    </Button>
                </div>
            </div>
        );
    };

    const maybeRenderParsedScenesAndGenerateFileButton = () => {
        if (parsedScenes === undefined) return undefined;
        return (
            <div>
                <h4>Scenes parsed from the CSV file:</h4>
                <Input.TextArea
                    rows={10}
                    value={JSON.stringify(parsedScenes, null, 4)}
                />
                <div className="medium-margin">
                    <Form
                        onFinish={onClickGenerateTrialFile}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 8 }}
                    >
                        <Form.Item
                            label="Trial file name"
                            name="fileName"
                            initialValue="trial"
                            rules={[{ required: true }]}
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
                        <Form.Item
                            label="Randomize scenes"
                            name="randomize"
                            initialValue={true}
                            rules={[{ required: true }]}
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    onClick={() => setParsedScenes(undefined)}
                                >
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Generate trial file
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    };

    const onClickGenerateTrialFile = (values) => {
        const { fileName, repeatedTimes, randomize } = values;

        // Repeat the scenes for `repeatedTimes` times
        let trials = [...Array(repeatedTimes).keys()].reduce(
            (list, _i) => list.concat(parsedScenes),
            []
        );
        if (randomize) {
            trials = randomizeList(trials);
        }
        // Randomize the scenes, add `trialNum` and `trialName` to each scene.
        const processedTrials = trials.map((scene, i) => {
            const trial = {
                trialNum: i + 1,
                trialName: scene.sceneName ?? `Scene ${i + 1}`,
                ...scene,
            };
            delete trial.sceneName;
            return trial;
        });
        const trialFile = { trials: processedTrials };
        generateTrialFile(trialFile, fileName);
    };

    // Dialog for user to select where to output the file
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
                setFinishedGeneratingJSON(true);
                fs.writeFileSync(
                    filepath,
                    JSON.stringify(file, null, 4),
                    (error) => {
                        if (error) {
                            console.log(error);
                            setFinishedGeneratingJSON(false);
                            alert(`ERROR: Could not save file to ${filepath}`);
                        }
                    }
                );
            })
            .catch((err) => {
                message.error(`${String(err)}`);
            });
    };

    const maybeRenderParseCSVFileButton = () => {
        if (parsedScenes !== undefined || errorMessages !== undefined)
            return undefined;

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "30vh",
                    alignItems: "center",
                }}
            >
                <Button onClick={loadCSVFile} size="large" type="primary">
                    Parse CSV file
                </Button>
            </div>
        );
    };

    if (isProcessingCSV || !sceneFormSetting || !objectFormSetting) {
        return (
            <div className="center">
                <Spin size="large" />
            </div>
        );
    }

    if (finishedGeneratingJSON) {
        return (
            <div className="center">
                <Result
                    status="success"
                    title="Successfully generated trial file!"
                    subTitle={`You can find the file at ${outputPath}`}
                    extra={[
                        <Link
                            key={"back"}
                            className="App-link"
                            to="/generateTrialFileHome"
                        >
                            Go back
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
                title="Generate trial file from CSV"
                description={
                    "Import a CSV file containing a list a scenes (see User Manual for format specification). The program will convert it to a JSON format trial file."
                }
            />
            {maybeRenderParseCSVFileButton()}
            <div style={{ margin: "0 10vw" }}>
                {maybeRenderErrorMessages()}
                {maybeRenderParsedScenesAndGenerateFileButton()}
            </div>
        </ScrollPanel>
    );
};
