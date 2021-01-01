import React, { useState, useEffect } from 'react'
import axios from 'axios'

const CountryComponent = ({ countries, searchWord, setSearchWord, countryWeatherData }) => {

  const showCountry = (event) => {
    event.preventDefault()
    setSearchWord(event.target[0].value)
  }

  const foundCountries = countries.filter(element => element.name.toLowerCase().includes(searchWord.toLowerCase()))
  if (foundCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (foundCountries.length === 1) {
    const country = foundCountries[0]
    return (
      <div>
        <h1>{country.name}</h1>
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <h2>languages</h2>
        <ul>
          {country.languages.map(language =>
            <li key={language.name}>{language.name}</li>
          )}
        </ul>
        <img src={country.flag} alt="flag" width="100" height="auto" />
        <h2>Weather in {country.capital}</h2>
        <div><b>temperature:</b> {"temperature" in countryWeatherData ? countryWeatherData.temperature : ""} Celcius</div>
        <img src={"weather_icons" in countryWeatherData ? countryWeatherData.weather_icons[0] : ""} alt="weather_icon" width="100" height="auto" />
        <div><b>wind:</b> {"wind_speed" in countryWeatherData ? countryWeatherData.wind_speed : ""} kph direction {"wind_dir" in countryWeatherData ? countryWeatherData.wind_dir : ""}</div>
      </div>
    )
  } else {
    return (
      <div>
        {foundCountries.map(country =>
          <div key={country.name}>
            <form onSubmit={showCountry}>
              <div><input hidden readOnly value={country.name} /></div>
              <div>{country.name}<button type="submit">show</button></div>
            </form>
          </div>
        )}
      </div>
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryWeatherData, setCountryWeatherData] = useState({})
  const [searchWord, setSearchWord] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const foundCountries = countries.filter(element => element.name.toLowerCase().includes(searchWord.toLowerCase()))
    if (foundCountries.length === 1) {
      const country = foundCountries[0]
      axios
        .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital}`)
        .then(response => {
          setCountryWeatherData(response.data.current)
        })
    } else {
      setCountryWeatherData({})
    }
  }, [countries, searchWord])

  const handleSearchWordChange = (event) => {
    setSearchWord(event.target.value)
  }

  return (
    <div>
      <div>
        find countries<input value={searchWord} onChange={handleSearchWordChange} />
      </div>
      <CountryComponent countries={countries} searchWord={searchWord} setSearchWord={setSearchWord} countryWeatherData={countryWeatherData} />
    </div>
  )

}

export default App