export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}
export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}
export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString
}
export function allToggleClass (element, className) {
  if (!element || !className) {
    return
  }
  element.className = className
}
export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}
export function convertTreeData(rows, attributes) {
    var keyNodes = {}, parentKeyNodes = {};
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      row.id = row[attributes.keyField];
      row.parentId = row[attributes.parentKeyField];
      // row.text = row[attributes.textField];
      row.expanded = row[attributes.expanded]?true:false
      row.checked = row[attributes.checked]?true:false
      row.indeterminate = row[attributes.indeterminate]?true:false
      row.children = [];

      keyNodes[row.id] = row;

      if (parentKeyNodes[row.parentId]) { parentKeyNodes[row.parentId].push(row); }
      else { parentKeyNodes[row.parentId] = [row]; }

      var children = parentKeyNodes[row.id];
      if (children) { row.children = children; }

      var pNode = keyNodes[row.parentId];
      if (pNode) { pNode.children.push(row); }
    }
    return parentKeyNodes[attributes.rootParentId];
}