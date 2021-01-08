import axios from 'axios'
const baseUrl = 'https://restcountries.eu/rest/v2/name/'
const urlEnd = '?fullText=true'

const getCountry = async (country) => {
    const response = await axios.get(baseUrl + country + urlEnd)
    return response.data
}

export default { getCountry }