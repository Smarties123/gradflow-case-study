import React, { useState, useContext } from 'react';
import { InputGroup, Input } from 'rsuite';
import { FaSearch } from 'react-icons/fa';
import { BoardContext } from '../../pages/board/BoardContext'; // Import BoardContext
import { useUser } from '../../components/User/UserContext'; // Import useUser for token
import './Search.less';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { columns, setColumns } = useContext(BoardContext); // Ensure columns and setColumns are available from context
  const { user } = useUser(); // Get the user with token
  const [searchResults, setSearchResults] = useState([]); // Store the search results

  if (!user || !user.token) {
    console.error('User or token is missing');
    return null; // Gracefully handle if user or token is missing
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query); // Preserve the user's input as-is (including capital letters)
    const lowerQuery = query.toLowerCase(); // Use this only for internal comparisons

    if (!query) {
      // Reset the board if the search is cleared - reload from initial data
      // In demo mode, we'd need to reload initialColumns, but for now just show all cards
      return;
    }

    // In demo mode, use local filtering
    const filteredColumns = columns.map(column => ({
      ...column,
      cards: column.cards.filter(card => {
        const jobName = card.position?.toLowerCase() || '';
        const companyName = card.company?.toLowerCase() || '';
        const location = card.location?.toLowerCase() || '';

        return (
          jobName.includes(lowerQuery) ||
          companyName.includes(lowerQuery) ||
          location.includes(lowerQuery)
        );
      }),
    }));

    const noResults = filteredColumns.every(column => column.cards.length === 0);

    if (noResults) {
      console.log('No results found');
    } else {
      setColumns(filteredColumns);
    }
  };

  return (
    <div>
      <InputGroup inside size="lg" className="search-input">
        <InputGroup.Button>
          <FaSearch />
        </InputGroup.Button>
        <Input
          placeholder="Search Applications..."
          value={searchQuery}
          onChange={(value) => handleSearch(value)} // Keeps user input as-is
        />
      </InputGroup>

      {/* Optionally show search results in dropdown
      {searchResults.length > 0 && (
        <ul className="search-dropdown">
          {searchResults.map((result) => (
            <li key={result.ApplicationId}>
              {result.JobName} - {result.CompanyName}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default Search;
