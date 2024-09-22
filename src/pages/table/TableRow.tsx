import React from 'react';

interface TableRowProps {
  data: {
    logo: string;
    name: string;
    position: string;
    stage: string;
    deadline: string;
  };
}

const TableRow: React.FC<TableRowProps> = ({ data }) => {
  const handleClick = () => {
    alert(`You clicked on ${data.name} - ${data.position}`);
    // Placeholder for future popup implementation
  };

  return (
    <tr onClick={handleClick}>
      <td>
        <img src={`/assets/logos/${data.logo}`} alt={`${data.name} logo`} />
      </td>
      <td>{data.name}</td>
      <td>{data.position}</td>
      <td>{data.stage}</td>
      <td>{data.deadline}</td>
    </tr>
  );
};

export default TableRow;
