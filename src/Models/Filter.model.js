import Logger from '../Services/Logger.service';

export class FilterEntry {
  constructor(displayName, value, targetProperty) {
    this.displayName = displayName;
    this.value = value;
    this.targetProperty = targetProperty;
    this.log = new Logger('FilterEntry: '+displayName);
    // this.log.setLogLevel(5);
  }

  /**
   *
   * @param {FilterList} subFilter
   */
  setSubFilter(subFilter) {
    this.subFilter = subFilter;
  }

  getFilterEntries(path) {
    if (!path || !this.subFilter) { return []; }
    return this.subFilter.getFilterEntries(path);
  }

  getSubFilter() {
    return this.subFilter;
  }

  simpleFilter(item) {
    let isMatch = item[this.targetProperty] === this.value;
    this.log.debug('Simple filter:',item[this.targetProperty],'==',this.value,'?',isMatch);
    return isMatch;
  }

  /**
   * @param {obj} item
   * @returns {boolean} Does item match filter?
   */
  filter(item, path) {
    // If we don't have a path, this is the last stop. Test it.
    if (!path || !path.length){
      this.log.debug('No path. Using simple filter.');
      return this.simpleFilter(item);
    }

    let id = path[0],
        rest = [];

    // if the first item in the path doesn't point here, it isn't a match.
    if (this.value !== id && this.displayName !== id){
      this.log.debug('This item (',this.value,') does not match the given path:',id);
      return false;
    }
    for (let i = 1; i < path.length; i += 1) {
      rest.push(path[i]);
    }

    // If the path ends here, test the item.
    if (!rest.length || !rest[0]){
      this.log.debug('Last stop. Returning simple.',rest);
      return this.simpleFilter(item);
    }

    // if we've got a subfilter, pass it down
    if (this.subFilter) {
      this.log.debug('Passing it down the chain.', rest);
      return this.subFilter.filter(item, rest);
    }

    // default to simple filtering (not 100% if it is possible to get here but oh well)
    this.log.debug('Default fall-through behavior');
    return this.simpleFilter(item);
  }
}

export class FilterList {
  /**
   * @param {[string[]]} listItems - in the form of [[displayName, value], ...]
   * @param {*} targetProperty
   */
  constructor(id, listItems, targetProperty) {
    this.id = id;
    this.filterItems = {};
    this.allFilters = [];
    this.targetProperty = targetProperty;
    listItems.forEach(item => {
      let [display, value, subList] = item;
      value = value || display;
      let entry = new FilterEntry(display, value, targetProperty);
      this.filterItems[display] = entry;
      this.allFilters.push(entry);
      if (subList) {
        entry.setSubFilter(subList);
      }
    });
    this.log = new Logger('FilterList: '+this.id);
  }

  getFilterEntries(path) {
    if (!path || !path.length) return this.allFilters;
    let first = path[0];
    let element = this.filterItems[first];
    if (!first || !element) {
      return this.allFilters;
    }
    let rest = path.slice(1);
    return element.getFilterEntries(rest);

  }

  filter(item, subFilter) {
    this.log.debug('filtering',subFilter);
    if(!subFilter || subFilter.constructor !== Array || subFilter.length < 1) {
      return true;
    }
    let subPath = subFilter[0];
    let subItem = this.filterItems[subPath];
    let exists = subItem !== undefined;
    this.log.debug(['path',subPath],['subItem',subItem],['exists',exists]);
    return (subPath || true) && (exists && subItem.filter(item, subFilter));
  }
}