const BCB_SELIC_SERIES_URL =
  'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json'

interface BcbRecord {
  data: string
  valor: string
}

export async function fetchSelicRate(): Promise<number> {
  const res = await fetch(BCB_SELIC_SERIES_URL)
  if (!res.ok) throw new Error(`BCB API respondeu com status ${res.status}`)
  const json: BcbRecord[] = await res.json()
  const dailyRate = parseFloat(json[0]?.valor)
  if (isNaN(dailyRate)) throw new Error('Resposta inv\u00E1lida da API do BCB')
  return +((Math.pow(1 + dailyRate / 100, 252) - 1) * 100).toFixed(2)
}
