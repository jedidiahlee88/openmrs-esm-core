import { type OpenmrsResourceStrict } from './openmrs-resource';
import { type Person } from './person-resource';

export interface PatientIdentifierType extends OpenmrsResourceStrict {
  name?: string;
  description?: string;
  format?: string;
  formatDescription?: string;
  required?: boolean;
  validator?: string;
  locationBehavior?: string;
  uniquenessBehavior?: string;
  retired?: boolean;
}

export interface Patient extends OpenmrsResourceStrict {
  identifiers?: PatientIdentifier[];
  person?: Person;
  voided?: boolean;
}

export interface PatientIdentifier extends OpenmrsResourceStrict {
  identifier?: string;
  identifierType?: PatientIdentifierType;
  location?: Location;
  preferred?: boolean;
  voided?: boolean;
}
