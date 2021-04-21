# Configurable VR File Generator User Manual

## Purpose

This file generator generates input files for the VR experiment (WinObjVR) based on user specification. It also allows users to configure the format of the generated files (described in detail in the "How this file generator differs from the previous file generator" section).

There are two kinds of files you can generate: configuration file and trial file.

-   Configuration file: `config.json`
    -   This file specifies the configuration for the overall experiment and the name of the trial file, which will have the details for all the trials within the experiment.
-   Trial file: `[trial name].json`
    -   This file contains the information for all of the trials in the experiment. It consists of a list of `trial`s. A `trial` is a trial number and a `scene`, which specifies the objects in the scene and their parameters such as velocity, start position, end position, etc.

There are three forms to enable users to generate these files: configuration form, scene basic information form, and object form.

-   Configuration File Form: for generating configuration files; this form is customizable.
    <img src="/user-manual-images/configuration_file_builder.png" alt="Config builder" width="60%" />
-   Scene Basic Information Form: set up basic information of a scene
    <img src="/user-manual-images/scene_builder_1.png" alt="Scene builder 1" width="60%" />
-   Object Form: for specifying the parameters of an object -- object type (e.g. car), velocity, start position, end position, etc; this form is customizable.
    -   A scene consists of multiple objects. The user will specify object number in scene basic information form, and the user will be asked to fill in one object form for each object.
        <img src="/user-manual-images/scene_builder_3.png" width="60%" alt="Object form"  />

### How this file generator differs from the previous file generator

-   This file generator allows users to edit two of the forms described above (Configuration File Form and Object Form) via a JSON file. This means that users can specify the format of the generated files. For instance, you could add a new option "pink" to the "feedbackColor" entry in the "config.JSON" file. In the previous file generator, these forms are hardcoded, which means that you have to change the code in order to change the forms.
-   For trial file generation, this file generator allows users to specify the repeated times for each selected scene, then randomize the scenes. In the previous file generator, you could randomize the selected scenes but they only appear one time.

#### Potential drawbacks

-   This file generator takes up more memory than the previous file generator.
-   To be discovered...

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

## Files and programs needed

Download the "DeLuciaLab/Undergraduate RAs/MayaShen/MayaShenConfigurableVRFileGenerator2.0" folder in box. Install the correct version of the app: "Mac Configurable VR File Generator.dmg" for Mac users, and "Windows Configurable VR File Generator Setup.exe" for Windows users. Then you can click on the app icon to start the app. There is also a CSV file `sample_trial_file.csv`. \* For development, see the list of files and programs needed in the "Set up" section in the developer manual.

## Usage

### Generate configuration files

Click on the "Generate configuration" button on the home page, and you will see the form for generating configuration files:

<img src="/user-manual-images/configuration_file_builder.png" alt="Config builder" width="60%" />

### Generate trial files

There are two ways users can generate trial files: manual input and import from CSV files. Click on the "Generate trial file" button on the home page and you will see the two options.

<img src="/user-manual-images/trial_file_home.png" alt="Generate trial file" width="60%" />


#### Manual input

Click on the "Manual input" button to access the menu page of generating trial files by manual input.

Scenes are building blocks of trials, so we must have a pool of available scenes before we can generate a trial file.

To create a scene, click on the "Create scene" button and complete the forms. Each scene consists of >= 1 objects. This is the Scene basic information form, where you input some of the basic attributes of the scene.

<img src="/user-manual-images/scene_builder_1.png" alt="Scene builder 1" width="60%" />

Then you will see a page where you can define each Object.
<img src="/user-manual-images/scene_builder_2.png" alt="Scene builder 1" width="60%" />

After clicking on one, you can see the Object Form where you define the attributed of an object.
<img src="/user-manual-images/scene_builder_3.png" alt="Scene builder 3" width="60%" />

After finishing creating scenes, you will be send back to the Manal Input home page. Click on the "Generate trial" button, then you will see all scenes avaliable in the database. Click on the available scenes for them to be selected.

<img src="/user-manual-images/trial_builder.png" alt="Trial builder" width="60%" />

Note that you need to input the file name, repeated times, and whether or not to randomize the scenes before you click on 'Generate trial file'.

#### Import from CSV

Home page -> "Generate trial file" -> "Import from CSV", then you will see the CSV converter. 

Choose the file you want to convert to a trial file in JSON format by clicking on the "Parse CSV file" button. Notice that the selected file must be a CSV file (with `.csv` extension) and must follow a certain format, which will be discussed in details in the next section.

