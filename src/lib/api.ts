const API_KEY = process.env.ODDS_API_KEY
const BASE_URL = "https://api.the-odds-api.com/v4"

export async function getSports() {
    const response = await fetch(`${BASE_URL}/sports`, {
        headers: {
            "apiKey": API_KEY as string,
        },
    })
    return response.json()
}

export async function getOdds(sportKey: string) {
    const response = await fetch(`${BASE_URL}/odds`, {
        headers: {
            "apiKey": API_KEY as string,
            "sport": sportKey,
            "region": 'br',
            "markets": 'h2h',
            "spreads": 'true',
            "totals": 'true',
        },
    })
    return response.json()
}

export async function getOddsById(sportKey: string, eventId: string) {
    const odds = await getOdds(sportKey)
    const event = odds.find((event: any) => event.id === eventId)
    return event
}