/**
 * Return an obj of array by Id
 * @param {*} id
 * @param {*} array
 */
export function getObjById(id, array) {
  return array.find(function(el) {
    return el.id == id
  })
}

/**
 * add object to or alter obj in array
 * @param {obj} obj
 * @param {array} array
 */
export function mutateArray(obj, array) {
  if (typeof obj.id == 'undefined') {
    // add new
    obj.id = getMaxId(array) + 1
    array.push(obj)
  } else {
    // update existing
    const targetIndex = array.findIndex(el => {
      return el.id == obj.id
    })
    array[targetIndex] = obj
  }

  return array
}

/**
 * Find Index of given obj in given array, if found remove and return mutated array
 * @param {*} id
 * @param {*} array
 */
export function deleteObjInArrayById(id, array) {
  const targetIndex = array.findIndex(el => {
    return el.id == id
  })

  if (targetIndex != -1) {
    array.splice(targetIndex, 1)
  }

  return array
}

/**
 * get maxId of array with objects, which contain prop obj.id
 * @param {array} array
 */
export function getMaxId(array) {
  var maxId = 0
  array.forEach(obj => {
    if (maxId < obj.id) {
      maxId = parseInt(obj.id)
    }
  })
  return maxId
}

export function isEmpty(value) {
  switch (typeof value) {
    case 'undefined':
      return true
    case 'object':
      return value === null
        ? true
        : Array.isArray(value)
        ? !value.length
        : Object.entries(value).length === 0 && value.constructor === Object
    case 'string':
      return !value.length
    default:
      return false
  }
}
