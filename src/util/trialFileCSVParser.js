const parseEntry = (rowIndex, colIndex, stringVal, entryDef, errorMessages) => {
    const { type, label, required } = entryDef;
    const errorHeader = `Row ${rowIndex + 1}, Col ${colIndex + 1}`;

    if (stringVal === undefined) {
        errorMessages.push(`${errorHeader}: entry is undefined.`);
        return undefined;
    }

    const isRequired = required || required === undefined;

    if (isRequired && stringVal === "") {
        errorMessages.push(
            `${errorHeader}: entry "${label}" is a required field but input is empty.`
        );
        return undefined;
    }

    switch (type) {
        case "text": {
            const { addonAfter } = entryDef;

            if (
                stringVal !== "" &&
                addonAfter &&
                !stringVal.includes(addonAfter.text)
            ) {
                errorMessages.push(
                    `${errorHeader}: entry "${stringVal}" (${label}) should have suffix "${addonAfter.text}".`
                );
            }

            return stringVal;
        }
        case "number": {
            const { max, min } = entryDef;
            const number = Number(stringVal);
            if (isNaN(number)) {
                errorMessages.push(
                    `${errorHeader}: entry "${stringVal}" (${label}) should be a number.`
                );
            }
            const newMax = max ?? Infinity;
            const newMin = min ?? -Infinity;
            if (number > newMax || number < newMin) {
                errorMessages.push(
                    `${errorHeader}: entry "${stringVal}" (${label}) should be in range [${newMin}, ${newMax}].`
                );
            }
            return number;
        }
        case "switch": {
            switch (stringVal) {
                case "T":
                    return true;
                case "F":
                    return false;
                default:
                    errorMessages.push(
                        `${errorHeader}: entry "${stringVal}" (${label}) should be "T" or "F".`
                    );
                    return undefined;
            }
        }
        case "select": {
            const optionKeys = Object.keys(entryDef.options);
            if (optionKeys.includes(stringVal)) {
                return stringVal;
            }
            errorMessages.push(
                `${errorHeader}: entry "${stringVal}" (${label}) shoud be one of ${optionKeys.join(
                    ","
                )}.`
            );
            return undefined;
        }

        case "list": {
            const { listSize, itemType } = entryDef;
            if (stringVal[0] !== "\"" || stringVal[stringVal.length - 1] !== "\"") {
                errorMessages.push(
                    `${errorHeader}: entry "${stringVal}" (${label}) should be in quotation marks.`
                );
                return undefined;
            }
            const splittedStrings = stringVal.slice(1, -1).split(",").map(str => str.trim());
            if (
                listSize !== splittedStrings.length ||
                splittedStrings.includes("")
            ) {
                errorMessages.push(
                    `${errorHeader}: entry "${stringVal}" (${label}) should be a list of size ${listSize}, splitted by commas.`
                );
                return undefined;
            }

            // If itemType is text, we don't need further processing.
            if (itemType === "text") return splittedStrings;

            // If itemType is number, we need to convert the strings to numbers.
            const numbers = splittedStrings.map((val) => Number(val));
            if (numbers.includes(NaN)) {
                errorMessages.push(
                    `${errorHeader}: entry "${stringVal}" (${label}) should be a list of numbers.`
                );
                return undefined;
            }
            return numbers;
        }

        default:
            errorMessages.push(`${errorHeader}: entry "${stringVal}" has unrecognized type ${type}.`)
            return undefined;
    }
};

export const parseCSV = (fileData, sceneFormSetting, objectFormSetting) => {
    const errorMessages = [];
    const scenes = [];

    if (fileData.length < 2) {
        errorMessages.push(
            "CSV file row count < 2. lease make sure that the entry labels are in the first row, and that there is at least one object. "
        );
        return { scenes, errorMessages };
    }

    const expectedRowSize =
        sceneFormSetting.length + 4 * objectFormSetting.length;

    const sceneFormSettingLabels = sceneFormSetting.map(
        (entryDef) => entryDef.label
    );
    const objectFormSettingLables = objectFormSetting.map(
        (entryDef) => entryDef.label
    );

    if (fileData[0].length !== expectedRowSize) {
        errorMessages.push(
            `There should be ${expectedRowSize} columns but you have ${fileData[0].length}. They are:\n\n` +
                `${sceneFormSettingLabels.join(", ")};\n\n` +
                `Then followed by four repeates of: \n\n${objectFormSettingLables.join(
                    ", "
                )}.`
        );
        return { scenes, errorMessages };
    }

    const labels = [
        ...sceneFormSettingLabels,
        ...new Array(4).fill(objectFormSettingLables).flat(),
    ];

    for (let col = 0; col < expectedRowSize; col++) {
        if (!fileData[0][col].includes(labels[col])) {
            errorMessages.push(
                `Row ${1}, Col ${col + 1}: column name should contain ${
                    labels[col]
                }`
            );
        }
    }
    if (errorMessages.length > 0) {
        return { scenes, errorMessages };
    }

    for (let row = 1; row < fileData.length; row++) {
        if (fileData[row][0] === "") {
            break;
        }

        const sceneInfo = {};
        for (let col = 0; col < sceneFormSetting.length; col++) {
            const entryDef = sceneFormSetting[col];
            sceneInfo[entryDef.key] = parseEntry(
                row,
                col,
                fileData[row][col],
                entryDef,
                errorMessages
            );
        }
        const numObjects = sceneInfo["numObjects"];
        delete sceneInfo["numObjects"];

        if (numObjects < 1 || numObjects > 4) {
            return {
                scenes,
                errorMessages: [
                    `Row ${
                        row + 1
                    }: You can only have 1 - 4 objects, but you want ${numObjects}.`,
                ],
            };
        }

        const objects = [];
        for (let objIndex = 0; objIndex < numObjects; objIndex++) {
            const object = { objNum: objIndex + 1 };
            const colStart =
                sceneFormSetting.length + objIndex * objectFormSetting.length;
            for (
                let entryDefIndex = 0;
                entryDefIndex < objectFormSetting.length;
                entryDefIndex++
            ) {
                const entryDef = objectFormSetting[entryDefIndex];
                const col = colStart + entryDefIndex;
                object[entryDef.key] = parseEntry(
                    row,
                    col,
                    fileData[row][col],
                    entryDef,
                    errorMessages
                );
            }
            objects.push(object);
        }
        const scene = { ...sceneInfo, objects: objects };
        scenes.push(scene);
    }

    return { scenes, errorMessages };
};
