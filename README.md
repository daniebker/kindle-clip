# Kindle-clip

[![asciicast](https://asciinema.org/a/o86OlQSHf2VkkMCs1neQjjwok.svg)](https://asciinema.org/a/o86OlQSHf2VkkMCs1neQjjwok)

This package parses a kindle `MyClippings.txt` and outputs to a variety of formats. 

Using the plugin architecture it's possible to add new types or processors to export clippings to a variety of formats. 

## Features

- Adds an ID to each highlight. When importing, the processor can check the target file to see if the id already exists. If it does then the highlight can be skipped. 
- Attaches notes to the previous highlight
  - Notes are scanned and autmatically added to the previous highlight. 
- Bookmarks are skipped

## Usage 

``` sh
node index.js ~/path/to/My Clippings.txt ~/output/path/
```

## Templating

Handlebars is used for tempalteing. Right now there's only suport for org-roam in the tempaltes, but it should be simple enough to add others. The templates need to be in two parts, a header for the file and the main highlight/note loop.
## Issues

- [ ] Creates files in dir where script is run

## Roadmap

- [x] Export to org-roam format
- [ ] Enable markdown export
- [ ] Use ChatGPT to generate headings for the notes
- [ ] Use chatGPT to summarise all notes in the boo
- [ ] Detect similar notes or mark notes as duplicates
