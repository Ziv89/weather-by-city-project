
import React, { useState, useRef, useEffect } from 'react';
import '@radix-ui/themes/styles.css';
import { Theme, Button,Card } from '@radix-ui/themes'
import {MinusIcon } from '@radix-ui/react-icons'

import "../styles.css";

function FavoriteCities({ min, max, type, summeryDay, summeryNight, date, iconDay, iconNight }) {
  return (
    <Card className="favorite-city-card">
      <div className="card-content">
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
  );
}

export default FavoriteCities;