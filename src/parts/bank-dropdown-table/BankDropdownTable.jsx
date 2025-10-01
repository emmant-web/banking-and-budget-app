import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BankDropdownTable({ users = [], onUserSelect }) {
  const [selectedUserId, setSelectedUserId] = React.useState('');

  const handleChange = (event) => {
    const userId = event.target.value;
    setSelectedUserId(userId);
    const selectedUser = users.find((user) => user.id === userId);
    if (selectedUser && onUserSelect) {
      onUserSelect(selectedUser);
    }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120, width: 380 }}>
  <Select
    value={selectedUserId}
    onChange={handleChange}
    displayEmpty
    sx={{
      height: '2.1rem',
    }}
  >
    <MenuItem value="" disabled>
      <em>Select user for their balance</em>
    </MenuItem>
    {users.map((user) => (
      <MenuItem key={user.id} value={user.id}>
        {user.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

    </div>
  );
}
