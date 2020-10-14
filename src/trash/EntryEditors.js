import React from "react";
import { Form, Input, Button, Select, InputNumber, Divider } from "antd";
import "../layout.css";

export const makeInputList = (key, size, itemType) => {
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

export const SelectEntryEditor = ({ val, submitEdit }) => {
    const [form] = Form.useForm();
    form.setFieldsValue({ default: val.default });

    const onFinishDefault = (values) => {
        submitEdit({ ...val, ...values });
    };

    const onFinishAddOption = (newOption) => {
        submitEdit({
            ...val,
            options: { ...val.options, [newOption.key]: newOption.label },
        });
    };

    return (
        <div>
            <Divider plain />
            <div className="horizontal-center">
                <Form form={form} onFinish={onFinishDefault} layout="inline">
                    <Form.Item name="default">
                        <Select style={{ width: "20vh" }}>
                            {val.options &&
                                Object.entries(val.options).map(
                                    ([key, val], index) => (
                                        <Select.Option key={index} value={key}>
                                            {val}
                                        </Select.Option>
                                    )
                                )}
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Set default value
                    </Button>
                </Form>
            </div>
            <Divider plain />
            <Form onFinish={onFinishAddOption} layout="horizontal">
                <Form.Item
                    label="Option key"
                    name="key"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Option label"
                    name="label"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <div className="horizontal-center">
                    <Button type="primary" htmlType="submit">
                        Add option
                    </Button>
                </div>
            </Form>
            <Divider plain />
        </div>
    );
};

export const BasicEntryEditor = ({ val, submitEdit }) => {
    const onFinish = (values) => {
        submitEdit({ ...val, ...values });
    };

    const input =
        val.type === "text" ? (
            <Input />
        ) : val.type === "number" ? (
            <InputNumber />
        ) : undefined;

    return (
        <div>
            <Divider plain />
            <div className="horizontal-center">
                <Form
                    initialValues={{ default: val.default }}
                    onFinish={onFinish}
                    layout="inline"
                >
                    <Form.Item name="default">{input}</Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Set default value
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Divider plain />
        </div>
    );
};
