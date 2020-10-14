const db = window.require("electron").remote.require("./electron").formConfig;
initDatabase();

const CONFIG_ID = "config_form";
const SCENE_ID = "scene_form";
const OBJECT_ID = "object_form";
const TRIAL_ID = "trail";

function loadForm(database_id, callback) {
    db.findOne({ database_id }, (_err, doc) => {
        callback(doc.value.entries);
    });
}

function storeForm(database_id, entries) {
    db.update(
        { database_id: database_id },
        {
            $set: {
                value: {
                    entries,
                },
            },
        }
    );
}

function storeOutputPath(database_id, path) {
    db.update(
        { database_id: database_id },
        {
            $set: { "value.output_path": path },
        }
    );
}

function loadOutputPath(database_id, callback) {
    db.findOne({ database_id: database_id }, (_err, doc) => {
        callback(doc.value.output_path);
    });
}

export const loadObjectForm = (callback) => loadForm(OBJECT_ID, callback);
export const storeObjectForm = (entries) => storeForm(OBJECT_ID, entries);

export const loadSceneForm = (callback) => loadForm(SCENE_ID, callback);
// export const storeSceneForm = (entries) => storeForm(SCENE_ID, entries);

export const loadConfigForm = (callback) => loadForm(CONFIG_ID, callback);
export const storeConfigForm = (entries) => storeForm(CONFIG_ID, entries);
export const loadConfigOutputPath = (callback) =>
    loadOutputPath(CONFIG_ID, callback);
export const storeConfigOutputPath = (path) => storeOutputPath(CONFIG_ID, path);

export const loadTrialOutputPath = (callback) =>
    loadOutputPath(TRIAL_ID, callback);
export const storeTrialOutputPath = (path) => storeOutputPath(TRIAL_ID, path);

const insert = () => {
    db.insert({
        database_id: CONFIG_ID,
        value: {
            entries: [
                {
                    key: "subjNum",
                    label: "Subject Number",
                    type: "number",
                    defaultValue: 1,
                },
                {
                    key: "subjSex",
                    label: "Subject Sex",
                    type: "select",
                    defaultValue: "male",
                    options: { male: "Male", female: "Female", non_binary: "" },
                },
                {
                    key: "something",
                    label: "Test",
                    type: "switch",
                    defaultValue: true,
                },
                {
                    key: "trialFile",
                    label: "Trial file",
                    type: "text",
                    defaultValue: "config",
                    addonAfter: ".json",
                },
                {
                    key: "feedbackColor",
                    label: "Feedback Color",
                    type: "select",
                    defaultValue: "black",
                    options: { black: "Black", blue: "Blue", gray: "Gray" },
                },
                {
                    key: "collectConfidence",
                    label: "Collect Condifence Rating",
                    type: "switch",
                    defaultValue: true,
                },
                {
                    key: "coordinates",
                    label: "Coordinates (X, Y, Z)",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [1, 2, 3],
                },
                {
                    key: "group",
                    label: "Group",
                    type: "number",
                    defaultValue: 1,
                },
            ],
        },
    });

    db.insert({
        database_id: SCENE_ID,
        value: {
            entries: [
                {
                    key: "sceneName",
                    label: "Scene name",
                    type: "text",
                    defaultValue: "name",
                },
                {
                    key: "corrAns",
                    label: "Correct answer",
                    type: "number",
                    defaultValue: 1,
                },
                {
                    key: "playSound",
                    label: "Play sound",
                    type: "switch",
                    defaultValue: false,
                },
                {
                    key: "soundFile",
                    label: "Sound file",
                    type: "text",
                    addonAfter: ".json",
                    defaultValue: "file",
                },
                {
                    key: "numObjects",
                    label: "Number of objects",
                    type: "number",
                    defaultValue: 1,
                },
            ],
        },
    });

    db.insert({
        database_id: OBJECT_ID,
        value: {
            entries: [
                {
                    key: "objType",
                    label: "Object type",
                    type: "select",
                    defaultValue: "car",
                    options: { car: "Car", sphere: "Sphere" },
                },
                {
                    key: "objScale",
                    label: "Object scale",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [1, 1, 1],
                },
                {
                    key: "startPos",
                    label: "Start position",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [1, 1, 1],
                },
                {
                    key: "endPos",
                    label: "End position",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [1, 1, 1],
                },
                {
                    key: "velocity",
                    label: "Velocity",
                    type: "number",
                    defaultValue: 3,
                },
                {
                    key: "timeVisible",
                    label: "Time visible",
                    type: "number",
                    defaultValue: 1,
                },
                {
                    key: "rotationSpeedX",
                    label: "Rotation Speed X",
                    type: "number",
                    defaultValue: 1,
                },
                {
                    key: "rotationSpeedY",
                    label: "Rotation Speed Y",
                    type: "number",
                    defaultValue: 1,
                },
                {
                    key: "rotationSpeedY",
                    label: "Rotation Speed Y",
                    type: "number",
                    defaultValue: 1,
                },
            ],
        },
    });

    db.insert({
        database_id: TRIAL_ID,
        value: {},
    });
};

export function initDatabase() {
    db.count({}, (_err, count) => {
        if (count !== 4) {
            db.remove({}, { multi: true }, (_err, _numRemoved) => {
                insert();
            });
        }
    });
}
