import React, { useState, useEffect } from 'react';
import { Theme } from '@radix-ui/themes';
import useLocalStorageState from '../data/useLocalStorageState'; // Custom hook for managing local storage
import WeatherCard from '../components/Card';
import "@radix-ui/themes/styles.css";

const Favorite = ({ isMetric }) => {
  const [localFavorites, setLocalFavorites] = useLocalStorageState('localFavorites', '[]'); // Initialize with default empty array as string
  const [cityWeatherData, setCityWeatherData] = useState([]);

  useEffect(() => {
    // Function to validate and parse favorites
    const parseFavorites = (favorites) => {
      if (typeof favorites === 'string') {
        try {
          // Try to parse as JSON string
          const parsedFavorites = JSON.parse(favorites);

          // Ensure parsed data is an array
          if (Array.isArray(parsedFavorites)) {
            return parsedFavorites;
          } else {
            console.warn("Parsed favorites is not an array. Resetting to an empty array.");
            setLocalFavorites('[]'); // Reset to an empty array if invalid
            return [];
          }
        } catch (error) {
          console.error("Invalid JSON format in localFavorites:", error);
          // Attempt to fix if it's a simple comma-separated string (e.g., "id1,id2")
          const correctedFavorites = favorites.split(',').map(id => id.trim()).filter(id => id); // Filter empty values
          setLocalFavorites(JSON.stringify(correctedFavorites)); // Save corrected array back as JSON
          return correctedFavorites;
        }
      } else if (Array.isArray(favorites)) {
        // If already an array, return it directly
        return favorites;
      } else {
        console.warn("Favorites is neither a string nor an array. Resetting to an empty array.");
        setLocalFavorites('[]');
        return [];
      }
    };

    const fetchWeatherForFavorites = async () => {
      // Validate and parse favorites safely
      const parsedFavorites = parseFavorites(localFavorites);

      // Check if there are any valid favorites
      if (parsedFavorites.length === 0) {
        console.log("No valid favorite cities found in local storage.");
        setCityWeatherData([]); // Clear weather data if no valid favorites
        return;
      }

      // Fetch weather data for each favorite city
      const fetchPromises = parsedFavorites.map(async (cityId) => {
        try {
          const response = await fetch(
            `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityId}?apikey=rWcJtE6eqJ18yZR2VONEpBLSEedKAY22`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch weather data for city ID: ${cityId}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching weather data for city ID ${cityId}:`, error);
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      const validData = results.filter(data => data !== null);
      setCityWeatherData(validData);
    };

    fetchWeatherForFavorites();
  }, [localFavorites, setLocalFavorites]);

  return (
    <Theme>
      <div className="App container mt-2 mb-3">
        <div className="cards-container">
          {cityWeatherData.length > 0 ? (
            cityWeatherData.map((cityData, index) => (
              <div key={index}>
                {cityData.DailyForecasts?.map((forecast, forecastIndex) => (
                  <WeatherCard
                    key={forecastIndex}
                    min={
                      isMetric
                        ? ((5 / 9) * (forecast.Temperature.Minimum.Value - 32)).toFixed(0)
                        : forecast.Temperature.Minimum.Value
                    }
                    max={
                      isMetric
                        ? ((5 / 9) * (forecast.Temperature.Maximum.Value - 32)).toFixed(2)
                        : forecast.Temperature.Maximum.Value
                    }
                    type={isMetric ? 'C' : 'F'}
                    summeryDay={forecast.Day.IconPhrase}
                    summeryNight={forecast.Night.IconPhrase}
                    date={forecast.Date}
                    iconDay={forecast.Day.Icon > 9 ? `${forecast.Day.Icon}-s` : `0${forecast.Day.Icon}-s`}
                    iconNight={forecast.Night.Icon > 9 ? `${forecast.Night.Icon}-s` : `0${forecast.Night.Icon}-s`}
                    isFavorites={true}
                    cityName={forecast.Link}
                    index={forecastIndex}
                  />
                ))}
              </div>
            ))
          ) : (
            <p>No favorite cities selected.</p>
          )}
        </div>
      </div>
    </Theme>
  );
};

export default Favorite;