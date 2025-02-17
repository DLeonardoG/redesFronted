import React, { useState } from 'react';
import AxiosConfiguration from '../../AxiosConfiguration';
import { useNavigate } from 'react-router';
import { SearchResults } from './SearchResults';

export const SearchInput = ({ placeholder = 'Search...' , padding = 'p-5'}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setSearchResults([]); 
      return;
    }

    setIsLoading(true);

    const token = localStorage.getItem('authToken');

    AxiosConfiguration.get(`users/search?query=${value}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => {
        setSearchResults(response.data); 
      })
      .catch((error) => {
        console.error('Error buscando usuarios:', error);
        setSearchResults([]); 
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  const handleSelectUser = (user) => {
    setSearchTerm('');
    setSearchResults([]); 
    navigate(`../user/${user.id}`)
  };

  const classes = "flex justify-around items-center gap-3 " + padding

  return (
    <div className={classes}>
      <img 
        src="https://static.vecteezy.com/system/resources/previews/010/161/406/non_2x/3d-rendering-blue-magnifying-glass-with-icon-profile-user-isolated-png.png" 
        alt="Search icon" 
        width={24} 
        height={24} 
        aria-hidden="true" 
        className='opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer'
      />
      <input
        type="text"
        className='w-full max-w-[400px] border-none rounded-xl bg-[#ffffff18] text-white text-sm pl-4 pr-4 py-2 outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 h-full shadow-lg hover:shadow-xl focus:shadow-xl placeholder:text-[#ffffff80]'
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        aria-label="Search input"
      />

      {searchResults.length > 0 && (
        <SearchResults results={searchResults} onSelectUser={handleSelectUser} />
      )}

      {isLoading && (
        <div className="absolute top-[6vh] w-full max-w-[400px] bg-white rounded-lg shadow-lg z-10 p-3">
          <p className="text-gray-700">Buscando...</p>
        </div>
      )}
    </div>
  );
};