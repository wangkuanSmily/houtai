import { queryList as query, addItem as add, editItem as edit } from './action'

const entityName = 'guestRoom'

export function queryList(data) {
  return query(data, entityName)
}

export function editItem(data) {
  return edit(data, entityName)
}

export function addItem(data) {
  return add(data, entityName)
}
