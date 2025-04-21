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
      // Reset the board if the search is cleared
      try {
        const statusResponse = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        const statuses = await statusResponse.json();

        const jobResponse = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        const jobs = await jobResponse.json();

        const fullColumns = statuses.map((status: any) => ({
          id: status.StatusId,
          title: status.StatusName,
          cards: jobs
            .filter((job: any) => job.StatusId === status.StatusId)
            .map((job: any) => ({
              id: String(job.ApplicationId),
              company: job.CompanyName,
              position: job.JobName,
              deadline: job.Deadline,
              location: job.Location || '',
              url: job.CompanyURL,
              notes: job.Notes || '',
              salary: job.Salary || 0,
              StatusId: job.StatusId,
              date_applied: job.DateApplied,
              card_color: job.Color || '#ffffff',
              companyLogo: job.CompanyLogo,
              Favourite: job.Favourite || false,
            })),
        }));

        setColumns(fullColumns);
        return;
      } catch (error) {
        console.error('Failed to reset board data', error);
        return;
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/search?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch search results: ${response.status}`);
      }

      const searchResults = await response.json();
      setSearchResults(searchResults); // Optional: store if you want to show dropdown or autocomplete

      const filteredColumns = columns.map(column => ({
        ...column,
        cards: column.cards.filter(card => {
          const jobName = card.position?.toLowerCase() || '';
          const companyName = card.company?.toLowerCase() || '';
          const location = card.location?.toLowerCase() || '';
          const matchesApplicationId = searchResults.some(result => String(result.ApplicationId) === String(card.id));

          return (
            matchesApplicationId ||
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

    } catch (error) {
      console.error('Failed to search applications', error);
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
