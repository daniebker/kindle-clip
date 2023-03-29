# Kindle-clip

This package parses a kindle `MyClippings.txt` and outputs to a variety of formats. 

Using the plugin architecture it's possible to add new types or processors to export clippings to a variety of formats. 

## Features

- Adds an ID to each highlight. When importing, the processor can check the target file to see if the id already exists. If it does then the highlight can be skipped. 
- Attaches notes to the previous highlight
  - Notes are scanned and autmatically added to the previous highlight. 
- Bookmarks are skipped

## Roadmap

- [ ] Export to org-roam format
- [ ] Enable markdown export