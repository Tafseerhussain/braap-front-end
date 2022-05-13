export function getScrollBarWidth() {
    var inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    var outer = document.createElement('div')
    var outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    var widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    var widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
        widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)
    return widthContained - widthScroll
}

export function deepCopy(data) {
    const t = typeOf(data)
    let o

    if (t === 'array') {
        o = []
    } else if (t === 'object') {
        o = {}
    } else {
        return data
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]))
        }
    } else if (t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i])
        }
    }
    return o
}

function typeOf(obj) {
    const toString = Object.prototype.toString
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    return map[toString.call(obj)]
}