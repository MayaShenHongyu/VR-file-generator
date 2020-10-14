import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, Switch, Spin } from "antd";
import "../layout.css";

export const labelWidth = 7;
export const inputWidth = 12;

const FormEntry = ({ val }) => {
    const renderInputList = (key, size, itemType) => {
        const inputItem = (index, type, style) => {
            if (type === "number") {
                return <InputNumber key={index} style={style} />;
            } else if (type === "text") {
                return <Input key={index} style={style} />;
            }
        };

        const itemWidth = 100 / size;
        const formItems = [...Array(size)].map((_, i) => {
            return (
                <Form.Item key={i} noStyle name={[key, i]}>
                    {inputItem(i, itemType, { width: `${String(itemWidth)}%` })}
                </Form.Item>
            );
        });

        return <Input.Group>{formItems}</Input.Group>;
    };

    const renderSelect = (options) => {
        return (
            <Select>
                {options &&
                    Object.entries(options).map(([key, val], index) => (
                        <Select.Option key={index} value={key}>
                            {val}
                        </Select.Option>
                    ))}
            </Select>
        );
    };

    const maybeSwitchAddOn =
        val.type === "switch" ? { valuePropName: "checked" } : undefined;

    const input =
        val.type === "number" ? (
            <InputNumber />
        ) : val.type === "switch" ? (
            <Switch />
        ) : val.type === "text" ? (
            <Input addonAfter={val.addonAfter} />
        ) : val.type === "select" ? (
            renderSelect(val.options)
        ) : val.type === "list" ? (
            renderInputList(val.key, val.listSize, val.itemType)
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
        <Form.Item label={val.label}>
            <Form.Item
                noStyle
                name={val.key}
                rules={validationRule && [validationRule]}
                {...maybeSwitchAddOn}
            >
                {input}
            </Form.Item>
        </Form.Item>
    );
};

export const DynamicForm = ({
    formEntries,
    onSubmit,
    submitButtonText,
    initialValues,
}) => {
    const [form] = Form.useForm();
    const [addOns, setAddOns] = useState({});

    useEffect(() => {
        if (formEntries !== undefined) {
            const entriesWithAddOn = formEntries
            .filter((val) => val.addonAfter)
            .map((val) => ({ [val.key]: val.addonAfter }));
        setAddOns(Object.assign({}, ...entriesWithAddOn));
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            const entriesWithInitialVal = formEntries.map((val) => ({
                [val.key]: val.defaultValue,
            }));
            form.setFieldsValue(Object.assign({}, ...entriesWithInitialVal));
        }
        }
    }, [formEntries, form, initialValues]);

    if (formEntries === undefined) {
        return <div className="center" ><Spin size="large" /></div>;
    }

    const getFormEntry = (val, index) => {
        return <FormEntry key={index} val={val} />;
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFinish = (values) => {
        const processedEntries = Object.entries(values).map(([key, val]) => ({
            [key]: addOns[key] ? val + addOns[key] : val,
        }));
        onSubmit(Object.assign({}, ...processedEntries));
    };

    return (
        <Form
            labelCol={{ span: labelWidth }}
            wrapperCol={{ span: inputWidth }}
            layout="horizontal"
            form={form}
            name="dynamic-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            {formEntries.map((val, index) => getFormEntry(val, index))}
            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                <Button type="primary" htmlType="submit" block>
                    {submitButtonText}
                </Button>
            </Form.Item>
        </Form>
    );
};
