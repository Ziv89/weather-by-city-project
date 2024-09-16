import React, { useState, useEffect, useCallback } from 'react';
import Search from "../components/search";
import useLocalStorageState from "../data/useLocalStorageState";
import { Theme } from "@radix-ui/themes";
import WeatherCard from "../components/Card";
import "../App.css";
import { debounce } from '../utilis/debounce'; 
import { readFavoritesFromLocalStorage, writeFavoritesToLocalStorage } from '../data/localStorageData';

const Main = ({ isMetric }) => {
  const [localFavorites, setLocalFavorites] = useLocalStorageState("localFavorites");
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityWeatherData, setCityWeatherData] = useState(null);

  // Debounced function to fetch city options
  const fetchCities = useCallback(
    debounce((searchTerm) => {
      if (searchTerm) {
        fetch(
          `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=rWcJtE6eqJ18yZR2VONEpBLSEedKAY22&q=${searchTerm}`,
          { method: "GET" }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const formattedOptions = data.map((item) => ({
              id: item.Key,
              city: item.LocalizedName,
            }));
            setOptions(formattedOptions);
          })
          .catch((error) => console.error("Error fetching city data:", error));
      } else {
        setOptions([]);
      }
    }, 500),
    []
  );
  

  useEffect(() => {
    fetchCities(search);
  }, [search, fetchCities]);

  useEffect(() => {
    if (selectedCity) {
      fetch(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${selectedCity.id}?apikey=rWcJtE6eqJ18yZR2VONEpBLSEedKAY22`,
        { method: "GET" }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setCityWeatherData(data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setCityWeatherData(null);
        });
    }
  }, [selectedCity]);

  const onInputChange = (event) => {
    setSearch(event.target.value);
  };

  const onAddCityToFavorite = (city) => {
    if (city && city.id) {
      let updatedFavorites = readFavoritesFromLocalStorage();

      if (updatedFavorites.includes(city.id)) {
        updatedFavorites = updatedFavorites.filter(id => id !== city.id);
      } else {
        updatedFavorites.push(city.id);
      }

      writeFavoritesToLocalStorage(updatedFavorites);
      setLocalFavorites(updatedFavorites);
    }
  };

  const onCitySelected = (city) => {
    setSelectedCity(city);
  };

  return (
    <Theme>
      <div className="App container mt-2 mb-3">
        <Search
          options={options}
          onInputChange={onInputChange}
          citySelected={onCitySelected}
          addCityToFavorite={onAddCityToFavorite}
        />
        {selectedCity && (
          <h2>The Weather for the next five days in {selectedCity.city} is :</h2>
        )}
        <div className="cards-container">
          {cityWeatherData?.DailyForecasts?.map((forecast, index) => (
            <WeatherCard
              key={index}
              min={isMetric ? (5 / 9 * (forecast.Temperature.Minimum.Value - 32)).toFixed(0) : forecast.Temperature.Minimum.Value}
              max={isMetric ? (5 / 9 * (forecast.Temperature.Maximum.Value - 32)).toFixed(2) : forecast.Temperature.Maximum.Value}
              type={isMetric ? "C" : "F"}
              summeryDay={forecast.Day.IconPhrase}
              summeryNight={forecast.Night.IconPhrase}
              date={forecast.Date}
              iconDay={`${forecast.Day.Icon > 10 ? forecast.Day.Icon : `0${forecast.Day.Icon}`}-s`}
              iconNight={`${forecast.Night.Icon > 10 ? forecast.Night.Icon : `0${forecast.Night.Icon}`}-s`}
              isFavorites={false}
              cityName={forecast.Link}
              index={index}
            />
          ))}
        </div>
      </div>
    </Theme>
  );
};

export default Main;