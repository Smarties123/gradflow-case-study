import React, { useState, useEffect } from 'react';
import { Panel, Table, Stack, Badge, SelectPicker, Row, Col } from 'rsuite';
import DrawerView from '../../components/DrawerView/DrawerView';
import { useBoardData } from '../../hooks/useBoardData';
import ResizeObserver from 'resize-observer-polyfill';
import { useUser } from '../../components/User/UserContext';
import Skeleton from 'react-loading-skeleton';
import '../../components/skelton.less';
import 'react-loading-skeleton/dist/skeleton.css';
import './styles.less';
import { format } from 'date-fns';

window.ResizeObserver = ResizeObserver;

const { Column, HeaderCell, Cell } = Table;

const TableComponent: React.FC = () => {
  const { user } = useUser();
  const { columns, loading } = useBoardData(user);

  // State for table data and filtering
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Default status changed to "All Applications"
  const [selectedStatus, setSelectedStatus] = useState('All Applications');

  // Drawer state for detailed card view
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Table layout and sorting state
  const [tableHeight, setTableHeight] = useState(window.innerHeight * 0.8);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortType, setSortType] = useState();

  // Transform board data into flat table format
  useEffect(() => {
    if (!columns) return;

    const newData = columns.flatMap(column =>
      column.cards.map(card => ({
        logo: card.companyLogo,
        name: card.company,
        position: card.position,
        stage: column.title,
        deadline: card.deadline ? new Date(card.deadline) : null,
        originalCard: card,
      }))
    );

    setTableData(newData);
    setFilteredData(newData);
  }, [columns]);

  // Adjust table height on window resize
  useEffect(() => {
    const handleResize = () => setTableHeight(window.innerHeight * 0.8);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Status filter options (safe for undefined columns)
  const statusOptions = [
    { label: 'All Applications', value: 'All Applications' },
    ...(columns || []).map(column => ({
      label: column.title,
      value: column.title,
    })),
  ];

  // Handle filtering by application stage
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setFilteredData(
      value === 'All Applications' ? tableData : tableData.filter(item => item.stage === value)
    );
  };

  // Handle column sorting with null-safe deadline handling
  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);

    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (sortColumn === 'deadline') {
        if (!valueA && !valueB) return 0;
        if (!valueA) return sortType === 'asc' ? 1 : -1;
        if (!valueB) return sortType === 'asc' ? -1 : 1;
        return sortType === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (valueA < valueB) return sortType === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortType === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  // Open Drawer on row click
  const handleCellClick = (card) => {
    setSelectedCard(null);
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedCard(card);
      setDrawerOpen(true);
    }, 100);
  };

  // Clickable cell for opening Drawer
  const ClickableCell = ({ rowData, dataKey, children, ...props }) => (
    <Cell
      {...props}
      onClick={() => handleCellClick(rowData.originalCard)}
      style={{ cursor: 'pointer' }}
    >
      {children ? children(rowData) : rowData[dataKey]}
    </Cell>
  );

  // Styled table header for consistency
  const CustomHeaderCell = ({ children, ...props }) => (
    <HeaderCell {...props}>
      <div style={{ 
        color: '#ffffff', 
        fontWeight: '700', 
        textTransform: 'uppercase',
        fontSize: '13px',
        letterSpacing: '0.5px'
      }}>
        {children}
      </div>
    </HeaderCell>
  );

  return (
    <Panel bodyFill className="application-table-panel">
      {/* Toolbar: status title + badge + filter dropdown */}
      <Stack
        className="table-toolbar"
        spacing={6}
        justifyContent="space-between"
        style={{ marginBottom: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}
      >
        {/* Left side: selected status and count */}
        <div
          className="category-description"
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1 1 auto',
            marginTop: '4px',
          }}
        >
          {loading ? (
            <>
              <Skeleton height={35} width={100} style={{ marginRight: '10px' }} />
              <Skeleton height={35} width={40} style={{ borderRadius: '6px' }} />
            </>
          ) : (
            <>
              <h6 style={{ margin: 0 }}>{selectedStatus}</h6>
              <Badge
                content={filteredData.length}
                style={{
                  backgroundColor: '#ff6200',
                  marginLeft: '10px',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '15px',
                }}
              />
            </>
          )}
        </div>

        {/* Right side: filter dropdown */}
        <div
          className="select-picker-container"
          style={{
            flex: '1 1 auto',
            minWidth: '100%',
            textAlign: 'right',
          }}
        >
          {loading ? (
            <Skeleton height={35} width={224} />
          ) : (
            <SelectPicker
              data={statusOptions}
              placeholder="Select Status"
              style={{ width: 224 }}
              onChange={handleStatusChange}
              value={selectedStatus}
            />
          )}
        </div>
      </Stack>

      {/* Table body */}
      {loading ? (
        <div>
          <Row>
            <Col xs={24}>
              <Skeleton height={900} />
            </Col>
          </Row>
        </div>
      ) : (
        <Table
          height={tableHeight}
          data={filteredData}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          className="application-table"
          hover={true}
          bordered={true}
          cellBordered={true}
          headerHeight={50}
          rowHeight={60}
          showHeader={true}
        >
          {/* Logo Column with fallback to initial if no logo */}
          <Column width={100} align="center" fixed>
            <CustomHeaderCell>Logo</CustomHeaderCell>
            <Cell>
              {rowData => (
                rowData.logo ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <img
                      src={rowData.logo}
                      alt={`${rowData.name} logo`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCellClick(rowData.originalCard);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '32px',
                      width: '32px',
                      backgroundColor: '#ff6200',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      margin: '0 auto'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(rowData.originalCard);
                    }}
                  >
                    {rowData.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )
              )}
            </Cell>
          </Column>

          {/* Company Name Column */}
          <Column minWidth={160} flexGrow={1} sortable>
            <CustomHeaderCell>Company Name</CustomHeaderCell>
            <ClickableCell dataKey="name">
              {rowData => (
                <span style={{ fontWeight: '600', color: '#ffffff' }}>
                  {rowData.name}
                </span>
              )}
            </ClickableCell>
          </Column>

          {/* Position Column */}
          <Column minWidth={120} flexGrow={1} sortable>
            <CustomHeaderCell>Position</CustomHeaderCell>
            <ClickableCell dataKey="position">
              {rowData => (
                <span style={{ color: '#e0e0e0' }}>
                  {rowData.position}
                </span>
              )}
            </ClickableCell>
          </Column>

          {/* Application Stage Column */}
          <Column width={160} sortable>
            <CustomHeaderCell>Application Stage</CustomHeaderCell>
            <ClickableCell dataKey="stage">
              {rowData => (
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#ff6200',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}
                >
                  {rowData.stage}
                </span>
              )}
            </ClickableCell>
          </Column>

          {/* Deadline Column with color-coded dates */}
          <Column width={120} sortable>
            <CustomHeaderCell>Deadline</CustomHeaderCell>
            <ClickableCell dataKey="deadline">
              {rowData => (
                <span
                  style={{
                    color: rowData.deadline
                      ? (rowData.deadline < new Date() ? '#ff4757' : '#ffffff')
                      : '#888',
                    fontWeight: rowData.deadline ? '600' : '400'
                  }}
                >
                  {rowData.deadline ? format(rowData.deadline, 'dd/MM/yyyy') : 'No Deadline'}
                </span>
              )}
            </ClickableCell>
          </Column>
        </Table>
      )}

      {/* Drawer with detailed card view */}
      {selectedCard && (
        <DrawerView
          show={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          card={selectedCard}
        />
      )}
    </Panel>
  );
};

export default TableComponent;
