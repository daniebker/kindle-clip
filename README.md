# Kindle-clip

[!](./assets/ai_demo.gif)

This package parses a kindle \`MyClippings.txt\` and outputs to a variety of formats.

Using the plugin architecture it's possible to add new types or processors to export clippings to a variety of formats.


## Usage 

```shell
node index.js ~/path/to/My Clippings.txt ~/output/path/ markdown
```

## Features 

-   Adds an ID to each highlight. When importing, the processor can check the target file to see if the id already exists. If it does then the highlight can be skipped.
-   Attaches notes to the previous highlight
    -   Notes are scanned and autmatically added to the previous highlight.
    -   Only the last note after a highlight is parsed.
-   Bookmarks are skipped
-   Integration with OpenAI (requires an Api Key)


### AI 

The application has integration with OpenAI. You'll need an API key with credits in order to use the integration. Before running export your API key as an environment variable:

```shell
export OPENAI_API_KEY=YOU_API_KEY
```

Then run the command line with AI enabled:

```shell
node index.js ~/path/to/My Clippings.txt ~/output/path/ markdown true
```

#### IMPORTANT

[OpenAI is not free](https://openai.com/pricing) and using the API to generate titles will cost money. I recommend [setting up usage limits](https://platform.openai.com/docs/guides/production-best-practices/managing-billing-limits) in the OpenAI dashboard so you don't accidentally spend a ton of money parsing your files. I am not responsible if your OpenAI bill sky rockets. Run a test first and [monitor your usage](https://platform.openai.com/account/usage) to ensure you're not burning through tokens.

## Templating 

Handlebars is used for tempalteing. Right now there's only suport for org-roam in the tempaltes, but it should be simple enough to add others. The templates need to be in two parts, a header for the file and the main highlight/note loop.


## Roadmap 

-   [X] Export to org-roam format
-   [X] Enable markdown export
-   [X] Use ChatGPT to generate headings for the notes
-   [ ] Use chatGPT to summarise all notes in the boo
-   [ ] Detect similar notes or mark notes as duplicates

## Templates 

Pass the name of the template in the command line params to configure the output format of the highlights and notes.

### Base Config 

The base config contains information regarding the template. Right now it only contains the file extension

```json
{
  "format": "md"
}
```


### File header

By default kindle clip pulls each book into it's own file. If a file already exists for that book it will append to the file, not overwriting any modifications you've made to notes. One important thing to understand is if you remove a note from the file and it's ID is also removed then the note or highlight will be re-imported and added to the end of the file. So you may find random highlights littering your new import if you removed any. To avoid this simply leave the ID for the note in the file, when removing the highlight. In the future I'll provide a better way of skipping notes but for the time being this works.

When creating a new file we need to specify a file header. Do this by defining an `header.hbs` file. When writing a brand new book this template is rendered. Usually this is where you'll put generic information related to the book such as the author, title, and the book id.

| name             | type   | value                  | nullable |
|------------------|--------|------------------------|----------|
| author           | object | the author of the book | true     |
| author.firstname | string | Authors firstname      | true     |
| author.lastname  | string | Authors surname        | true     |
| title            | string | the title of the book  | true     |
| id               | string | A guid id for the book | false    |

```md
---
id: {{bookId}}
title: {{title}}
---
```


### Main content 

The main content is generated using the `content.hbs` file. This is where you can specify how highlights are layed out along with their notes. Currently notes are attached to highlights as a property but I'm starting to rethink how this works, as it may not always be the case that a note should be a child of a highlight. In some cases you may want to link a note to the parent highlight but generate it as it's own thing. With the current system that may be rather tricky as notes are not independent of a highlight and thus will always have the context of a highlight when they're being written out.

For each highlight you have access to the following information.

| name         | type   | value                                         | nullable |
|--------------|--------|-----------------------------------------------|----------|
| title        | string | Title of the note                             | false    |
| content      | string | The contents of the highlight                 | false    |
| page         | string | The page number the highlight was made on     | true     |
| location     | string | The kindle location the highlight was made on | true     |
| date         | string | The date the highlight was made               | true     |
| note         | object | The note associated with this highlight\`     | true     |
| note.content | string | The Content of the note                       | false    |
| note.date    | string | The date the note was made                    | false    |
| note.id      | string | A guid id representing the note               | string   |
| id           | string | A guid identifying the highlight              | string   |

```md
{{#each this}}
# {{headline}}

> {{content}}
> - {{#if page}}Page {{page}},{{/if}}{{#if location}} Location {{location}},{{/if}} {{#if date}}Date {{date}}{{/if}}

- {{id}}

#Kindle #Quote

{{#if note}}
## Note

{{note.content}}
- {{note.date}}

#KindleNote

{{/if}}
{{/each}}
```


### How to create a template 

1.  Create a new folder in the `templates` directory. Name it whatever you like, this is what you'll be passiing as the command line parameter later.
2.  In the new folder create a file named `config.json` this is the config for the template. All we need right now is to add a `extension` property to the object. This should be the file extension you want to write to. In the case of markdown it would be `md`. You'll end up with something like `{ extension: "md" }`
3.  Create another file called `header.hbs` in this file add the heading for the file you want. This template will only be called once when anew file is created. See the section on file headers for [a full list of available prooperties.](#file-header)
4.  Finally add a `content.hbs` file. This is called for every highlight and accompanying note. A full list of available properties [is linked in the section above](#main-content).
