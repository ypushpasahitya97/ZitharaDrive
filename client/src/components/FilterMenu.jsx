import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, TextField, IconButton, Box } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterMenu = ({ columns }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterValues, setFilterValues] = useState({});

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (columnId, value) => {
    setFilterValues({
      ...filterValues,
      [columnId]: value, // Update state with the new value for the specific column
    });
  };
  const handleFilter = () => {
    // Implement your filter logic here using filterValues state
    console.log('Filter values:', filterValues);
    handleClose();
  };

  const handleResetFilters = () => {
    setFilterValues({});
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleFilterClick}>
          <FilterListIcon />
        </IconButton>
      </Box>
      <Menu
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={handleClose}
>
  {columns.map((column) => (
    <MenuItem key={column.id}>
      <TextField
        label={`Filter by ${column.Header}`}
        variant="outlined"
        size="small"
        value={filterValues[column.id] || ''}
        onChange={(e) => handleInputChange(column.id, e.target.value)}
      />
    </MenuItem>
  ))}
</Menu>
    </>
  );
};

FilterMenu.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      Header: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FilterMenu;
