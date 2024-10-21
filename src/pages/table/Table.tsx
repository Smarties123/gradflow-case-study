import React, { useState, useEffect } from 'react';
import { Panel, Table, Stack, Badge, SelectPicker } from 'rsuite';
import DrawerView from '../../components/DrawerView/DrawerView';
import { useBoardData } from '../../hooks/useBoardData';
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;
import { useUser } from '../../components/User/UserContext';


const { Column, HeaderCell, Cell } = Table;

const TableComponent: React.FC = () => {
  const { user } = useUser(); /* Your UserContext here */ // Ensure you have the user from context or other source
  const { columns } = useBoardData(user); // Correct usage of useBoardData
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Applications');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (!columns) return;
    const newData = columns.flatMap(column =>
      column.cards.map(card => ({
        logo: card.companyLogo,
        name: card.company,
        position: card.position,
        stage: column.title,
        deadline: card.deadline ? new Date(card.deadline).toLocaleDateString() : 'N/A',
        originalCard: card, // Store the original card data for passing to DrawerView
      }))
    );
    setTableData(newData);
    setFilteredData(newData);
  }, [columns]);

  const statusOptions = [
    { label: 'All Applications', value: 'All Applications' },
    ...columns.map(column => ({
      label: column.title,
      value: column.title,
    })),
  ];

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (value === 'All Applications') {
      setFilteredData(tableData);
    } else {
      setFilteredData(tableData.filter(item => item.stage === value));
    }
  };

  const handleCellClick = (card) => {
    // Ensure to reset the selected card to null before setting the new card
    setSelectedCard(null); // Force a clear of the previous state
    setDrawerOpen(false); // Close the drawer first
    
    setTimeout(() => {
      setSelectedCard(card); // Set the new card after resetting
      setDrawerOpen(true);   // Open the drawer
    }, 100); // Add a slight delay to ensure proper state updating
  };
  
  return (
    <Panel bodyFill>
      <Stack className="table-toolbar" spacing={6} justifyContent="space-between" style={{ marginBottom: '20px' }}>
        <Stack spacing={6}>
          <div className="category-description">
            <span>{selectedStatus}</span>
            <Badge content={filteredData.length} style={{ backgroundColor: '#ff6200', marginLeft: '10px' }} />
          </div>
        </Stack>
        <SelectPicker
          data={statusOptions}
          placeholder="Select Status"
          style={{ width: 224 }}
          onChange={handleStatusChange}
          value={selectedStatus}
        />
      </Stack>

      <Table height={Math.max(window.innerHeight - 250, 400)} data={filteredData}>
        <Column width={80} align="center" fixed>
          <HeaderCell>Logo</HeaderCell>
          <Cell>
            {rowData => (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img
                  src={rowData.logo}
                  alt={`${rowData.name} logo`}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', margin: '2px', cursor: 'pointer' }}
                  onClick={() => handleCellClick(rowData.originalCard)}
                />
              </div>
            )}
          </Cell>
        </Column>

        <Column minWidth={160} flexGrow={1} sortable>
          <HeaderCell>Company Name</HeaderCell>
          <Cell>
            {rowData => (
              <span onClick={() => handleCellClick(rowData.originalCard)} style={{ cursor: 'pointer' }}>
                {rowData.name}
              </span>
            )}
          </Cell>
        </Column>

        <Column minWidth={160} flexGrow={1} sortable>
          <HeaderCell>Position</HeaderCell>
          <Cell>
            {rowData => (
              <span onClick={() => handleCellClick(rowData.originalCard)} style={{ cursor: 'pointer' }}>
                {rowData.position}
              </span>
            )}
          </Cell>
        </Column>

        <Column width={160} sortable>
          <HeaderCell>Application Stage</HeaderCell>
          <Cell>
            {rowData => (
              <span onClick={() => handleCellClick(rowData.originalCard)} style={{ cursor: 'pointer' }}>
                {rowData.stage}
              </span>
            )}
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Deadline</HeaderCell>
          <Cell>
            {rowData => (
              <span onClick={() => handleCellClick(rowData.originalCard)} style={{ cursor: 'pointer' }}>
                {rowData.deadline}
              </span>
            )}
          </Cell>
        </Column>
      </Table>

      {selectedCard && (
        <DrawerView
          show={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          card={selectedCard}
          updateCard={(id, updatedData) => {
            // Update the card in your context/state
          }}
        />
      )}
    </Panel>
  );
};

export default TableComponent;
