# Generating New Valuesets

Follow the steps below to generate a new set of valuesets based on the latest version of mCODE's IG.

1. Clone the fhir-mCODE-ig locally and _only run sushi to build FHIR resources_. This will build all mCODE Valuesets locally. You can find setup instructions for this repo on [HL7's GitHub](https://github.com/HL7/fhir-mCODE-ig). **Note**: you do not need to run the full `genonce` script; you only need to run `sushi`. 
2. Move all ValueSets into a folder, for ease of access by the MEF'S `vs-expansion-script`. Below is a series of commands that will help with this (on OSX), but you could also do this manually.
   `cd some/path/to/local/fhir-mCODE-ig/fsh-generated/resources && mkdir valuesets && find * -name "Value*.json" | xargs -I '{}' cp {} ./valuesets`
3. Remove all irrelevant ValueSets from this folder, leaving behind only the ones to be expanded. 
4. In the MEF, update the`PREEXPANSIONPATH` global variable in `vs-expansion-script.js` to point to the folder made to house the ValueSets in step 2.
5. Run `vs-expansion-script.js` using node.
6. For all failed expansions, determine if manual expansion is feasible (i.e. if there is just 1-2 codes that reference codeSystems GG's server do not support). If feasible, manually expand those VS. 