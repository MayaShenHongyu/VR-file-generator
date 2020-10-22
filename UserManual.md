# VR File Generator

This file generator generates files for the VR experiment based on user requirements. There are two kinds of files you can generate: VR configuration file and trial file.

## Usage

#### Generate VR configuration files
Click on the "Generate configuration" button on the home page, and you will see the form for generating configuration files:

<img src="/images/configuration_file_builder.png" alt="Config builder" width="70%" />

#### Generate trial files
Click on the "Generate trial" button on the home page to access the menu page of trial file genertor.

A trial file consists of multiple scenes, so scenes need to be created before trial files are generated.
To create a scene, click on the "Create scene" button and complete the forms.

<img src="/images/scene_builder_1.png" alt="Scene builder 1" width="70%" />
<img src="/images/scene_builder_2.png" alt="Scene builder 1" width="70%" />

After creating scenes, click on the "Generate trial" button, where you will see all scenes avaliable in the database.

<img src="/images/trial_builder.png" alt="Trial builder" width="70%" />

Note that you must enter "Repeated times", which is the number of times each selected scene is repeated in the trial. Scenes are randomized in the generated trial file.

## Understanding JSON

JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. This file generator generate JSON files that configure VR experiments, and you can also customize the different forms with JSON files.

In JSON, values must be one of the following data types:

- a string: sequence of characters in double quotes
    - e.g. `"this is a string"`
- a number: integer or decimal
    - e.g. `2`, `1.5`
- a boolean
    - `true` or `false`
- an array: a list of JSON values in square brackets, separated by commas
    - e.g. `["string value", 2.3, true, { "key": "value" }]`
- an object: a collection of key-value pairs in curly brackets, separated by commas
    - Keys must be strings. Note that an object cannot contain two identical keys.
    - Values can be any JSON value: string, number, boolean, array, object
    - e.g. 
    ```yaml
    {
        "key_for_string": "string value", 
        "key_for_number": 3, 
        "key_for_array": [1, 2], 
        "key_for_object": {
            "key": "string value",
            "key2": 3.5
        }
    }
    ```



## Customize forms
This app allows users customize two forms: configuratoin file form (used in configuration file builder) and object form (used in scene builder). A form can be customized with a JSON array containing form entry definitions. Each definition configures an entry in the form.

Note: Before using this feature, you need to make sure you can describe the desired outcome: What should the form look like? What should the output file look like? You should be able to write out the output JSON files by hand.

### Form Entry Definition

Form entry definitions are JSON objects. For each definition, three key-value pairs are required:
- `"label"`: This is the label for this entry at display. The value must be a string. Note that this does not affect the output of this entry in the resulting JSON file.
- `"key"`: This is the key for this entry in the resulting JSON file. The value must be a string. Note that all Form Entry Definiton keys in a form setting must be unique.
- `"type"`: This refers to the input type of this entry. This file generator supports five different types: `"text"`, `"number"`, `"switch"` (true or false), `"selection"` (a dropdown menu), `"list"` (a list of texts or numbers).
- (Optional) `"tooltip"`: Documentation for this entry. The value must be a string.
- Depending on the input type, different key-value pairs are required, which is discussed in detials below. *(Optional) means that the key-value pair is optional.

For example:
```yaml
{
    "key": "subjNum",
    "label": "Subject Number",
    "type": "number",
    "tooltip": "This is a tooltip"
}
```
This definition produces:

<img src="/images/form_entry_definition.png" alt="Form Entry Definition" height=120/>

And if I type in `8`, the output file will look like this:
```yaml
{
    "subjNum": 8,
    ..., // other entries
}
```

### Types


##### `"text"`
- (Optional) `"defaultValue"`: Default value for this entry. This must be a string.
- (Optional) `"addonAfter"`: An add-on at the end of the input. This must be an object of the following format:
    ```yaml
    {
        "text": ".json",
        "display": true
    }
    ```
    `"text"` is the text to be added on to the user input value. For instance, if user inputs "config", then the result will be "config.json". `"display"` denotes whether or not this add-on is displayed to the user in the form.
- (Optional) `"addonBefore"`: An add-on at the start of the input. Same format as `"addonAfter"`.

For example:
```yaml
{
    "key": "trialFile",
    "label": "Trial file",
    "type": "text",
    "defaultValue": "config",
    "addonAfter": {
        "text": ".json",
        "display": true
    },
    "addonBefore": {
        "text": "~\\..\\Assets\\Trials\\",
        "display": false
    }
}
```
<img src="/images/text.png" alt="Text" height=60/>

In the output:
```yaml
{
    "trialFile": "~\\..\\Assets\\Trials\\config.json",
    ...
}
```
<br />

##### `"number"`
- (Optional) `"defaultValue"`: Default value for this entry. This must be a number.
- (Optional) `"max"`: Maximum value for this entry. Must be a number.
- (Optional) `"min"`: Minimum value for this entry. Must be a number.

