// const db = window.require("electron").remote.require("./electron").scenes;

const sceneDB = window.require("electron").remote.require("./electron").scenes;

initDatabase();

const SCENES_ID = "scenes";


// function printScenes(msg) {
//     setTimeout(() => sceneDB.findOne({ database_id: SCENES_ID }, (_err, doc) => {
//         console.log(`${msg}: ${doc.scenes.map(s => s.sceneName)}`);
//     }), 2000)
// }

/**
 * Add a single scene
 * @param {Object} newScene 
 */
export const addScene = (newScene) => {
    // console.log("Add scene");
    sceneDB.findOne({ database_id: SCENES_ID }, (_err, doc) => {
        const scenes = doc.scenes;
        sceneDB.update(
            { database_id: SCENES_ID },
            {
                $set: { scenes: [...scenes, newScene] },
            }
        );
    });
    // printScenes("After add");
};

/**
 * Retreive scenes in database.
 * @param {(Array<Object>) => void} callback 
 */
export const loadScenes = (callback) => {
    sceneDB.findOne({ database_id: SCENES_ID }, (_err, doc) => {
        callback(doc.scenes);
    });
};

/**
 * Update the entire database.
 * @param {Array<Object>} scenes 
 */
export const storeScenes = (scenes) => {
    sceneDB.update(
        { database_id: SCENES_ID },
        {
            $set: { scenes },
        }
    );
    // printScenes("After remove");
};

/**
 * Initialize the database. If database is corrupted, remove everything and populate again.
 */
function initDatabase() {
    sceneDB.count({}, (_err, count) => {
        // console.log("Count: " + String(count));
        if (count !== 1) {
            sceneDB.remove({}, { multi: true }, (_err, _numRemoved) => {
                sceneDB.insert({
                    database_id: SCENES_ID,
                    scenes: []
                });
            });
        }
    });
    // printScenes("Init database");
}
