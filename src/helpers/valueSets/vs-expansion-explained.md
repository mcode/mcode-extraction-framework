# Generating New Valuesets

Follow the steps below to generate a new set of valuesets based on the latest version of mCODE's IG.

1. Clone the fhir-mCODE-ig locally and build the IG. This will, among other things, ensure you have all mCODE Valuesets locally. You can find that code and setup instructions here on [HL7's GitHub](https://github.com/HL7/fhir-mCODE-ig).
2. Move all ValueSets into a folder, for ease of access by the MEF'S `vs-expansion-script`. Below is a series of commands that will help with this (on OSX), but you could also do this manually.
   `cd some/path/to/local/fhir-mCODE-ig/output && mkdir valuesets && find * -name "Value*.json" | xargs -I '{}' cp {} ./valuesets`
3. Remove all irrelevant ValueSets from this folder, leaving behind only the ones to be expanded. 
4. In the MEF, update the`PREEXPANSIONPATH` global variable in `vs-expansion-script.js` to point to the folder made to house the ValueSets in step 2.
5. Run `vs-expansion-script.js` using node.