<img src="/user-manual-images/csv.png" alt="CSV converter" width="60%" />

If your CSV file is successfully parsed, you will see the parsed scenes and a section where you can input file name, repeated times, and whether or not to randomize the scenes. Click on "Generate trial file" and the trial file will be generated.

<img src="/user-manual-images/csv_success.png" alt="CSV converter sucess" width="60%" />

Otherwise, there are errors in your CSV file. Please follow the error messages to revise your CSV file.

<img src="/user-manual-images/csv_error.png" alt="CSV converter error" width="60%" />

##### How to generate CSV files

If you are on Windows, you can export an Excel sheet to CSV file by clicking on `File` -> `Export to ...` -> Choose CSV format. Or you can directly edit a CSV file with Excel.

If you are on Mac, you can export a Numbers sheet to CSV file by clicking on `File` -> `Export to ...` -> `CSV...`. A window will pop up and you can click on `Next...` to proceed. Don't change anything in `Advanced Options`.

##### CSV trial file format

If the generator's Object Form has not been modified (see section **Edit the forms**), you can use the sample CSV file `sample_trial_file.csv` as a template to build your CSV trial files.

Otherwise, you must read this section, **Understanding JSON**, and **Edit the forms** carefully:

The first row of the CSV file are column names. Each column corresponds to an entry in Scene Basic Information Form or Object Form. This column name must match the `label` of that entry's Form Entry Definition. Each of the following row represents a scene in the trial file. Note that you only need to define the unique scenes. You do not need to repeat or randomize them. 

The first five entries (Scene name, Correct Answer, Play Sound, and Number of objects) are attributes of a scene. They are entries in the Scene Basic Information Form. Note that Scene Basic Information Form is uneditable, which means that the first five columns in `sample_trial_file.csv` should remain unchanged.

The rest of the entires describe the Objects in that scene. We limit the maximum number of Objects in a scene to be 4 in order to keep the size of the CSV file reasonable; thus, the fields Object Form are sequentially repeated 4 times. Note that the number you entered in the “Number of Objects” entry must match the number of Objects you actually define. This means some rows will have empty entries at their tails.

Depending on the Form Entry type (`type` field in its Form Entry Definition), you might need to reformat the entry value a little bit when you type it in to your Excel/Numbers sheet:
-   Text: no change
-   Number: no change
-   Switch: `T` or `F`
-   Select: use the key of an option, not the value (the display label)
    -   E.g. For the following Form Entry Definition:
        ```yaml
        {
            "key": "color",
            "label": "Color",
            "type": "select",
            "options": {
                "blue": "Blue",
                "pink": "Pink"
            }
        }
        ```
        Your options are: `blue` and `pink`.
-   List: separate your list items by `,` with no blank space in between and put `"` around the items.
    -   E.g. `1, 2, 3` becomes `"1,2,3"` and `red, blue, yellow` becomes `"red,blue,yellow"`.

Note that if the `requried` field in the Form Entry Definition is set to `false` (default is `true`), then you can leave that entry empty. Otherwise you must enter a value.

## Edit the forms

This app allows users to add / delete Object types and edit two forms (Configuration File Form and Object Form) in advanced mode. 

### Add / Delete Object types

Navigate to the 'Form Settings' page by clicking on the 'Import form settings' button on the home page. You can add / delete the options of the Object Type entry in Object Form.

<img src="/user-manual-images/form_settings_object_type.png" alt="Edit Object Types" width="60%" />

### Advanced mode: import JSON format form settings

This app allows users to edit two forms: Configuration File Form and Object Form. Forms can be configured with a JSON array containing form entry definitions. Each form entry definition configures an entry in the form.

*** Note that in order for the Object types editor (explained in the previous section) to work, the first Form Entry Definition of Object Form (see below) must remain unchanged:

```yaml
    {
        "key": "objType",
        "label": "Object Type",
        "type": "select",
        "defaultValue": "Car",
        "options": {
            "Car": "Car",
            "Sphere": "Sphere",
            "Cube": "Cube",
            "Motorcycle": "Motorcycle"
        },
        "tooltip": "Choose which type of object to present to subjects."
    }
```

Warning: Modifying these forms means that the Unity VR program should be modified as well. Before using this feature, you need to make sure you can describe the desired outcome: What should the form look like? What should the output file look like? You should be able to write out the output JSON files by hand. 

#### Understanding JSON

JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. This file generator generate JSON files that configure VR experiments; **it is also the file format for customizing two forms: Configuration File Form and Object Form.**

