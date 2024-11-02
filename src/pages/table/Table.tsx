import React, { useState, useEffect } from 'react';
import { Panel, Table, Stack, Badge, SelectPicker, Row, Col } from 'rsuite';
import { DrawerView } from '../../components/DrawerView/DrawerView';
import { useBoardData } from '../../hooks/useBoardData';
import ResizeObserver from 'resize-observer-polyfill';
import { useUser } from '../../components/User/UserContext';
import Skeleton from 'react-loading-skeleton';
import '../../components/skelton.less';
import 'react-loading-skeleton/dist/skeleton.css';
import './styles.less';

window.ResizeObserver = ResizeObserver;

const { Column, HeaderCell, Cell } = Table;

const TableComponent: React.FC = () => {
  const { user } = useUser();
  const { columns } = useBoardData(user);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Applications');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableHeight, setTableHeight] = useState(window.innerHeight * 0.8);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortType, setSortType] = useState();

  useEffect(() => {
    if (!columns) return;
    setLoading(true);

    const timeoutId = setTimeout(() => setLoading(false), 10000);

    const newData = columns.flatMap(column =>
      column.cards.map(card => ({
        logo: card.companyLogo,
        name: card.company,
        position: card.position,
        stage: column.title,
        deadline: card.deadline ? new Date(card.deadline).toLocaleDateString() : null,
        originalCard: card,
      }))
    );

    setTableData(newData);
    setFilteredData(newData);

    return () => clearTimeout(timeoutId);
  }, [columns]);

  useEffect(() => {
    const handleResize = () => setTableHeight(window.innerHeight * 0.8);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statusOptions = [
    { label: 'All Applications', value: 'All Applications' },
    ...columns.map(column => ({
      label: column.title,
      value: column.title,
    })),
  ];

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setFilteredData(
      value === 'All Applications' ? tableData : tableData.filter(item => item.stage === value)
    );
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);

    const sortedData = [...filteredData].sort((a, b) => {
      let valueA = a[sortColumn];
      let valueB = b[sortColumn];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortType === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortType === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  const handleCellClick = (card) => {
    setSelectedCard(null);
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedCard(card);
      setDrawerOpen(true);
    }, 100);
  };

  return (
    <Panel bodyFill>
      <Stack className="table-toolbar" spacing={6} justifyContent="space-between" style={{ marginBottom: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
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
        >
          <Column width={80} align="center" fixed>
            <HeaderCell>Logo</HeaderCell>
            <Cell>
              {rowData => (
                rowData.logo ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <img
                      src={rowData.logo}
                      alt={`${rowData.name} logo`}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', margin: '2px', cursor: 'pointer' }}
                      onClick={() => handleCellClick(rowData.originalCard)}
                    />
                  </div>
                ) : null // Render nothing if `rowData.logo` is null
              )}
            </Cell>

          </Column>

          <Column minWidth={160} flexGrow={1} sortable>
            <HeaderCell>Company Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column minWidth={120} flexGrow={1} sortable>
            <HeaderCell>Position</HeaderCell>
            <Cell dataKey="position" />
          </Column>

          <Column width={160} sortable>
            <HeaderCell>Application Stage</HeaderCell>
            <Cell dataKey="stage" />
          </Column>

          <Column width={120} sortable>
            <HeaderCell>Deadline</HeaderCell>
            <Cell dataKey="deadline" />
          </Column>
        </Table>
      )}

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
