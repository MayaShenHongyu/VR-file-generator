# Configurable VR File Generator Developer Manual

### Purpose

This file generator generates input files for the VR experiment (WinObjVR) based on user specification. It also allows users to configure the format of the generated files. For instance, you could add a new option "pink" to the "feedbackColor" entry in the "config.JSON" file.

There are two kinds of files you can generate: configuration file and trial file.

-   Configuration file: `config.json`
    -   This file specifies the configuration for the overall experiment and the name of the trial file, which will have the details for all the trials within the experiment.
-   Trial file: `[trial name].json`
    -   This file contains the information for all of the trials in the experiment. It consists of a list of `trial`s. A `trial` is a trial number and a `scene`, which specifies the objects in the scene and their parameters such as velocity, start position, end position, etc.

## Status

#### What's been done

-   All feature requirements have been met.
-   Professor DeLucia and Miles did quick tests by running the program. The program correctly generated files based on their input to the forms.
-   Professor DeLucia and Miles gave feedback on the user manuals.

#### Problems and issues

-   Systematic testing has not been completed yet.

#### Next steps

-   Do more testing. In particular, we need to test if the programs configures the forms correctly given user specification.
-   Have more students read the user and developer manuals to identify any areas that need clarification.

### Languages, frameworks, and libraries

-   This project uses JavaScript and CSS.
-   This project uses Electron, a framework for building desktop applications. See docs: https://www.electronjs.org/docs
-   This project uses React, a framework usually for web applications. It is used here because it is good for building UI components. See docs: https://reactjs.org/docs/getting-started.html
-   This project uses Ant Design, a UI component library. This is mostly for aesthetic purpose. See docs: https://ant.design/components/

### Files and programs needed

-   Git - Follow the instructions here to install: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git.
-   Your favorite IDE - The author used Visual Sudio Code (https://code.visualstudio.com/download), but you could use any IDE you like.

### Set up

1. In terminal, go to the directory in which you would like to keep this project. Clone the project to local with `git clone https://github.com/Rice-Perception-and-Action-Lab/MayaShen-configurable-VR-file-generator.git`. Then you will see a new folder with the name of this project. You have successfully cloned this project to local.
2. Go to the directory you just pulled from git, run `npm install` to install the dependencies.
3. Use your IDE to open this project. You can start coding now.

### Available Scripts

In the project directory, you can run the followings in terminal:

#### `npm run start`

Run the app in the development mode. The page will reload if you make edits. You will also see any lint errors in the console.

#### `npm run build`

Build the app for production (output executables) to the `dist` folder.<br />

### `npx prettier --write .`

Format all files with Prettier. Prettier is a code formatting tool. See docs: https://prettier.io/docs/en/install.html

### Project structure (what each folder and file is for)

-   Directory `public` contains static assets used in this project. You shouldn’t need to make any changes in this directory in most cases.
    -   `electron.js` is the entry point for this Electron project.
-   Directory `db` contains the databases. You shouldn't need to make any changes in this directory.
    -   `form_config.db` is the database for form settings.
    -   `scenes.db` is the database for scenes.
-   Directory `src` contains the main code for this project. In most cases, changes should be made in here.
    -   `App.js` is the entire React application.
    -   `Home.js` is the home page of the app.
    -   `ConfigFileBuilder.js` is the VR configuration file builder.
    -   `TrialFileHome.js` is the home page for generating trial files.
    -   `SceneBuilder.js` is the page where user creates a scene.
    -   `TrialFileBuilder.js` is the trial file builder. User selects from available scenes to build trial files.
    -   Directory `database` contains APIs to manage the database:
        -   `formSettingsDB.js` contains functions to manage `form_config.db`.
        -   `scenesDB.js` contains functions to manage `scenes.db`.
    -   Directory `dynamic_form` contains `DynamicForm`, a React component that reads in a form setting and displays the form accordingly.
        -   `DynamicForm.js` is the `DynamicForm` component.
        -   `DynamicFormEntry.js` is a sub-component of `DynamicForm`.
    -   The `xxx.css` files are CSS styles defined for the components in `xxx.js` files. For instance, `Home.css` contains styles used in the `Home.js` component. `Home.js` needs to import `Home.css` via `import "./Home.css"` to use the styles.
