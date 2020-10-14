import React, { useState } from "react";
import { Form, Input, Button, Select, InputNumber, Modal, Switch } from "antd";
import { makeInputList } from "./EntryEditors";

const labelWidth = 7;
const inputWidth = 14;

const layout = {
    labelCol: { span: labelWidth },
    wrapperCol: { span: inputWidth },
};

const tailLayout = {
    wrapperCol: { offset: labelWidth, span: inputWidth },
};

export const NewEntryForm = ({ visible, addEntry, onCancel }) => {
    const [fields, setFields] = useState({});
    const [form] = Form.useForm();

    const onValuesChange = (_changedValues, allValues) => {
        setFields(allValues);
    };

    const defaultVal = () => {
        const input =
            fields.type === "text" ? (
                <Input />
            ) : fields.type === "number" ? (
                <InputNumber />
            ) : fields.type === "list" ? (
                makeInputList("default", fields.listSize, fields.itemType)
            ) : undefined;
        return (
            <Form.Item name="default" label="Default value">
                {input}
            </Form.Item>
        );
    };

    const listOptions = () => {
        return (
            <React.Fragment>
                <Form.Item
                    label="Element type"
                    name="itemType"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="text">Text</Select.Option>
                        <Select.Option value="number">Number</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Number of elements"
                    name="listSize"
                    rules={[{ required: true }]}
                >
                    <InputNumber max={3} min={1} />
                </Form.Item>
            </React.Fragment>
        );
    };

    const onFinish = (values) => {
        addEntry(values);
        onModalClose();
    };

    const onModalClose = () => {
        onCancel();
        form.resetFields();
    };

    const shouldAllowInputDefault =
        fields.type === "number" ||
        fields.type === "text" ||
        (fields.type === "list" &&
            fields.listSize !== undefined &&
            fields.itemType !== undefined);

    return (
        <Modal
            centered
            width={"80vw"}
            visible={visible}
            title="Add a new form entry"
            onCancel={onModalClose}
            footer={[]}
        >
            <Form
                {...layout}
                form={form}
                onValuesChange={onValuesChange}
                onFinish={onFinish}
            >
                <Form.Item
                    name="label"
                    label="Label"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Displayed label e.g. Gender" />
                </Form.Item>
                <Form.Item name="key" label="Key" rules={[{ required: true }]}>
                    <Input placeholder="Key in generated JSON file e.g. gender" />
                </Form.Item>
                <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="text">Text</Select.Option>
                        <Select.Option value="number">Number</Select.Option>
                        <Select.Option value="list">List</Select.Option>
                        <Select.Option value="switch">
                            Switch (true or false)
                        </Select.Option>
                        <Select.Option value="select">Dropdown</Select.Option>
                    </Select>
                </Form.Item>
                {fields.type === "list" && listOptions()}
                {shouldAllowInputDefault && defaultVal()}
                <Form.Item name="required" label="Required">
                    <Switch defaultChecked={true} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 17 }}>
                    <Button type="primary" htmlType="submit">
                        Add entry
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
