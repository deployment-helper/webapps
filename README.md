# Presentation managemnt

This is presentation management project that we are using to manage and create presntation with JSON schema with pre-defined templates.

User will be able to select the template and each template will heave defined JSON schema for creating the slides.

## Dev

This is Next.js based application and local development can be setup as per the framework documentation.

**CSS and Components**

- Component libray

  https://react.fluentui.dev/?path=/docs/theme-colors--page
  https://react.fluentui.dev/?path=/docs/concepts-developer-theming--page
  https://react.fluentui.dev/?path=/docs/theme-typography--page

## Templates

### Template1

**Schema**

Type Presentation

```json
{
  "name": "String",
  "desc": "String",
  "theme": "string",
  "presentation_id?":"",
  "project_id?":"",
  "slides:"Array<Type Slide>",
  audio_dur?:"numbber in ms"
}
```

Type Slide

```json
{
    question_en:"string",
    question_hi:"string",
    audio_dur_en?:"number in ms",
    audio_dur_hi?:"number in ms",
    options:Array<Option>,
    right_option:Option,
    explanation:"string",
    audio_dur_exp?:"number in ms"

}
```

Type Option

```json
{
    option_en:"string",
    option_hi:"string",
    is_right:boolean,
    audio_dur_en?:"number in ms",
    audio_dur_hi?:"number in ms"
}

```

Samples can be find in `samples` directory
