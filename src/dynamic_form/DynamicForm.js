import React, { useEffect } from "react";
import { Form, Button, Spin, message } from "antd";
import { DynamicFormEntry } from "./DynamicFormEntry";
import "../layout.css";

/**
 * DynamicForm is the form configured by a form setting, which is an array of Form Entry Definitions.
 * Please refer to the user manual for information on Form Entry Definition.
 */
export const DynamicForm = ({
    formEntryDefinitions,
    onSubmit,
    submitButtonText,
    initialValues,
    labelWidth = 7,
    inputWidth = 12,
}) => {
    const [form] = Form.useForm();

    /**
     * Some text entires have add-ons (e.g. the `.json` add-on in `File name: *some user input*.json`).
     * Need to extract them and attach them to their corresponding entries after user submits form.
     */
    useEffect(() => {
        if (formEntryDefinitions !== undefined) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                // Extract default values of the entries to initialize the form.
                const defaultValues = formEntryDefinitions.map((val) => ({
                    [val.key]: val.defaultValue,
                }));
                form.setFieldsValue(Object.assign({}, ...defaultValues));
            }
        }
    }, [formEntryDefinitions, initialValues, form]);

    // If form entry definitions is undefined, we are waiting form them to come through from the database.
    if (formEntryDefinitions === undefined) {
        return (
            <div className="center">
                <Spin size="large" />
            </div>
        );
    }

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error(`Failed: ${errorInfo}`);
    };

    const onFinish = (values) => {
        // Add "addonAfter" and "addonBefore" to text results.
        const processedResult = formEntryDefinitions.reduce((acc, entry) => {
            const { key, type } = entry;
            let processedVal = values[key];
            if (type === "text") {
                if (processedVal === undefined || processedVal === "") {
                    processedVal = "";
                } else {
                    const { addonAfter, addonBefore } = entry;
                    const after =
                        addonAfter !== undefined ? addonAfter.text : "";
                    const before =
                        addonBefore !== undefined ? addonBefore.text : "";
                    processedVal = before + processedVal + after;
                }
            }

            return { ...acc, [key]: processedVal };
        }, {});
        onSubmit(processedResult);
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
            {formEntryDefinitions.map((val, index) => (
                <DynamicFormEntry key={index} val={val} />
            ))}
            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                <Button type="primary" htmlType="submit" block>
                    {submitButtonText}
                </Button>
            </Form.Item>
        </Form>
    );
};
