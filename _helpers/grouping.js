function groupCommunicationResultByLoop(result) {
  grouped = {}
  for (item of result) {
    if (!grouped[item.ciclo]) {
      grouped[item.ciclo] = {}
    }
    grouped[item.ciclo][item.name] = item.amount
  }
  return grouped
}

function groupIssuesResultOverviewByLoop(result) {
  grouped = {}
  for (item of result) {
    if (!grouped[item.ciclo]) {
      grouped[item.ciclo] = {}
    }

    grouped[item.ciclo] = { detectado: item.detectado, corregido: item.corregido }
  }
  return grouped
}

function groupIssuesResultByLoop(result) {
  grouped = {}
  for (item of result) {
    if (!grouped[item.ciclo]) {
      grouped[item.ciclo] = { detectado: {}, corregido: {}, fixflag: {} }
    }
    grouped[item.ciclo]['detectado'][item.nombre] = item.detectado
    grouped[item.ciclo]['corregido'][item.nombre] = item.corregido
    grouped[item.ciclo]['fixflag'][item.nombre] = item.fixflag
  }
  return grouped
}

function groupPerformancesResultByLoop(result) {
  grouped = {}
  for (item of result) {
    if (!grouped[item.ciclo]) {
      grouped[item.ciclo] = {}
    }
    if (!grouped[item.ciclo][item.nombre]) {
      grouped[item.ciclo][item.nombre] = {}
    }

    grouped[item.ciclo][item.nombre][item.nombre_resultado] = item.cantidad
  }
  return grouped
}

module.exports = { groupCommunicationResultByLoop, groupIssuesResultByLoop, groupPerformancesResultByLoop, groupIssuesResultOverviewByLoop };