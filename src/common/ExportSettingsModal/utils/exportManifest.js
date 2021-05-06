import {
  acqUnitsManifest,
  contributorNameTypesManifest,
  expenseClassesManifest,
  identifierTypesManifest,
  locationsManifest,
  materialTypesManifest,
  organizationsManifest,
  usersManifest,
} from '@folio/stripes-acq-components';

import { ADDRESSES } from '../../../components/Utils/resources';

export const exportManifest = Object.freeze({
  exportVendors: {
    ...organizationsManifest,
    fetch: false,
    accumulate: true,
  },
  exportUsers: {
    ...usersManifest,
    fetch: false,
    accumulate: true,
  },
  exportAddresses: {
    ...ADDRESSES,
    fetch: false,
    accumulate: true,
  },
  exportAcqUnits: {
    ...acqUnitsManifest,
    fetch: false,
    accumulate: true,
  },
  exportContributorNameTypes: {
    ...contributorNameTypesManifest,
    fetch: false,
    accumulate: true,
  },
  exportExpenseClasses: {
    ...expenseClassesManifest,
    fetch: false,
    accumulate: true,
  },
  exportIdentifierTypes: {
    ...identifierTypesManifest,
    fetch: false,
    accumulate: true,
  },
  exportLocations: {
    ...locationsManifest,
    fetch: false,
  },
  exportMaterialTypes: {
    ...materialTypesManifest,
    fetch: false,
  },
});
