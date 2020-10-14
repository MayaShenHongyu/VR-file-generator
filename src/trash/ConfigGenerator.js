import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import {
    loadConfigForm,
    storeConfigForm,
    setConfigOutputPath,
    getConfigOutputPath,
} from "../database/form_config";
import {
    Layout,
    Col,
    Result,
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Switch,
} from "antd";
import "./layout.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    BasicEntryEditor,
    SelectEntryEditor,
} from "../dynamic_form/EntryEditors";
import { NewEntryForm } from "../dynamic_form/NewEntryForm";

const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
const path = window.require("path");

const labelWidth = 7;
const inputWidth = 14;

const layout = {
    labelCol: { span: labelWidth },
    wrapperCol: { span: inputWidth },
};

const tailLayout = {
    wrapperCol: { offset: labelWidth, span: inputWidth },
};

const makeInputList = (key, size, itemType) => {
    const inputItem = (index, type, style) => {
        if (type === "number") {
            return <InputNumber key={index} style={style} />;
        } else if (type === "text") {
            return <Input key={index} style={style} />;
        }
    };

    const itemWidth = 80 / size;
    const formItems = [...Array(size)].map((_, i) => {
        return (
            <Form.Item key={i} noStyle name={[key, i]}>
                {inputItem(i, itemType, { width: `${String(itemWidth)}%` })}
            </Form.Item>
        );
    });

    return <Input.Group>{formItems}</Input.Group>;
};

