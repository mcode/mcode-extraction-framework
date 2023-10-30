const { AggregateMapper } = require('fhir-mapper');
const fhirpath = require('fhirpath');

// Mapping of resource tyoe to FHIR date property / format
// This is based on what date type our CSV extractors output
// for example, Observation could have any of the effectiveX date types, but we output effectiveDateTime
const DateFormatByResourceType = {
  Observation: 'effectiveDateTime',
  Condition: 'extension.valueDateTime',
  // TODO add other resource types and their associate dates
  // OR write code to check for all date formats
};


// Excludes resources of a specified type from a bundle if they are outside the given date range
class DateFilterMapper extends AggregateMapper {
  constructor(resourceType, startDate = null, endDate = null) {
    const resourceMapping = {
      filter: (r) => r.resource.resourceType === this.resourceType,
      exclude: (r) => {
        const date = fhirpath.evaluate(r.resource, DateFormatByResourceType[this.resourceType])[0];
        const time = new Date(date).getTime();
        const start = (new Date(this.startDate)).getTime();
        const end = (new Date(this.endDate)).getTime();
        return (this.endDate && (time > end)) || (this.startDate && time < start);
      },
      exec: (resource) => resource,
    };

    super(resourceMapping, {});

    this.startDate = startDate;
    this.endDate = endDate;
    this.resourceType = resourceType;
  }
}

module.exports = {
  DateFilterMapper,
};