In JSON, a value must be one of the following data types:

-   a string: sequence of characters in double quotes
    -   e.g. `"this is a string"`
-   a number: integer or decimal
    -   e.g. `2`, `1.5`
-   a boolean
    -   `true` or `false`
-   an array: a list of JSON values in square brackets, separated by commas
    -   e.g. `["string value", 2.3, true, { "key": "value" }]`
-   an object: a collection of key-value pairs in curly brackets, separated by commas
    -   Keys must be strings; an object cannot contain two identical keys.
    -   Values can be any JSON value: string, number, boolean, array, object
    -   e.g.
    ```yaml
    {
        "key_for_string": "string value",
        "key_for_number": 3,
        "key_for_array": [1, 2],
        "key_for_object": { "key": "string value", "key2": 3.5 },
    }
    ```

#### Form Entry Definition

A Form Entry Definition describes an entry in a form. Form entry definitions are JSON objects. For each definition, three key-value pairs are required:

-   `"label"`: This is the label for this entry at display. The value must be a string. Note that this does not affect the output of this entry in the resulting JSON file.
-   `"key"`: This is the key for this entry in the resulting JSON file. The value must be a string. Note that all Form Entry Definiton keys in a form setting must be unique.
-   `"type"`: This refers to the input type of this entry. This file generator supports five different types: `"text"`, `"number"`, `"switch"` (true or false), `"selection"` (a dropdown menu), `"list"` (a list of texts or numbers).
-   (Optional) `"tooltip"`: Documentation for this entry. The value must be a string.
-   Depending on the input type, different additional key-value pairs are required, which is discussed in detials below. \*(Optional) means that the key-value pair is optional -- you don't have to include the pair in your Form Entry Definition for it to work.

For example:

```yaml
{
    "key": "subjNum",
    "label": "Subject Number",
    "type": "number",
    "tooltip": "This is a tooltip",
}
```

This definition produces:

<img src="/user-manual-images/form_entry_definition.png" alt="Form Entry Definition" height=120/>

And if I type in `8`, the output file will look like this:

```yaml
{ "subjNum": 8, ..., // other entries }
```

#### Types of Form Entry

Five types of form entry are supported:

-   text: allows users to input a string
-   number: allows users to input an integer or decimal
-   switch: allows users to input a `true` or a `false`
-   select: allows user to select from a dropdown menu
-   list: allows user to input a list of texts or numbers

##### `"text"`

-   (Optional) `"defaultValue"`: Default value for this entry. This must be a string.
-   (Optional) `"addonAfter"`: An add-on at the end of the input. This must be an object with the following format:
    ```yaml
    { "text": ".json", "display": true }
    ```
    -   `"text"` is the text to be added on to the user input value. For instance, if user inputs "config", then the result will be "config.json". This must be a string.
    -   `"display"` denotes whether or not this add-on is displayed to the user in the form. This must be a boolean.
-   (Optional) `"addonBefore"`: An add-on at the start of the input. Same format as `"addonAfter"`.

For example:

```yaml
{
    "key": "trialFile",
    "label": "Trial file",
    "type": "text",
    "defaultValue": "config",
    "addonAfter": { "text": ".json", "display": true },
    "addonBefore": { "text": "~\\..\\Assets\\Trials\\", "display": false },
}
```

<img src="/user-manual-images/text.png" alt="Text" height=60/>

In the output:

```yaml
{ "trialFile": "~\\..\\Assets\\Trials\\config.json", ... }
```

<br />

##### `"number"`

-   (Optional) `"defaultValue"`: Default value for this entry. This must be a number.
-   (Optional) `"max"`: Maximum value for this entry. Must be a number.
-   (Optional) `"min"`: Minimum value for this entry. Must be a number.
-   (Optional) `"step"`: Increment size when you click on the up or down error.

For example:

```yaml
{
    "key": "subjNum",
    "label": "Subject Number",
    "type": "number",
    "defaultValue": 8,
    "max": 10,
    "min": 1,
    "step": 0.1
}
```

<img src="/user-manual-images/number.png" alt="Number" height=60/>

In the output:

```yaml
{ "subjNum": 8, ... }
```

<br />

##### `"switch"`

-   (Optional) `"defaultValue"`: Default value for this entry. This must be a boolean, so either `true` or `false`.

For example:

```yaml
{
    "key": "collectConfidence",
    "label": "Collect Condifence Rating",
    "type": "switch",
    "defaultValue": false,
}
```

