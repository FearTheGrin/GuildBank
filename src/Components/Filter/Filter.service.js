import Service from '../../Services/Service/Service';

// Data
import { mainCategories } from '../../Models/Filter/Filter.data.js';

export default class FilterService extends Service{
  constructor(config) {
    super('FilterService',config);
  }

  getFilterEntries(selectedFilters) {
    return mainCategories.getFilterEntries(selectedFilters);
  }

  buildTextFilterPattern(userInput, isStrictOnly){
    let textPattern = '';
    if(isStrictOnly){
      textPattern  = userInput;
    } else {
      textPattern = userInput.split("").reduce((a,b) => { return a+'[^'+b+']*'+b });
    }
    let regPattern = textPattern ? textPattern : '.*';
    this.logger.debug('Filter text pattern:',regPattern);
    return new RegExp(regPattern,'i');
  }

runTextFilter(dataIn, textFilter, isTextFilterStrict) {
  if (!textFilter) { //if it's empty we don't need to do anything
    return dataIn;
  }
  let pattern = this.buildTextFilterPattern(textFilter, isTextFilterStrict);
  return dataIn.filter(item => {
    return pattern.test(item.name)
  });
}

  filter(data, selectedFilters, textFilter, isTextFilterStrict) {
    let filtered = data.filter(item => {
      return mainCategories.filter(item, selectedFilters);
    });
    this.logger.debug('filtered!',filtered);

    let fullyFiltered = this.runTextFilter(filtered, textFilter, isTextFilterStrict);
    return fullyFiltered;
  }
};
