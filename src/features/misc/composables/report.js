import api from '../../../api/index.js'

export const useReport = () => {
  const saveAsCsv = async (productionRecords) => {
    const metafields = await api.metafield.getAll({ resource: 'OPERATION' })

    const rowObjects = productionRecords.map(data => {
      const rowObject = {
        'DATE': new Date(data.timestamp).toLocaleDateString('en-CA'),
        'PRODUCT': `"${data.productSku}"`,
        'OPERATION': `"${data.operation.name}"`,
        'WORKSTATION': `"${data.workstation?.name}"`,
        'TYPE': data.type,
        'WORKER': `"${data.worker?.name}"`,
        'EQUIPMENT': `"${data.equipment?.name || ''}"`,
        'QTY': data.qty,
        'DURATION_MINS': data.timeTakenMins
      }

      metafields.forEach(metafield => {
        const metafieldName = metafield.name.toUpperCase().replaceAll(' ', '_')
        
        if (data.meta !== null && data.meta[metafield.id]) {
          const { value, uom } = data.meta[metafield.id]
          
          rowObject[metafieldName] = `"${value}${uom || ''}"`
        } else {
          rowObject[metafieldName] = ''
        }
      })

      return rowObject
    })

    const heading = Object.keys(rowObjects[0]).join(',') + '\n'
    const rows = rowObjects.map(row => Object.values(row).join(',')).join('\n')
    const csvString = heading + rows

    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'report.csv'
    link.click()
    
    URL.revokeObjectURL(url)
  }

  return {
    saveAsCsv
  }
}