For example:
```yaml
{
    "key": "subjNum",
    "label": "Subject Number",
    "type": "number",
    "defaultValue": 8,
    "max": 10,
    "min": 1
}
```
<img src="/images/number.png" alt="Number" height=60/>

In the output:
```yaml
{
    "subjNum": 8,
    ...
}
```
<br />

##### `"switch"`
- (Optional) `"defaultValue"`: Default value for this entry. This must be a boolean, so either `true` or `false`.

For example:
```yaml
{
    "key": "collectConfidence",
    "label": "Collect Condifence Rating",
    "type": "switch",
    "defaultValue": false
}
```
<img src="/images/switch.png" alt="Switch" height=60/>

In the output:
```yaml
{
    "collectConfidence": false,
    ..., // other entries
}
```
<br />

##### `"select"`
- `"options"`: Defines the options in the dropdown menu. This must be an object (collection of key/value pairs). The keys are values that appear in the output JSON file, and the values are the keys' labels for display. For instance: `{ "male": "Male", "female": "Female"}`.
- (Optional) `"defaultValue"`: Default value for this entry. This must be one of the keys in `"options"`. For instance: `"male"`.

For example:
```yaml
{
    "key": "subjSex",
    "label": "Subject Sex",
    "type": "select",
    "defaultValue": "male",
    "options": {
        "male": "Male",
        "female": "Female",
        "non_binary": "Non binary"
    }
}
```
<img src="/images/select.png" alt="Select"
height=170 />

In the output:
```yaml
{
    "subjSex": "male",
    ...
}
```
<br />

##### `"list"`
- `"itemType"`: The type of elements in list. Either `"number"` or `"text"`.
- `"listSize"`: The number of elements in list. Should be smaller than 5.
- (Optional) `"defaultValue"`: Default value for this entry. This must be a list containing `"listSize"` elements of type `"itemType"`. If `"listSize"` is `2` and `"itemType"` is `"text"`, then `"defaultValue"` could be `["value1", "value2"]`.

For example:

```yaml
{
    "key": "coordinates",
    "label": "Coordinates (X, Y, Z)",
    "type": "list",
    "itemType": "number",
    "listSize": 3,
    "defaultValue": [
        1,
        2,
        3
    ]
}
```
<img src="/images/list.png" alt="List" height=60 />

In the output:
```yaml
{
    "coordinatrs": [1, 2, 3],
    ...
}
```

### Import form setting
When you have a JSON file that conforms to the rules above, you can import this setting by navigating to the 'Form Settings' page by clicking on the 'Import form settings' button on the home page.

<img src="/images/import.png" alt="Import"  width="70%" />

The app will parse the imported file and report debugging errors, if there are any.

<img src="/images/import_error.png" alt="Import"  width="70%" />

If the imported file contains no error, you can click on the 'Save settings' button and save the settings.

<img src="/images/parse_successful.png" alt="Import" width="70%" />

The change will be reflected in the form:

<img src="/images/changed_form.png" alt="Import" width="70%" />

### Appendix: example
```yaml
[
    {
        "key": "subjNum",
        "label": "Subject Number",
        "type": "number",
        "defaultValue": 4
    },
    {
        "key": "subjSex",
        "label": "Subject Sex",
        "type": "select",
        "defaultValue": "male",
        "options": {
            "male": "Male",
            "female": "Female",
            "non_binary": "Non binary"
        }
    },
    {
        "key": "something",
        "label": "Test",
        "type": "switch",
        "defaultValue": true
    },
    {
        "key": "trialFile",
        "label": "Trial file",
        "type": "text",
        "defaultValue": "config",
        "addonAfter": ".json"
    },
    {
        "key": "feedbackColor",
        "label": "Feedback Color",
        "type": "select",
        "defaultValue": "black",
        "options": {
            "black": "Black",
            "blue": "Blue",
            "gray": "Gray",
            "pink": "Pink"
        }
    },
    {
        "key": "collectConfidence",
        "label": "Collect Condifence Rating",
        "type": "switch",
        "defaultValue": false
    },
    {
        "key": "coordinates",
        "label": "Coordinates (X, Y, Z)",
        "type": "list",
        "listSize": 3,
        "itemType": "number",
        "defaultValue": [
            1,
            2,
            3
        ]
    },
    {
        "key": "group",
        "label": "Group",
        "type": "number",
        "defaultValue": 1
    }
]
```
The above setting configures the following form:

<img src="/images/VR_config_form.png" alt="Example form" width="70%" />

And the generated file looks like:

```yaml
{
    "subjNum": 4,
    "subjSex": "male",
    "something": true,
    "trialFile": "config.json",
    "feedbackColor": "black",
    "collectConfidence": false,
    "coordinates": [
        1,
        2,
        3
    ],
    "group": 1
}
```
