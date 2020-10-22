import React, { useState } from "react";
// import "./App.css";
import {
    Modal,
    Form,
    InputNumber,
    Col,
    Popconfirm,
    Input,
    Switch,
    Select,
    Button,
    Divider,
    message,
} from "antd";
import "./layout.css";
import "./FormEditor.css";
import { NewEntryForm } from "../dynamic_form/NewEntryForm";

export const labelWidth = 7;
export const inputWidth = 14;

const layout = {
    labelCol: { span: labelWidth },
    wrapperCol: { span: inputWidth },
};

const FormEditor = ({ formEntries, updateFormEntries, title }) => {
    const [isAddingEntry, setIsAddingEntry] = useState(false);

    const addEntry = (newEntry) => {
        updateFormEntries([...formEntries, newEntry]);
    };

    const removeEntry = (index) => {
        updateFormEntries([
            ...formEntries.slice(0, index),
            ...formEntries.slice(index + 1),
        ]);
    };

    const modifyEntry = (index, newEntry) => {
        updateFormEntries([
            ...formEntries.slice(0, index),
            newEntry,
            ...formEntries.slice(index + 1),
        ]);
    };

    const getEntries = () =>
        formEntries.map((val, index) => {
            const onRemove = () => removeEntry(index);
            const onUpdate = (newEntry) => modifyEntry(index, newEntry);
            return (
                <Entry
                    key={index}
                    val={val}
                    onRemove={onRemove}
                    onUpdate={onUpdate}
                />
            );
        });

    const getMaybeTitle = () => {
        if (title) {
            return (
                <Divider style={{ fontSize: "1.2em", marginTop: 0 }} plain>
                    {title}
                </Divider>
            );
        }
    };

    const addEntryButton = (
        <Button type="dashed" onClick={() => setIsAddingEntry(true)} block>
            + Add field
        </Button>
    );

    return (
        <div style={{ paddingBottom: "1.5em" }}>
            <div className="editor">
                {getMaybeTitle()}
                {getEntries()}
            </div>
            <Col offset={9} span={6}>
                {addEntryButton}
            </Col>
            <NewEntryForm
                visible={isAddingEntry}
                addEntry={addEntry}
                onCancel={() => setIsAddingEntry(false)}
            />
        </div>
    );
};

const Entry = ({ val, onRemove, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const onRemoveHelper = () => {
        setIsEditing(false);
        setTimeout(onRemove, 100);
    };

    const toggleCollapsed = () => {
        setIsEditing(!isEditing);
        console.log(isEditing);
    };

    const submitChangeButton = (
        <Button
            style={{ marginLeft: "1em" }}
            type="primary"
            onClick={toggleCollapsed}
        >
            Ok
        </Button>
    );
    const deleteButton = (
        <Popconfirm
            title="Are you sure to delete this form entry?"
            onConfirm={onRemoveHelper}
            okText="Yes"
            cancelText="No"
        >
            <Button href="#" danger>
                Delete item
            </Button>
        </Popconfirm>
    );
    const getModal = () => {
        return (
            <Modal
                centered
                visible={isEditing}
                title={`Edit entry: ${val.label}`}
                onCancel={toggleCollapsed}
                footer={[deleteButton, submitChangeButton]}
                width="80vw"
            >
                <EntryEditor val={val} onUpdate={onUpdate} />
            </Modal>
        );
    };

    return (
        <div className="entry">
            <div
                className="entry-title"
                onClick={!isEditing ? toggleCollapsed : undefined}
            >
                <div className="label">
                    <span>{`${val.label}:`}</span>
                </div>
                <div>{getCustomInput(val.type, val)}</div>
            </div>
            {getModal()}
        </div>
    );
};

const EntryEditor = ({ val, onUpdate }) => {
    const onFinishAddOption = (newOption) => {
        message.success("Successfully added new option.");
        onUpdate({
            ...val,
            options: { ...val.options, [newOption.key]: newOption.label },
        });
    };

    const maybeAddOptionForm = () => {
        if (val.type === "select") {
            return (
                <div className="entry-editor-add-option">
                    <Divider plain />
                    <Form
                        onFinish={onFinishAddOption}
                        layout="horizontal"
                        {...layout}
                    >
                        <Form.Item
                            label="Option key"
                            name="key"
                            rules={[{ required: true }]}
                        >
                            <Input
                                width={"50%"}
                                placeholder="Value in JSON file"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Option label"
                            name="label"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Name in the dropdown list" />
                        </Form.Item>
                        <div className="horizontal-center">
                            <Button type="primary" htmlType="submit">
                                Add option
                            </Button>
                        </div>
                    </Form>
                </div>
            );
        }
    };
    const onSetUndefined = (values) => {
        console.log(values);
        onUpdate({ ...val, ...values });
    };

    const defaultVal = val.default === undefined ? "undefined" : val.default;
    return (
        <div className="entry-editor">
            <div className="entry-editor-subsection">
                <div>{`Current default: ${defaultVal}`}</div>
                <Form onFinish={onSetUndefined} layout="inline">
                    <Form.Item name="default">
                        {getCustomInput(val.type, val, "default")}
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Set default
                    </Button>
                </Form>
            </div>
            {maybeAddOptionForm()}
        </div>
    );
};

const getCustomInput = (type, val, key, index, style) => {
    if (type === "number") {
        return <InputNumber key={index} />;
    } else if (type === "text") {
        return <Input style={style} key={index} addonAfter={val.addonAfter} />;
    } else if (type === "switch") {
        return <Switch />;
    } else if (type === "select") {
        return (
            <Select style={{ minWidth: "15vw" }}>
                {val.options &&
                    Object.entries(val.options).map(([k, v], index) => (
                        <Select.Option key={index} value={k}>
                            {v}
                        </Select.Option>
                    ))}
            </Select>
        );
    } else if (type === "list") {
        const style = { width: `${100 / val.listSize}%` };

        const formItems = [...Array(val.listSize)].map((_, i) => {
            return (
                <Form.Item key={i} noStyle name={[key, i]}>
                    {getCustomInput(val.itemType, val, "", i, style)}
                </Form.Item>
            );
        });

        return <Input.Group>{formItems}</Input.Group>;
    }
};

export default FormEditor;
