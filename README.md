# VR File Generator Developer Manual

### User manual
https://github.com/MayaShenHongyu/VR-file-generator-user-manual

### Set up

Follow the instructions here to install `git`: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git. Clone the project to local using `git clone https://github.com/MayaShenHongyu/VR-file-generator.git`. In the project directory (VR-file-generator), run `npm install` to install all the dependencies.

### Available Scripts

In the project directory, you can run the followings in the terminal:

#### `yarn run start`

Runs the app in the development mode. The page will reload if you make edits. You will also see any lint errors in the console.

#### `yarn run build`

Builds the app for production (output executables) to the `dist` folder.<br />

### Project structure (what each folder and file is for)
- Directory `public` contains static assets used in this project. You shouldn’t need to make any changes in this directory.
    - `electron.js` is the entry point for this Electron project.
- Directory `db` contains the databases. You shouldn't need to make any changes in this directory.
    - `form_config.db` is the database for form settings.
    - `scenes.db` is the database for scenes.
- Directory `src` contains the code for this project. All changes should be made in here.
    - `App.js` is the entire React application.
    - `Home.js` is the home page of the app.
    - `ConfigFileBuilder.js` is the VR configuration file builder.
    - `TrialFileHome.js` is the home page for generating trial files.
    - `SceneBuilder.js` is the page where user creates a scene.
    - `TrialFileBuilder.js` is the trial file builder. User selects from available scenes to build trial files.
    - Directory `database` manages the database:
        - `formSettingsDB.js` contains methods that manipulate the form settings database.
        - `scenesDB.js` contains methods that manipulate the scenes database.
    - Directory `dynamic_form` contains `DynamicForm`, a React component that reads in a form setting and displays the form accordingly.
        - `DynamicForm.js` contains the `DynamicForm` component.
        - `DynamicFormEntry.js` contains another component that is used in `DynamicForm`.
    - The `xxx.css` files contains CSS styles defined for components defined in `xxx.js` files. For instance, `Home.css` contains styles used in the `Home` component in `Home.js`. `Home.js` needs to import `Home.css` via `import "./Home.css"` to use the styles.

### List of frameworks/dependencies
- This project uses both Electron (for building desktop app) and React (usually for web application, used here because it is good for building UI components).
    - Electron docs: https://www.electronjs.org/docs
    - React docs: https://reactjs.org/docs/getting-started.html
- This project uses Ant Design, a UI component library. Docs: https://ant.design/components/
