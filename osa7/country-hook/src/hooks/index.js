import { useState, useEffect } from 'react'
import countryService from '../services/countries'

export const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        countryService.getCountry(name)
            .then(countryData => {
                setCountry({ data: countryData[0], found: true })
            })
            .catch((error) => {
                setCountry({ found: false })
            })
    }, [name])

    return country
}