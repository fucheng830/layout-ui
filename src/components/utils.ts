interface TRowAST {
    tag: string,
    css: string[],
    style: any[],
    innerText?: string,
    children: TRowAST[]
}
interface TcreaterHtml {
    view: string
}
interface TsetTreeData {
    path: number[],
    value: string,
    childrenName: string
}

let createTag = (item: TRowAST, inner?: string): string => {
    let cssStr: string = item.css.length > 0 ? ` class="${item.css.join(' ')}"`
        : ''
    let childrenHtml: string
    if (item.children.length > 0) {
        childrenHtml = item.children.map(item => {
            return createTag(item, item.innerText)
        }).join('')
    } else {
        childrenHtml = inner || ''
    }
    return `<${item.tag}${cssStr}>${childrenHtml}</${item.tag}>`
}

export const createHtml = (rowInfo: TRowAST[]): TcreaterHtml => {
    let view: string = rowInfo.map(item => {
        return createTag(item, item.innerText)
    }).join('')
    return { view }
}
export const getTreeVal = <T>(_object: T, key: string): any => {
    if (typeof _object !== typeof {}) {
        new Error('params error')
        return _object
    }
    let copy = (e: any) => JSON.parse(JSON.stringify(e))
    let keys = key.split('.')
    let objecChildren
    for (let e of keys) {
        objecChildren = copy(objecChildren || _object)[e]
    }
    return objecChildren
}
export const setTreeData = <T>(_data: any, { path, childrenName, value }: TsetTreeData): T => {
    let copy = (e: any) => JSON.parse(JSON.stringify(e))
    let data: any = copy(_data)
    let deepSearch = (tree: any, path: any) => {
        tree[childrenName][path[0]] && path.length > 1
            ? tree[childrenName][path[0]] = deepSearch(tree[childrenName][path[0]], path.clice(1))
            : tree[childrenName][path[0]] = value
        return tree
    }
    data[path[0]] = path.length > 1 ? deepSearch(data[path[0]], path.slice(1)) : value
    return data
}