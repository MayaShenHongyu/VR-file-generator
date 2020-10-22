import React, { useState, useEffect } from "react";
import { Form, Button, Spin, message } from "antd";
import { DynamicFormEntry } from "./DynamicFormEntry";
import "../layout.css";

// const FormEntry = ({ val }) => {
//     const renderInputList = (key, size, itemType) => {
//         const inputItem = (index, type, style) => {
//             if (type === "number") {
//                 return <InputNumber key={index} style={style} />;
//             } else if (type === "text") {
//                 return <Input key={index} style={style} />;
//             }
//         };

//         const itemWidth = 100 / size;
//         const formItems = [...Array(size)].map((_, i) => {
//             return (
//                 <Form.Item key={i} noStyle name={[key, i]}>
//                     {inputItem(i, itemType, { width: `${String(itemWidth)}%` })}
//                 </Form.Item>
//             );
//         });

//         return <Input.Group>{formItems}</Input.Group>;
//     };

//     const renderSelect = (options) => {
//         return (
//             <Select>
//                 {options &&
//                     Object.entries(options).map(([key, val], index) => (
//                         <Select.Option key={index} value={key}>
//                             {val}
//                         </Select.Option>
//                     ))}
//             </Select>
//         );
//     };

//     const getAdditionalRules = () => {
//         const checkValid = (e) => e !== null && e !== undefined;
//         const validationRule = val.type !== "list"
//             ? { required: true, message: "Cannot be empty" }
//             : {
//                   validator: (_, value) =>
//                       value && value.length === val.listSize && value.every(checkValid)
//                           ? Promise.resolve()
//                           : Promise.reject("All entries must be filled"),
//               };
//         const maybeSwitchAddOn = val.type === "switch" ? { valuePropName: "checked" } : {};
//         return { rules: [validationRule], ...maybeSwitchAddOn };
//     }

//     const maybeSwitchAddOn =
//         val.type === "switch" ? { valuePropName: "checked" } : undefined;

//     const input =
//         val.type === "number" ? (
//             <InputNumber />
//         ) : val.type === "switch" ? (
//             <Switch />
//         ) : val.type === "text" ? (
//             <Input addonAfter={val.addonAfter} />
//         ) : val.type === "select" ? (
//             renderSelect(val.options)
//         ) : val.type === "list" ? (
//             renderInputList(val.key, val.listSize, val.itemType)
//         ) : undefined;

//     const validationRule = val.type !== "list"
//             ? { required: true, message: "Cannot be empty" }
//             : {
//                   validator: (_, value) =>
//                       value && value.length === val.listSize
//                           ? Promise.resolve()
//                           : Promise.reject("All entries must be filled"),
//               };

//     return (
//         <Form.Item
//             label={val.label}
//             name={val.key}
//             tooltip={val.tooltip}
//             // rules={validationRule && [validationRule]}
//             // {...maybeSwitchAddOn}
//             {...getAdditionalRules()}
//         >
//             {input}
//         </Form.Item>
//     );
// };


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
    inputWidth = 12
}) => {
    const [form] = Form.useForm();
    const [addOns, setAddOns] = useState({});

    useEffect(() => {
        if (formEntryDefinitions !== undefined) {
            /**
             * Some text entires have add-ons (e.g. the `.json` add-on in `File name: *some user input*.json`).
             * Need to extract them and later on attach them to their corresponding entries after user submits form.
             */
            const entriesWithAddOn = formEntryDefinitions
                .filter((val) => val.addonAfter)
                .map((val) => ({ [val.key]: val.addonAfter }));
            setAddOns(Object.assign({}, ...entriesWithAddOn));

            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                // Extract default values of the entries to initialize the form
                const defaultValues = formEntryDefinitions.map((val) => ({
                    [val.key]: val.defaultValue,
                }));
                form.setFieldsValue(Object.assign({}, ...defaultValues));
            }
        }
    }, [formEntryDefinitions, initialValues, form]);

    // If form entry definitions is undefined, we are waiting form them to come through from the database.
    if (formEntryDefinitions === undefined) {
        return <div className="center" ><Spin size="large" /></div>;
    }

    // const getFormEntry = (val, index) => {
    //     return <DynamicFormEntry key={index} val={val} />;
    // };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error(`Failed: ${errorInfo}`);
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
            {formEntryDefinitions.map((val, index) => <DynamicFormEntry key={index} val={val} />)}
            <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
                <Button type="primary" htmlType="submit" block>
                    {submitButtonText}
                </Button>
            </Form.Item>
        </Form>
    );
};
