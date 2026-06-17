const BCB_SELIC_SERIES_URL =
  'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json'

interface BcbRecord {
  data: string
  valor: string
}

export function fetchSelicRate(): Promise<number> {
  return fetch(BCB_SELIC_SERIES_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`BCB API respondeu com status ${res.status}`)
      return res.json()
    })
    .then((json: BcbRecord[]) => {
      const dailyRate = parseFloat(json[0]?.valor)
      if (isNaN(dailyRate)) throw new Error('Resposta inv\u00E1lida da API do BCB')
      return +((Math.pow(1 + dailyRate / 100, 252) - 1) * 100).toFixed(2)
    })
}
