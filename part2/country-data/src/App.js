import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [allCountries, setAllCountries] = useState(null);
  const [shownWeather, setShownWeather] = useState(null);
  const [shownCountry, setShownCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then((res) => {
      setAllCountries(res.data);
    });
  }, []);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    filterCountries(e.target.value);
  };

  const filterCountries = (name) => {
    const filtered = allCountries.filter((country) => {
      const common = country.name.common.toLowerCase();
      const official = country.name.official.toLowerCase();
      return common.includes(name.toLowerCase()) || official.includes(name.toLowerCase());
    });
    setFilteredCountries(filtered);
  };

  const showCountry = (country) => {
    setShownCountry(country);
    getWeather(country.capital[0]);
    setQuery("");
  };

  const getWeather = (capital) => {
    axios
      .get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1&language=en&format=json`
      )
      .then((res) => {
        const geoloc = res.data.results[0];
        return axios
          .get(
            `https://api.open-meteo.com/v1/forecast?latitude=${geoloc.latitude}&longitude=${geoloc.longitude}&current_weather=true`
          )
          .then((res) => {
            const data = res.data.current_weather;
            const weather = {
              capital: capital.name,
              temp: data.temperature,
              wind: data.windspeed,
            };
            setShownWeather(weather);
          });
      });
  };

  return (
    <main>
      Search <input value={query} onChange={handleQueryChange} />
      <div>
        {filteredCountries &&
          filteredCountries.length <= 10 &&
          filteredCountries.map((country) => {
            return (
              <div key={country.cca2}>
                {country.name.common}
                <button onClick={() => showCountry(country)}>SHOW</button>
              </div>
            );
          })}
        {shownCountry && <Country country={shownCountry} weather={shownWeather} />}
      </div>
    </main>
  );
};

const Country = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      <p>
        <b>Languages:</b>
      </p>
      <ul>
        {Object.entries(country.languages).map((language) => (
          <li key={language[1]}>{language[1]}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
      {weather && (
        <>
          <h3>Weather in {country.capital[0]}:</h3>
          <p>Temperature: {weather.temp}°C</p>
          <p>Wind: {weather.wind} km/h</p>
        </>
      )}
    </div>
  );
};

export default App;
