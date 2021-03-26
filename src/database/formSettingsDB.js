// Load database from electron main process
const formSettingsDB = window.require("electron").remote.require("./electron")
    .formConfig;

const CONFIG_ID = "config_form";
const SCENE_ID = "scene_form";
const OBJECT_ID = "object_form";
const TRIAL_ID = "trail";

initDatabase();

// Storing and retrieving object form setting
export const loadObjectFormSetting = (callback) =>
    loadFormSetting(OBJECT_ID, callback);
export const storeObjectFormSetting = (entries) =>
    storeFormSetting(OBJECT_ID, entries);

// Retrieving scene form setting
export const loadSceneFormSetting = (callback) =>
    loadFormSetting(SCENE_ID, callback);

// Storing and retrieving configuration file form setting
export const loadConfigFormSetting = (callback) =>
    loadFormSetting(CONFIG_ID, callback);
export const storeConfigFormSetting = (entries) =>
    storeFormSetting(CONFIG_ID, entries);

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
                    min: 1,
                    tooltip:
                        "The subject number should be a positive number reflecting the current subject undergoing the experiment. The number you enter here is just a placeholder to generate the initial config file and it must be manually changed between subjects so that the results files are correct.",
                },
                {
                    key: "subjSex",
                    label: "Subject Sex",
                    type: "number",
                    defaultValue: 0,
                    max: 1,
                    min: 0,
                    tooltip: "(0 = female and 1 = male)",
                },
                {
                    key: "session",
                    label: "Session",
                    type: "number",
                    defaultValue: 1,
                    min: 1,
                    tooltip: "Number that denotes the experimental session",
                },
                {
                    key: "group",
                    label: "Group",
                    type: "number",
                    defaultValue: 1,
                    tooltip: "Number that denotes the experimental group",
                },
                {
                    key: "trialFile",
                    label: "Trial file",
                    type: "text",
                    defaultValue: "config",
                    addonBefore: {
                        text: "~\\..\\Assets\\Trials\\",
                        display: false,
                    },
                    addonAfter: {
                        text: ".json",
                        display: true,
                    },
                    tooltip:
                        "Enter the name of an existing file that defines the trials that will be shown to the subject during the experiment. Note that you do not need to include the '.json' suffix at the end of the file name.",
                },
                {
                    key: "cameraLock",
                    label: "Camera Lock",
                    type: "switch",
                    defaultValue: false,
                    tooltip:
                        "Camera Lock false means the coordinates are in reference to the VR play area. True means that the coordinates are in reference to the VR headset. For example, for objects with starting position 0,0 and Z > 0 and ending position of 0,0,0 - the object will always fly directly to the camera regardless of the direction the participant looks.",
                },
                {
                    key: "trackHeadPos",
                    label: "Collect Head Position Data",
                    type: "switch",
                    defaultValue: false,
                    tooltip:
                        "Specify whether you would like to collect head tracking data.",
                },
                {
                    key: "trackControllerPos",
                    label: "Collect Controller Position",
                    type: "switch",
                    defaultValue: false,
                    tooltip:
                        "Specify whether you would like to collect controller tracking data.",
                },
                {
                    key: "showFeedback",
                    label: "Show Feedback",
                    type: "switch",
                    defaultValue: false,
                    tooltip: "Specify whether you would like to show feedback.",
                },
                {
                    key: "feedbackType",
                    label: "Feedback Type",
                    type: "number",
                    max: 2,
                    min: 0,
                    defaultValue: 1,
                    tooltip:
                        "If Show Feedback is True, select the feedback type. 1 = PM task feedback in seconds (approach motion only). 2 = Correct response feedback (e.g., if corrAns is 1 and they push Left, feedback is 'Correct'). If corrAns is 0, no feedback is shown.",
                },
                {
                    key: "feedbackColor",
                    label: "Feedback Color",
                    type: "select",
                    defaultValue: "black",
                    options: {
                        black: "Black",
                        blue: "Blue",
                        cyan: "Cyan",
                        gray: "Gray",
                        green: "Green",
                        magenta: "Magenta",
                        red: "Red",
                        white: "White",
                        yellow: "Yellow",
                        clear: "Clear",
                    },
                    tooltip:
                        "Choose any of the following colors for messages that will be displayed to subjects in between trials.",
                },
                {
                    key: "feedbackSize",
                    label: "Feedback Size",
                    type: "number",
                    defaultValue: 75.0,
                    tooltip:
                        "This determines the size of the feedback message shown to subjects. The default size is 75px.",
                },
                {
                    key: "feedbackPos",
                    label: "Feedback Position",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    step: 0.01,
                    defaultValue: [0.0, 6.0, 100.0],
                    tooltip:
                        "These coordinates determine the world location where messages will be displayed to the subject. The default coordinates are [0,6,100] but these can be adjusted based on the desired message position.",
                },
                {
                    key: "collectConfidence",
                    label: "Collect Condifence Rating",
                    type: "switch",
                    defaultValue: false,
                    tooltip:
                        "Specify whether you want to collect a confidence rating after the participant responds. NOTE: when this mode is active, the simulation waits for a 0-9 keyboard press. The experiment will need to press the button because the participant is in VR.",
                },
                {
                    key: "ground",
                    label: "Display Ground Plane",
                    type: "switch",
                    defaultValue: false,
                    tooltip: "Choose whether to show the ground plane.",
                },
                {
                    key: "road",
                    label: "Display Roadway",
                    type: "switch",
                    defaultValue: false,
                    tooltip: "Choose whether to show the roadway.",
                },
                {
                    key: "roadPos",
                    label: "Roadway Position",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [0.0, 0.0, 5.0],
                    tooltip:
                        "Enter the location of where you want to display the road. Default is 0,0,5 = 5 units in front of a user standing at 0,0,0",
                },
                {
                    key: "pressHold",
                    label: "Press Hold",
                    type: "switch",
                    defaultValue: false,
                    tooltip:
                        "Change the response mode to press and hold. Primarily used in the street crossing experiments.",
                },
                {
                    key: "debugging",
                    label: "Debugging",
                    type: "switch",
                    defaultValue: false,
                    tooltip:
                        "Choose whether to show debugging output in the Unity console.",
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
                    label: "Scene Name",
                    type: "text",
                    defaultValue: "name",
                },
                {
                    key: "corrAns",
                    label: "Correct Answer",
                    type: "number",
                    defaultValue: 1,
                    min: 0,
                    max: 2,
                    tooltip:
                        "Denote whether there is a correct answer. 1 = left button, 2 = right button, 0 = no correct answer.",
                },
                {
                    key: "playSound",
                    label: "Play Sound",
                    type: "switch",
                    defaultValue: false,
                    tooltip: "Choose whether to use a custom sound file",
                },
                {
                    key: "soundFile",
                    label: "Sound File",
                    type: "text",
                    addonAfter: {
                        display: true,
                        text: ".txt",
                    },
                    required: false,
                    tooltip:
                        "Enter the name of an existing file that defines the custom sounds that will be played to the subject during the trial. Note that you do not need to include the '.txt' suffix at the end of the file name.",
                },
                {
                    key: "numObjects",
                    label: "Number of Objects",
                    type: "number",
                    defaultValue: 1,
                    tooltip:
                        "There must be at least one object in the scene. On the following pages, you will specify the parameters for each object that you intend to create.",
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
                    label: "Object Type",
                    type: "select",
                    defaultValue: "car",
                    options: {
                        Car: "Car",
                        Sphere: "Sphere",
                        Cube: "Cube",
                        Motorcycle: "Motorcycle",
                    },
                    tooltip:
                        "Choose which type of object to present to subjects.",
                },
                {
                    key: "customMot",
                    label: "Custom Motion",
                    type: "switch",
                    defaultValue: false,
                    tooltip: "Choose whether to use a custom motion file",
                },
                {
                    key: "customFile",
                    label: "Custom Motion File",
                    type: "text",
                    required: false,
                    addonAfter: {
                        text: ".cus",
                        display: true,
                    },
                },
                {
                    key: "customDur",
                    label: "Custom Motion Duration",
                    type: "number",
                    defaultValue: 0.0,
                    tooltip:
                        "Enter the amount of time (in seconds) of custom motion.",
                },
                {
                    key: "objScale",
                    label: "Object Scale",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [0, 0, 0],
                    tooltip:
                        "Enter the (x,y,z) coordinates to determine the size of the object that is being presented.",
                },
                {
                    key: "objRot",
                    label: "Object Initial Rotation",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [0, 0, 0],
                    tooltip:
                        "Enter the (x,y,z) coordinates to determine the size of the object that is being presented.",
                },
                {
                    key: "startPos",
                    label: "Object Starting Position",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [0, 0, 0],
                    tooltip:
                        "Enter the (x,y,z) coordinates for the initial position of the object.",
                },
                {
                    key: "endPos",
                    label: "Object Ending Position",
                    type: "list",
                    listSize: 3,
                    itemType: "number",
                    defaultValue: [0, 0, 0],
                    tooltip:
                        "Enter the (x,y,z) coordinates for the final position of the object.",
                },
                {
                    key: "velocity",
                    label: "Object Velocity",
                    type: "number",
                    defaultValue: 0,
                    tooltip:
                        "Enter the speed that the object should move (in Unity units/second).",
                },
                {
                    key: "timeVisible",
                    label: "Time Visible",
                    type: "number",
                    defaultValue: 0,
                    tooltip:
                        "Enter the amount of time (in seconds) that the object should remain visible. If the object should be visible for the entire trial, this time should be the calculated TTC for the object (based on the object's distance from start to end). If the object should never disappear from the trial--even when the object has reached its final position--this value should be set to a negative number.",
                },
                {
                    key: "rotationSpeedX",
                    label: "Object Rotation Speed X",
                    type: "number",
                    defaultValue: 0,
                    tooltip:
                        "Enter the rotation speed of X-axis (in Unity units/second)",
                },
                {
                    key: "rotationSpeedY",
                    label: "Object Rotation Speed Y",
                    type: "number",
                    defaultValue: 0,
                    tooltip:
                        "Enter the rotation speed of Y-axis (in Unity units/second)",
                },
                {
                    key: "rotationSpeedZ",
                    label: "Object Rotation Speed Z",
                    type: "number",
                    defaultValue: 0,
                    tooltip:
                        "Enter the rotation speed of Z-axis (in Unity units/second)",
                },
                {
                    key: "offsetX",
                    label: "Offset X Axis",
                    type: "number",
                    max: 1,
                    min: -1,
                    defaultValue: 0,
                    tooltip:
                        "This will offset the start and end position of the object along the X-axis by 1/2 the model scale on the X axis",
                },
                {
                    key: "offsetY",
                    label: "Offset Y Axis",
                    type: "number",
                    max: 1,
                    min: -1,
                    defaultValue: 0,
                    tooltip:
                        "This will offset the start and end position of the object along the Y-axis by 1/2 the model scale on the Y axis",
                },
                {
                    key: "offsetZ",
                    label: "Offset Z Axis",
                    type: "number",
                    max: 1,
                    min: -1,
                    defaultValue: 0,
                    tooltip:
                        "This will offset the start and end position of the object along the Z-axis by 1/2 the model scale on the Z axis",
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
    formSettingsDB.count({}, (_err, count) => {
        if (count !== 4) {
            formSettingsDB.remove({}, { multi: true }, (_err, _numRemoved) => {
                populateDBDefault();
            });
        }
    });
}
