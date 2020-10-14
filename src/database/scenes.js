const db = window.require("electron").remote.require("./electron").scenes;

initDatabase();

const SCENES_ID = "scenes";

export const addScene = (newScene) => {
    db.findOne({ database_id: SCENES_ID }, (_err, doc) => {
        const scenes = doc.scenes;
        db.update(
            { database_id: SCENES_ID },
            {
                $set: { scenes: [...scenes, newScene] },
            }
        );
    });
};

export const loadScenes = (callback) => {
    db.findOne({ database_id: SCENES_ID }, (_err, doc) => {
        callback(doc.scenes);
    });
};

export const storeScenes = (scenes) => {
    db.update(
        { database_id: SCENES_ID },
        {
            $set: { scenes },
        }
    );
};

function initDatabase() {
    // console.log("init")
    // db.remove({}, { multi: true }, function (err, numRemoved) {
    //     db.insert({
    //         database_id: SCENES_ID,
    //         scenes: []
    //     });
    // });
    db.count({}, (_err, count) => {
        if (count === 0) {
            db.insert({
                database_id: SCENES_ID,
                scenes: [],
            });
        }
    });
}
