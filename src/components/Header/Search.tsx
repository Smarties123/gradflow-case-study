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
    setSearchQuery(query.toLowerCase());
  
    if (!query) {
      // Reset the board if the search is cleared
      try {
        const statusResponse = await fetch(`${process.env.REACT_APP_API_URL}/status`, {
          headers: {
            'Authorization': `Bearer ${user.token}`, // Attach the token
          },
        });
  
        const statuses = await statusResponse.json();
  
        const jobResponse = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${user.token}`, // Attach the token
          },
        });
  
        const jobs = await jobResponse.json();
  
        // Rebuild the full board with all columns and jobs
        const fullColumns = statuses.map((status: any) => ({
          id: status.StatusId,
          title: status.StatusName,
          cards: jobs.filter((job: any) => job.StatusId === status.StatusId).map((job: any) => ({
            id: String(job.ApplicationId), // Convert ApplicationId to string
            company: job.CompanyName,
            position: job.JobName,
            deadline: job.Deadline,
            location: job.Location || '', // Handle null Location
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
      // Fetch filtered applications from the backend
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
  
      // Filter columns based on the search results
      const filteredColumns = columns.map(column => ({
        ...column,
        cards: column.cards.filter(card => {
          // Handle potential null values for JobName, CompanyName, and Location
          const jobName = card.position ? card.position.toLowerCase() : '';
          const companyName = card.company ? card.company.toLowerCase() : '';
          const location = card.location ? card.location.toLowerCase() : '';
  
          // Compare ApplicationId as a string
          const matchesApplicationId = searchResults.some(result => String(result.ApplicationId) === String(card.id));
  
          return (
            matchesApplicationId ||
            jobName.includes(query) ||
            companyName.includes(query) ||
            location.includes(query)
          );
        }),
      }));
  
      // Check if there's no match at all, and reset the columns if so
      const noResults = filteredColumns.every(column => column.cards.length === 0);
  
      if (noResults) {
        console.log('No results found');
      } else {
        setColumns(filteredColumns); // Update the board with the filtered columns
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
        onChange={(value) => handleSearch(value)} // Trigger search on input change
      />
    </InputGroup>
    
    {/* Render the search results in a dropdown
    {searchResults.length > 0 && (
      <ul className="search-dropdown">
        {searchResults.map((result) => (
          <li key={result.ApplicationId} onClick={() => filterBoard(result)}>
            {result.JobName} - {result.CompanyName}
          </li>
        ))}
      </ul>
    )} */}
  </div>

  );
};

export default Search;
