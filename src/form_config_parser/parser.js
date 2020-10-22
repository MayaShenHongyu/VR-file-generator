
// Parse a form setting file and return error messages if issues are found.
export const parseFormSetting = (entries) => {
    const errorMessages = [];
    const keys = entries.map(entry => entry.key);
    entries.forEach((entry, index) => {
        const messages = parseEntryDefinition(entry);
        if (keys.indexOf(entry.key) !== index) {
            messages.push(`${entry.key} is a duplicate key.`)
        }
        if (messages.length !== 0) {
            errorMessages.push({ index, messages });
        }
    });

    if (errorMessages.length !== 0) {
        return errorMessages;
    }
};

const parseEntryDefinition = (entryDefinition) => {
    const { key, label, type, tooltip } = entryDefinition;
    const errorMessages = [];
    if (key === undefined || typeof key !== "string") {
        errorMessages.push("Must contain `key`, which should be a string.");
    }

    if (label === undefined || typeof label !== "string") {
        errorMessages.push("Must contain `label`, which should be a string.");
    }

    if (tooltip !== undefined && typeof tooltip !== "string") {
        errorMessages.push("`tooltip` must be a string.")
    }

    switch (type) {
        case "number":
            parseNumber(entryDefinition, errorMessages);
            break;
        case "text":
            parseText(entryDefinition, errorMessages);
            break;
        case "switch":
            parseSwitch(entryDefinition, errorMessages);
            break;
        case "select":
            parseSelect(entryDefinition, errorMessages);
            break;
        case "list":
            parseList(entryDefinition, errorMessages);
            break;
        default:
            errorMessages.push(
                `Must contain \`type\`, which should be one of number, text, switch, select, list.`
            );
    }

    return errorMessages;
};

const parseNumber = (numberEntry, errorMessages) => {
    const { defaultValue } = numberEntry;
    if (defaultValue !== undefined && typeof defaultValue !== "number") {
        errorMessages.push(
            "`defaultValue` of a number entry should be a number"
        );
    }
};

const parseText = (textEntry, errorMessages) => {
    const { defaultValue, addonAfter } = textEntry;
    if (defaultValue !== undefined && typeof defaultValue !== "string") {
        errorMessages.push("`defaultValue` of a text entry should be a string");
    }

    if (addonAfter !== undefined && typeof addonAfter !== "string") {
        errorMessages.push("`addOnAfter` should be a string");
    }
};

const parseSwitch = (switchEntry, errorMessages) => {
    const { defaultValue } = switchEntry;
    if (defaultValue !== undefined && typeof defaultValue !== "boolean") {
        errorMessages.push(
            "`defaultValue` of a switch entry should be `true` or `false`"
        );
    }
};

const parseSelect = (selectEntry, errorMessages) => {
    const { options, defaultValue } = selectEntry;
    if (options === undefined || typeof options !== "object") {
        errorMessages.push(
            "`options` must be and object of the form `{ optionKey: optionLabel }`"
        );
        return;
    }

    if (Object.keys(options).length === 0) {
        errorMessages.push("Must contain at least one option in `options`");
        return;
    }

    Object.keys(options).forEach((key) => {
        if (typeof options[key] !== "string") {
            errorMessages.push(`Option \`${key}\`'s value should be a string`);
        }
    });

    if (
        defaultValue !== undefined &&
        !Object.keys(options).includes(defaultValue)
    ) {
        errorMessages.push(
            `\`defaultValue\` should be one of ${Object.keys(
                options
            ).toString()}`
        );
    }
};

const parseList = (listEntry, errorMessages) => {
    const { listSize, itemType, defaultValue } = listEntry;
    if (
        listSize === undefined ||
        typeof listSize !== "number" ||
        listSize > 4
    ) {
        errorMessages.push(
            "List entry must contain `listSize`, which should be an integer <= 4"
        );
        return;
    }

    if (
        defaultValue !== undefined &&
        (!Array.isArray(defaultValue) || defaultValue.length !== listSize)
    ) {
        errorMessages.push(
            `\`defaultValue\` should be a list of length ${listSize}.`
        );
    }

    const checkIfDefaultListOnlyContainsType = (type) => {
        if (defaultValue !== undefined) {
            const isValid = Array.from(defaultValue).every(
                (val) => typeof val === type
            );
            if (!isValid) {
                errorMessages.push(
                    `\`defaultValue\` should only contain ${type}`
                );
            }
        }
    };

    switch (itemType) {
        case "number":
            checkIfDefaultListOnlyContainsType("number");
            break;
        case "text":
            checkIfDefaultListOnlyContainsType("string");
            break;
        default:
            errorMessages.push(
                "List entry must contain `itemType`, which should be `number` or `text`"
            );
    }
};
