export function commonParse(element) {
  const result = {
    ...element.businessObject,
    ...element.businessObject.$attrs
  }
  return formatJsonKeyValue(result)
}

export function formatJsonKeyValue(result) {
  // 移除flowable前缀，格式化数组
  for (const key in result) {
    if (key.indexOf('flowable:') === 0) {
      const newKey = key.replace('flowable:', '')
      result[newKey] = result[key]
      delete result[key]
    }
  }
  result = documentationParse(result)
  return result
}

export function documentationParse(obj) {
  if ('documentation' in obj) {
    let str = ''
    obj.documentation.forEach(item => {
      str += item.text
    })
    obj.documentation = str
  }
  return obj
}

export function conditionExpressionParse(obj) {
  if ('conditionExpression' in obj) {
    obj.conditionExpression = obj.conditionExpression.body
  }
  return obj
}

export function userTaskParse(obj) {
  for (const key in obj) {
    if (key === 'candidateUsers') {
      obj.userType = 'candidateUsers'
      obj[key] = obj[key]?.split(',') || []
    } else if (key === 'candidateGroups') {
      obj.userType = 'candidateGroups'
      obj[key] = obj[key]?.split(',') || []
    } else if (key === 'assignee') {
      obj.userType = 'assignee'
    }
  }
  return obj
}
