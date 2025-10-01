import './BudgetApp.css'
import * as React from 'react';
import BudgetGraph from '../../parts/budget-graph/BudgetGraph';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


function BudgetApp() {

  // DECLARATION
  const [expense, setExpense] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [budget, setBudget] = React.useState(10000);
  const [rows, setRows] = React.useState([{id: 1, expense: 'Rent', price: 5000}]);
  const [count, setCount] = useState(rows.length);
  const [inputBudget, setInputBudget] = useState("");
  const totalExpense = rows.reduce((total, row) => total + row.price, 0);
  const remainingBudget = budget - totalExpense;
  const budget1 = budget.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
  const totalExpense1 = totalExpense.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
  const remainingBudget1 = remainingBudget.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
  const numberColor = remainingBudget < 0 ? '#DC3545' : '#2C77BE'

  // SET BUDGET
  const newInputBudget = () => {
    if(inputBudget < 0) {
      alert("Invalid amount");
    } else {
      setBudget(inputBudget);
      setInputBudget('');
    }
  };

  // ADD BUDGET ITEM
  const addExpense = () => {
    const newCount = count + 1;
    setCount(newCount);
    const newPrice = Number(price);
    if(newPrice < 0) {
        alert("Invalid amount");
    } else {
        let newExpense = {
          id: newCount,
          expense: expense,
          price: parseFloat(newPrice),
        }
        let newList = [...rows, newExpense];
        setRows(newList);
    }
    setExpense('');
    setPrice('');
  }

  // DELETE BUDGET ITEM
  const handleDeleteRow = (rowId) => {
    const updatedRows = rows.filter((row) => row.id !== rowId);
    setRows(updatedRows);
  };

  // EXPENSE LIST
  const columns = [
    { field: 'id', headerName: 'No.', width: 0, hide: true },
    { field: 'expense', headerName: 'Commodity', minWidth: 250, align: 'center', headerAlign: 'center', },
    { 
      field: 'price', 
      headerName: 'Budget Cost', 
      type: 'number', 
      minWidth: 250,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => {
        return params.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
    },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      align: 'center',
      headerAlign: 'center',
      renderCell: (row) => (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteRow(row.id)}
          >
          Delete
          </Button>
      )
    }
  ];
  
  
  // RETURN
  return (
    <div className='BudgetApp'> 
      <div className='budget'>
        <div className='budget-input'>
          <p>BUDGET INPUT:</p>
          <input 
            type="number" 
            value={inputBudget} 
            onChange={(e) => setInputBudget(e.target.value)} 
          /><br />
          <button onClick={newInputBudget}>SET</button>
        </div>
        <div className='set-budget'>
          <p>BUDGET:</p>
          <h3>{budget1}</h3>
        </div>
        <div className='total-expense'>
          <p>TOTAL EXPENSE:</p>
          <h3>{totalExpense1}</h3>
        </div>
        <div className='current-budget'>
          <p>REMAINING BUDGET:</p>
          <div className='budget-value'>
            <span style={{ color: numberColor}}>{remainingBudget1}</span>
          </div>
        </div>
      </div>
      <div className='add-expense'>
        <h2>ADD EXPENSE</h2>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="expense"
            label="Commodity or Description"
            type="text"
            fullWidth
            variant="standard"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
          />
          <TextField
            margin="dense"
            id="price"
            label="Budget Cost"
            type="number"
            fullWidth
            variant="standard"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addExpense}
          >Add
          </Button>
        </DialogActions>    
      </div>
      <div className='expense-table'>
        <h2>EXPENSES</h2>
          <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={40}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            columnVisibilityModel={{
              id: false,
            }}
          />
          </Box>
      </div>
      <div className='graph'>
        <h2>EXPENSE GRAPH</h2>
        <div><BudgetGraph rows={rows}/></div>
      </div>
    </div>
  )
}

export default BudgetApp