<img src="/user-manual-images/switch.png" alt="Switch" height=60/>

In the output:

```yaml
{ "collectConfidence": false, ..., // other entries }
```

<br />

##### `"select"`

-   `"options"`: Defines the options in the dropdown menu. This must be an object (collection of key/value pairs). The keys are values that appear in the output JSON file, and the values are the keys' labels for display. For instance: `{ "male": "Male", "female": "Female"}`.
-   (Optional) `"defaultValue"`: Default value for this entry. This must be one of the keys in `"options"`. For instance: `"male"`.

For example:

```yaml
{
    "key": "subjSex",
    "label": "Subject Sex",
    "type": "select",
    "defaultValue": "male",
    "options":
        { "male": "Male", "female": "Female", "non_binary": "Non binary" },
}
```

<img src="/user-manual-images/select.png" alt="Select"
height=170 />

In the output:

```yaml
{ "subjSex": "male", ... }
```

<br />

##### `"list"`

-   `"itemType"`: The type of elements in list. Either `"number"` or `"text"`.
-   `"listSize"`: The number of elements in list. Should be smaller than 5.
-   (Optional) `"defaultValue"`: Default value for this entry. This must be a list containing `"listSize"` elements of type `"itemType"`. If `"listSize"` is `2` and `"itemType"` is `"text"`, then `"defaultValue"` could be `["value1", "value2"]`.
-   (Optional - only valid when`itemType` is `number`): `"step"`: Increment size when you click on the up or down error of the number input.

For example:

```yaml
{
    "key": "coordinates",
    "label": "Coordinates (X, Y, Z)",
    "type": "list",
    "itemType": "number",
    "listSize": 3,
    "step": 0.1,
    "defaultValue": [1, 2, 3],
}
```

<img src="/user-manual-images/list.png" alt="List" height=60 />

In the output:

```yaml
{ "coordinatrs": [1, 2, 3], ... }
```

#### Import form setting

When you have a JSON file that conforms to the rules above, you can import this setting by clicking on the 'Advanced...' button on the top right corner in the Form Settings page.

Now you can see the current form settings:

<img src="/user-manual-images/form_settings_import.png" alt="Import"  width="60%" />

Click on the 'Import new settings' button to import a new setting for the form. The app will parse the imported file and report debugging errors, if there are any.

<img src="/user-manual-images/form_settings_error.png" alt="Import"  width="60%" />

If the imported file contains no error, you can click on the 'Save settings' button and save the settings.

<img src="/user-manual-images/form_settings_sucess.png" alt="Import" width="60%" />

The changes will be reflected in the form as well as the trial file CSV parser. For instance, if you added an entry in Object Form, the app expects each Object to have an additional column in the CSV file.

### Appendix: example

```yaml
[
    {
        "key": "subjNum",
        "label": "Subject Number",
        "type": "number",
        "defaultValue": 4,
    },
    {
        "key": "subjSex",
        "label": "Subject Sex",
        "type": "select",
        "defaultValue": "male",
        "options":
            { "male": "Male", "female": "Female", "non_binary": "Non binary" },
    },
    {
        "key": "something",
        "label": "Test",
        "type": "switch",
        "defaultValue": true,
    },
    {
        "key": "trialFile",
        "label": "Trial file",
        "type": "text",
        "defaultValue": "config",
        "addonAfter": ".json",
    },
    {
        "key": "feedbackColor",
        "label": "Feedback Color",
        "type": "select",
        "defaultValue": "black",
        "options":
            {
                "black": "Black",
                "blue": "Blue",
                "gray": "Gray",
                "pink": "Pink",
            },
    },
    {
        "key": "collectConfidence",
        "label": "Collect Condifence Rating",
        "type": "switch",
        "defaultValue": false,
    },
    {
        "key": "coordinates",
        "label": "Coordinates (X, Y, Z)",
        "type": "list",
        "listSize": 3,
        "itemType": "number",
        "defaultValue": [1, 2, 3],
    },
    { "key": "group", "label": "Group", "type": "number", "defaultValue": 1 },
]
```

The above setting configures the following form:

<img src="/user-manual-images/VR_config_form.png" alt="Example form" width="60%" />

And the generated file looks like:

```yaml
{
    "subjNum": 4,
    "subjSex": "male",
    "something": true,
    "trialFile": "config.json",
    "feedbackColor": "black",
    "collectConfidence": false,
    "coordinates": [1, 2, 3],
    "group": 1,
}
```
