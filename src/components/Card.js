// WeatherCard.js
import React from 'react';
import '@radix-ui/themes/styles.css';
import { Card } from '@radix-ui/themes';
import { MinusIcon } from '@radix-ui/react-icons';
import '../styles.css';

function WeatherCard({ min, max, type, summeryNight, date, iconDay, iconNight, isFavorites, cityName, index }) {
  // Extract and format the city name from the URL
  const cityNameFromUrl = cityName.split('/').filter((part) => part !== '')[4];
  const formattedCityName = cityNameFromUrl.charAt(0).toUpperCase() + cityNameFromUrl.slice(1);

  return (
    <>
      {isFavorites && index === 0 && (
        <div className="divdate">
          <h2 className="temprature">{formattedCityName}</h2>
        </div>
      )}
      <Card className={isFavorites && index === 0 ? 'weather-card first-card' : 'weather-card'}>
        <div className="card">
          <div className="left-div">
            <div className="divdate">
              <h2 className="innerdate">{new Date(date).toLocaleString(undefined, { weekday: 'long' })}</h2>
            </div>
            <div className="summerydaydiv">
              <img src={`https://developer.accuweather.com/sites/default/files/${iconDay}.png`} alt="Day icon" />
              <img src={`https://developer.accuweather.com/sites/default/files/${iconNight}.png`} alt="Night icon" />
            </div>
          </div>
          <div className="right-div">
            <div className="tempratures">
              <MinusIcon />
              <h2 className="temprature">
                {min}&deg; <label className="tempraturetype">{type}</label>
              </h2>
            </div>
            <div className="tempratures">
              <MinusIcon />
              <h2 className="temprature">
                {max}&deg; <label className="tempraturetype">{type}</label>
              </h2>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default WeatherCard;