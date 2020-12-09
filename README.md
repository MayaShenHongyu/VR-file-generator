## Set up

Clone this github project directory to local. In the project directory, run `npm install` to install all dependencies.

## Available Scripts

In the project directory, you can run the followings in the terminal:

### `yarn run start`

Runs the app in the development mode.<br />

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn run build`

Builds the app for production (output executables) to the `dist` folder.<br />

## Project structure

- `App.js` is the entire React application.
- `Home.js` is the home page of the app.
- `ConfigFileBuilder.js` is the VR configuration file builder.
- `TrialFileHome.js` is the home page for generating trial files.
- `SceneBuilder.js` is the page where user creates a scene.
- `TrialFileBuilder.js` is the trial file builder. User selects from available scenes to build trial files.
- Directory `database` manages the database.
    - `formSettingsDB.js` stores the setting for all of the forms.
    - `scenesDB.js` stores the scenes created by user.
- Directory `dynamic_form` contains `DynamicForm`, a React component that reads in a form setting and displays the form accordingly.
    - `DynamicForm.js` contains the `DynamicForm` component.
    - `DynamicFormEntry.js` contains another component that is used in `DynamicForm`.
