// Load database from electron main process
const formSettingsDB = window.require("electron").remote.require("./electron").formConfig;

const CONFIG_ID = "config_form";
const SCENE_ID = "scene_form";
const OBJECT_ID = "object_form";
const TRIAL_ID = "trail";

initDatabase();

// Storing and retrieving object form setting
export const loadObjectFormSetting = (callback) => loadFormSetting(OBJECT_ID, callback);
export const storeObjectFormSetting = (entries) => storeFormSetting(OBJECT_ID, entries);

// Retrieving scene form setting
export const loadSceneFormSetting = (callback) => loadFormSetting(SCENE_ID, callback);

// Storing and retrieving configuration file form setting
export const loadConfigFormSetting = (callback) => loadFormSetting(CONFIG_ID, callback);
export const storeConfigFormSetting = (entries) => storeFormSetting(CONFIG_ID, entries);

// Storing and retrieving default output path of generated configuration files
export const loadConfigOutputPath = (callback) =>
    loadOutputPath(CONFIG_ID, callback);
export const storeConfigOutputPath = (path) => storeOutputPath(CONFIG_ID, path);

// Storing and retrieving default output path of generated trial files
export const loadTrialOutputPath = (callback) =>
    loadOutputPath(TRIAL_ID, callback);
export const storeTrialOutputPath = (path) => storeOutputPath(TRIAL_ID, path);

/**
 * Generic helper function for retrieving form setting.
 * @param {string} database_id 
 * @param {Array[Object] => void} callback 
 */
function loadFormSetting(database_id, callback) {
    formSettingsDB.findOne({ database_id }, (_err, doc) => {
        callback(doc.value.entries);
    });
}

/**
 * Generic helper function for storing form setting.
 * @param {string} database_id 
 * @param {Array[Object]} entries 
 */
function storeFormSetting(database_id, entries) {
    formSettingsDB.update(
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

/**
 * Generic helper function for storing default output path.
 * @param {string} database_id 
 * @param {string} path 
 */
function storeOutputPath(database_id, path) {
    formSettingsDB.update(
        { database_id: database_id },
        {
            $set: { "value.output_path": path },
        }
    );
}

/**
 * Generic helper function for storing default output path.
 * @param {string} database_id 
 * @param {string => void} callback 
 */
function loadOutputPath(database_id, callback) {
    formSettingsDB.findOne({ database_id: database_id }, (_err, doc) => {
        callback(doc.value.output_path);
    });
}

/**
 * Populate the database with initial form settings.
 */
const populateDBDefault = () => {
    formSettingsDB.insert({
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

    formSettingsDB.insert({
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

    formSettingsDB.insert({
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

    formSettingsDB.insert({
        database_id: TRIAL_ID,
        value: {},
    });
};

/**
 * Initialize the database. If database is corrupted, remove everything and populate it again.
 */
function initDatabase() {
    // console.log(formDB);
    formSettingsDB.count({}, (_err, count) => {
        if (count !== 4) {
            formSettingsDB.remove({}, { multi: true }, (_err, _numRemoved) => {
                populateDBDefault();
            });
        }
    });
}
