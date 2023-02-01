import { readTextFile } from './file'
import { BaseView } from '../view/BaseView'
import { ResizeView } from '../view/ResizeView'
import { TextView } from '../view/TextView'
import { EditText } from '../view/EditText'

const {parseString} = require('xml2js')

const createView = (name: string, props: any, idMap: Map<string, BaseView>) => {
  let view: BaseView
  switch (name) {
    case 'BaseView':
      view = new BaseView(props)
      break
    case 'ResizeView':
      view = new ResizeView(props)
      break
    case 'TextView':
      view = new TextView(props)
      break
    case 'EditText':
      view = new EditText(props)
      break
  }
  props?.id && idMap.set(props.id, view)
  return view
}

const createRootView = (children: object, idMap: Map<string, BaseView>): BaseView => {
  const root = Object.keys(children)[0]
  const rootProps = children[root]['$']
  return generateLayout(createView(root, rootProps, idMap), children[root], idMap)
}

const createChildren = (parent: BaseView, children: object, idMap: Map<string, BaseView>): BaseView => {
  const childrenList = Object.keys(children)
  childrenList.forEach((childName, index) => {
    if (index === 0) return
    const child = children[childName]
    child.forEach(item => {
      const childProps = item['$']
      const {x = 0, y = 0} = childProps
      const view = createView(childName, childProps, idMap)
      parent.add(view, x, y)
      if (Object.keys(item).length > 1) generateLayout(view, item, idMap)
    })
  })
  return parent
}

const generateLayout = (parent: BaseView, children: object, idMap: Map<string, BaseView>): BaseView => {
  if (parent === null) {
    return createRootView(children, idMap)
  } else {
    return createChildren(parent, children, idMap)
  }
}

const convertValue = (json: object): object => {
  const keys = Object.keys(json)
  keys.forEach(key => {
    if (typeof json[key] === 'object') {
      convertValue(json[key])
    } else {
      if (json[key] === 'true') {
        json[key] = true
      } else if (json[key] === 'false') {
        json[key] = false
      } else if (json[key] === '') {
        json[key] = ''
      } else if (!isNaN(Number(json[key]))) {
        json[key] = Number(json[key])
      }
    }
  })
  return json
}

export const parseLayout = async (filename: string): Promise<[BaseView, Map<string, any>]> => {
  const file = `${process.cwd()}/layout/${filename}.xml`
  const xml = await readTextFile(file)

  return await new Promise(resolve => {
    parseString(xml, (_, json) => {
      const idMap = new Map<string, BaseView>()
      resolve([generateLayout(null, convertValue(json), idMap), idMap])
    })
  })
}