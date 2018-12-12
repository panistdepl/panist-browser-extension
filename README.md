# panist-web-extension

A basic add-on for identifying dynamically PANIST resources in the browser pages.

At the present time, 2 versions are available : one for Mozilla Firefox, the other for Google Chrome.

## Functionalities

This add-on performs the following task:

* Add an PANIST button next to any DOI, OpenUrl and PMID found in the browser page in case the corresponding document is present in PANIST, based on the PANIST OpenURL service. Clicking on the PANIST button will open a new tab with opening the corresponding PDF, assuming that the access to the PANIST full-texts is authorized. 

## Supported identifiers and protocols

Linking work at item level (e.g. article) and will try to identifying the following identifiers in the web page:

* OpenURL 1.0, including COInS - link resolver prefixes will be examined in case of SFX and Proquest 360 Link
* DOI
* PubMed ID (PMID)
* Publisher Item Identifier (PII)

## Supported browser

Currently: 

* Firefox
* Chrome

## Examples

* Example of links on a Wikipedia page: https://fr.wikipedia.org/wiki/Virus_Zika

## How to install

If you just want to install the extension, please visit https://addons.panist.fr and click on the big "Install" button.

If you use Google Chrome, you can alose visit the [extension's homepage on the Chrome Web Store](https://chrome.google.com/webstore/detail/panist/ohfemcgmkmcgcidiiaoimjphkndbeckj?hl=fr) and click on the "Add to Chrome" button.

## Developers

How to build the xpi:
```
npm i
npm run build
```

How to run the web extension in developer mode with firefox (you need to install firefox >= 49):
```
npm i
npm run run
``` 
It will open firefox on this page https://fr.wikipedia.org/wiki/Virus_Zika with the panist-web-extension loaded. 
