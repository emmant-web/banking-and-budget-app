
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Stack, TextField, Box } from '@mui/material';


import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import BankDropdownTable from '../../parts/bank-dropdown-table/BankDropdownTable';
import usersData from '../../assets/jsons/users.json'; // Keep this import












let nextId = usersData.length + 1;


const BankUserTable = () => {

  const [rows, setRows] = React.useState(usersData); // Use usersData as the initial state
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [newUserName, setNewUserName] = React.useState('');
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const [newUserBalance, setNewUserBalance] = React.useState('');
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize: 3 });
  



  const handleDeleteButtonClick = (row) => {
    console.log('Delete button clicked for row:', row);
    setRows(rows.filter((r) => r.id !== row.id));
  };


  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };


  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    resetNewUserForm();
  };

  const handleAddUser = () => {
    const newUser = {
      id: nextId++,
      name: newUserName,
      email: newUserEmail,
      balance: parseFloat(newUserBalance) || 0,
    };
    setRows([...rows, newUser]); // Add new user to the rows state
    handleCloseAddDialog();
  };

  const resetNewUserForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserBalance('');
  };






  

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'balance',
      headerName: 'Balance',
      type: 'number',
      width: 250,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDeleteButtonClick(params.row)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="bank-usertable">
      <Paper sx={{ width: '95%', margin: '0 auto', boxShadow: 0, border: 2, backgroundColor: '#ecf1f4' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[3, 5, 10]}
          sx={{ border: 0, height: 229 }}
          rowHeight={40}
        />
      </Paper>

      <Box sx={{ mt: 0.7, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New User
        </Button>
      </Box>

      {/* Pass rows (users) to BankDropdownTable */}
      <BankDropdownTable users={rows} onUserSelect={(user) => console.log(user)} />

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />

          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />


          <TextField
            margin="dense"
            id="balance"
            label="Balance"
            type="number"
            fullWidth
            variant="standard"
            value={newUserBalance}
            onChange={(e) => setNewUserBalance(e.target.value)}
          />


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BankUserTable;
