import React, { useState, useRef, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { debounce } from '../utilis/debounce'; 
import { Theme, Button, TextField } from '@radix-ui/themes';
import { HeartIcon, MagnifyingGlassIcon, HeartFilledIcon } from '@radix-ui/react-icons';

function Search({ options, onInputChange, citySelected, addCityToFavorite }) {
  const ulRef = useRef(null);
  const inputRef = useRef(null);

  const [favoriteCities, setFavoriteCities] = useState([]);
  const [citydetails, setCityDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('localFavorites');
    if (storedFavorites) {
      setFavoriteCities(JSON.parse(storedFavorites));
    }
  }, []);

  // Check if the selected city is in favorites
  useEffect(() => {
    setIsFavorite(isCityInFavorites(citydetails?.id));
  }, [citydetails]);

  // Enable or disable button based on search input and city details
  useEffect(() => {
    setIsButtonDisabled(!searchInput.trim() || !citydetails || !citydetails.city);
  }, [searchInput, citydetails]);

  // Handle click to add/remove city from favorites
  const handleClick = (e) => {
    e.preventDefault();
    addCityToFavorite(citydetails);
    setIsFavorite(!isFavorite);
  };

  // Handle city selection from dropdown
  const handleCitySelect = (city) => {
    setCityDetails(city);
    citySelected(city);
    setSearchInput(city.city); // Update input with selected city name
    ulRef.current.style.display = 'none';
  };

  // Check if city is in favorites
  const isCityInFavorites = (cityId) => favoriteCities.includes(cityId);

  // Debounced input change handler
  const debouncedOnInputChange = useCallback(
    debounce((value) => {
      onInputChange({ target: { value } }); // Simulate the event object expected by the handler
      const city = options.find((option) =>
        option.city.toLowerCase().includes(value.toLowerCase())
      );
      setCityDetails(city || null);
      setIsButtonDisabled(!value.trim() || !city);
    }, 300),
    [options, onInputChange]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
    debouncedOnInputChange(inputValue);
  };

  // Set up click event listeners for input and outside clicks
  useEffect(() => {
    const outsideClickListener = (event) => {
      if (ulRef.current && !ulRef.current.contains(event.target)) {
        ulRef.current.style.display = 'none';
      }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
      document.removeEventListener('click', outsideClickListener);
    };
  }, []);

  return (
    <Theme>
      <div className="search-button">
        <div className="search-bar-dropdown">
          <TextField.Root
            placeholder="Search City"
            autoComplete="true"
            ref={inputRef}
            value={searchInput}
            onChange={handleInputChange}
            style={{ flex: 1 }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button
            onClick={handleClick}
            disabled={isButtonDisabled}
            className="favorite-button"
          >
            {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
          </Button>
          <ul
            id="results"
            className="list-group"
            ref={ulRef}
            style={{ overflow: 'hidden', display: options.length > 0 ? 'flex' : 'none' }}
          >
            {options.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleCitySelect(option)}
                className="list-group-item list-group-item-action"
              >
                {option.city}
              </button>
            ))}
          </ul>
        </div>
      </div>
    </Theme>
  );
}

export default Search;