const FormEntry = ({ val, removeEntry, changeConfig }) => {
    const [collapsed, setCollapsed] = useState(true);

    const makeSelect = (options) => {
        return (
            <Select style={{ width: "80%" }}>
                {options &&
                    Object.entries(options).map(([key, val], index) => (
                        <Select.Option key={index} value={key}>
                            {val}
                        </Select.Option>
                    ))}
            </Select>
        );
    };

    const input =
        val.type === "number" ? (
            <InputNumber />
        ) : val.type === "switch" ? (
            <Switch />
        ) : val.type === "text" ? (
            <Input style={{ width: "80%" }} addonAfter={val.addonAfter} />
        ) : val.type === "select" ? (
            makeSelect(val.options)
        ) : val.type === "list" ? (
            makeInputList(val.key, val.listSize, val.itemType)
        ) : undefined;

    const editor =
        val.type === "number" || val.type === "text" ? (
            <BasicEntryEditor val={val} submitEdit={changeConfig} />
        ) : val.type === "select" ? (
            <SelectEntryEditor val={val} submitEdit={changeConfig} />
        ) : undefined;

    const validationRule =
        !(val.required === false) && val.type !== "list"
            ? { required: true, message: "Cannot be empty" }
            : !(val.required === false) && val.type === "list"
            ? {
                  validator: (_, value) =>
                      value && value.length === val.listSize
                          ? Promise.resolve()
                          : Promise.reject("All entries must be filled"),
              }
            : undefined;

    return (
        <React.Fragment>
            <Form.Item label={val.label}>
                <Form.Item
                    noStyle
                    name={val.key}
                    rules={validationRule && [validationRule]}
                >
                    {input}
                </Form.Item>
                <div
                    style={{
                        display: "flex",
                        width: "15%",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Button
                        onClick={() => {
                            removeEntry();
                        }}
                        shape="circle"
                        icon={<DeleteOutlined />}
                    />
                    <Button
                        onClick={() => {
                            setCollapsed(!collapsed);
                        }}
                        shape="circle"
                        icon={<EditOutlined />}
                    />
                </div>
            </Form.Item>
            {!collapsed && (
                <Col offset={labelWidth} span={inputWidth - 2}>
                    {editor}
                </Col>
            )}
        </React.Fragment>
    );
};

const ConfigGeneratorForm = () => {
    const [formEntries, setFormEntries] = useState([]);
    const [outputPath, setOutputPath] = useState(undefined);
    const [form] = Form.useForm();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAddingEntry, setIsAddingEntry] = useState(false);

    useEffect(() => {
        loadConfigForm(setFormEntries);
        getConfigOutputPath(setOutputPath);
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [formEntries]);

    useEffect(() => {
        return () => storeConfigForm(formEntries);
    }, [formEntries]);

    const addEntry = (newEntry) => {
        setFormEntries([...formEntries, newEntry]);
    };

    const removeEntry = (index) => {
        setFormEntries([
            ...formEntries.slice(0, index),
            ...formEntries.slice(index + 1),
        ]);
    };

    const changeEntry = (index, newEntry) => {
        setFormEntries([
            ...formEntries.slice(0, index),
            newEntry,
            ...formEntries.slice(index + 1),
        ]);
    };

    const getFormEntry = (val, index) => {
        return (
            <FormEntry
                key={index}
                val={val}
                removeEntry={() => removeEntry(index)}
                changeConfig={(newConfig) => changeEntry(index, newConfig)}
            />
        );
    };

    useEffect(() => {
        const entriesWithInitialVal = formEntries.map((val) => ({
            [val.key]: val.default,
        }));
        form.setFieldsValue(Object.assign({}, ...entriesWithInitialVal));
    }, [formEntries, form]);

    const onFinish = (values) => {
        console.log("Success:", values);
        generateConfig(values);
    };

    const generateConfig = (values) => {
        dialog
            .showOpenDialog({
                properties: ["openDirectory"],
                defaultPath: outputPath,
                title: "Save config file at",
            })
            .then((response) => {
                if (!response.canceled) {
                    // handle fully qualified file name
                    const path = response.filePaths[0];
                    console.log(path);
                    setConfigOutputPath(path);
                    setOutputPath(path);
                    return path;
                } else {
                    throw new Error("no directory selected");
                }
            })
            .then((dirPath) => {
                const filepath = path.join(dirPath, "config.json");
                setSubmitted(true);

                fs.writeFileSync(
                    filepath,
                    JSON.stringify(values, null, 4),
                    (error) => {
                        if (error) {
                            console.log(error);
                            setSubmitted(false);
                            alert(
                                `ERROR: Could not save config.json file to ${filepath}`
                            );
                        }
                    }
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const addEntryButton = (
        <Button type="dashed" onClick={() => setIsAddingEntry(true)} block>
            + Add field
        </Button>
    );

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

    if (loading) {
        return <div></div>;
    }

    return (
        <Layout style={{ height: "100vh", overflow: "hidden" }}>
            <Link className="back-button" to="/">
                Back
            </Link>
            <div style={{ overflow: "scroll" }}>
                <div className="header">
                    <h2>Config File Builder</h2>
                    <p>
                        Enter the experiment parameters to create a basic
                        configuration file that is formatted for use with the VR
                        Simulator. The experimenter will change certain
                        parameters in this file between experiments.
                    </p>
                </div>
                <Layout.Content>
                    <Form
                        {...layout}
                        layout="horizontal"
                        form={form}
                        name="basics"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        {formEntries.map((val, index) =>
                            getFormEntry(val, index)
                        )}
                        <Form.Item {...tailLayout}>{addEntryButton}</Form.Item>
                        <NewEntryForm
                            visible={isAddingEntry}
                            addEntry={addEntry}
                            onCancel={() => setIsAddingEntry(false)}
                        />
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" block>
                                Generate config file
                            </Button>
                        </Form.Item>
                    </Form>
                </Layout.Content>
            </div>
        </Layout>
    );
};

// const NewEntryForm = ({ visible, addEntry, onCancel }) => {

//     const [form, setForm] = useState({});

//     const onValuesChange = (_changedValues, allValues) => {
//         setForm(allValues);
//     };

//     const defaultVal = () => {
//         const input = form.type === "text"
//                     ? <Input />
//                     : form.type  === "number"
//                     ? <InputNumber />
//                     : form.type === "list"
//                     ? makeInputList("default", form.listSize, form.itemType)
//                     : undefined;
//         return (
//             <Form.Item name="default" label="Default value">
//                 {input}
//             </Form.Item>
//         );
//     };

//     const listOptions = () => {
//         return (
//             <React.Fragment>
//                 <Form.Item label="Element type" name="itemType" rules={[{ required: true }]}>
//                     <Select>
//                         <Select.Option value="text">Text</Select.Option>
//                         <Select.Option value="number">Number</Select.Option>
//                     </Select>
//                 </Form.Item>
//                 <Form.Item label="Number of elements" name="listSize" rules={[{ required: true }]}>
//                     <InputNumber max={3} min={1} />
//                 </Form.Item>
//             </React.Fragment>
//         );
//     }

//     const onFinish = (values) => {
//         addEntry(values);
//         onCancel();
//     };

//     const shouldAllowInputDefault = form.type === "number" || form.type === "text" ||
//                 (form.type === "list" && form.listSize !== undefined && form.itemType !== undefined);

//     return (
//         <Modal centered visible={visible} title="Add a new form entry"
//                 onCancel={onCancel}
//                 footer={[]}>
//             <Form {...layout} onValuesChange={onValuesChange} onFinish={onFinish}>
//                 <Form.Item name="label" label="Label" rules={[{ required: true }]}>
//                     <Input placeholder="Displayed label e.g. Gender"/>
//                 </Form.Item>
//                 <Form.Item name="key" label="Key" rules={[{ required: true }]}>
//                     <Input placeholder="Key in generated JSON file e.g. gender" />
//                 </Form.Item>
//                 <Form.Item name="type" label="Type" rules={[{ required: true }]}>
//                     <Select>
//                         <Select.Option value="text">Text</Select.Option>
//                         <Select.Option value="number">Number</Select.Option>
//                         <Select.Option value="list">List</Select.Option>
//                         <Select.Option value="switch">Switch (true or false)</Select.Option>
//                         <Select.Option value="select">Dropdown</Select.Option>
//                     </Select>
//                 </Form.Item>
//                 {form.type === "list" && listOptions()}
//                 {shouldAllowInputDefault && defaultVal()}
//                 <Form.Item name="required" label="Required">
//                     <Switch defaultChecked={true} />
//                 </Form.Item>
//                 <Form.Item wrapperCol={{offset: 17}} >
//                     <Button type="primary" htmlType="submit">Add entry</Button>
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// }

export default ConfigGeneratorForm;
