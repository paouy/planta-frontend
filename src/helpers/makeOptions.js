const makeOptions = (source, labelKey, valueKey) => {
  const options = source.map(item => {
    return {
      label: item[labelKey],
      value: item[valueKey]
    }
  })

  return options
}

export default makeOptions