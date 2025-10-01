// IMPORT FROM REACT

import React, { useState } from "react";
// import * as React from 'react';

// IMPORT FROM MATERIAL UI

import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  TextField,
  Select,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// from bank transaction table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// IMPORT FROM FOLDERS

import BankUserTable from "../../parts/bank-user-table/BankUserTable";
import BankDropdownTable from "../../parts/bank-dropdown-table/BankDropdownTable";
import BankTransactionTable from "../../parts/bank-transaction-table/BankTransactionTable";

import usersData from "../../assets/jsons/users.json";

// IMPORT CSS

import "./BankApp.css";
import "../../parts/bank-user-table/BankUserTable.css";

// SVG ASSETS

import Send from "../../assets/images/bank-app-assets/send.svg";
import Withdraw from "../../assets/images/bank-app-assets/withdraw.svg";
import Deposit from "../../assets/images/bank-app-assets/deposit.svg";

let nextId = usersData.length + 1;

function BankApp() {
  // ************************* CONST FOR TOTAL BALANCE BOX *************************
  const now = new Date();
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedDate = now.toLocaleDateString(undefined, dateOptions);
  const formattedTime = now.toLocaleTimeString(undefined, timeOptions);

  const [selectedUserBalance, setSelectedUserBalance] = useState(null);

  const handleUserSelected = (user) => {
    setSelectedUserBalance(user ? user.balance : null);
    setSelectedUser(user);
  };

  // ************************* CONST FOR BANK USER TABLE *************************

  const [rows, setRows] = React.useState(usersData); // Use usersData as the initial state
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [newUserName, setNewUserName] = React.useState("");
  const [newUserEmail, setNewUserEmail] = React.useState("");

  const [newUserBalance, setNewUserBalance] = React.useState("");
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 3,
  });

  const handleDeleteButtonClick = (row) => {
    console.log("Delete button clicked for row:", row);
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
    setNewUserName("");
    setNewUserEmail("");

    setNewUserBalance("");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 266 },
    { field: "email", headerName: "Email", width: 266 },
    {
      field: "balance",
      headerName: "Balance",
      type: "number",
      width: 266,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 250,
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

  // ************************* CONST FOR BUTTON FUNCTIONS*************************

  // WITHDRAW

  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const openWithdrawDialog = () => {
    if (!selectedUserBalance) {
      alert("Please select a user first.");
      return;
    }
    setWithdrawAmount("");
    setWithdrawDialogOpen(true);
  };

  const handleConfirmWithdraw = () => {
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    if (amount > selectedUserBalance) {
      alert("Insufficient balance.");
      return;
    }

    const updatedRows = rows.map((user) =>
      user.balance === selectedUserBalance
        ? { ...user, balance: user.balance - amount }
        : user
    );

    setRows(updatedRows);

    addTransaction("Withdraw", amount, selectedUser.name, "N/A");

    setSelectedUser({
      ...selectedUser,
      balance: selectedUser.balance - amount,
    });

    setSelectedUserBalance(selectedUserBalance - amount);
    setWithdrawAmount("");

    setWithdrawDialogOpen(false);
  };

  // DEPOSIT

  const [depositAmount, setDepositAmount] = useState("");
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);

  const openDepositDialog = () => {
    if (!selectedUserBalance) {
      alert("Please select a user first.");
      return;
    }
    setDepositAmount("");
    setDepositDialogOpen(true);
  };

  const handleConfirmDeposit = () => {
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    const updatedRows = rows.map((user) =>
      user.balance === selectedUserBalance
        ? { ...user, balance: user.balance + amount }
        : user
    );

    setRows(updatedRows);

    // Log the transaction
    addTransaction("Deposit", amount, "-", selectedUser.name);

    // Update selected user state
    setSelectedUser({
      ...selectedUser,
      balance: selectedUser.balance + amount,
    });

    setSelectedUserBalance(selectedUserBalance + amount);
    setDepositAmount("");

    setDepositDialogOpen(false);
  };

  // SEND

  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientUser, setRecipientUser] = useState(null);

  const openSendDialog = () => {
    if (!selectedUserBalance) {
      alert("Please select a user first.");
      return;
    }
    setSendAmount("");
    setSendDialogOpen(true);
  };

  const handleSend = () => {
    const amount = parseFloat(sendAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    if (!selectedUser || !recipientUser) {
      alert("Select both sender and recipient.");
      return;
    }

    if (selectedUser.id === recipientUser.id) {
      alert("Sender and recipient can't be the same.");
      return;
    }

    if (amount > selectedUser.balance) {
      alert("Insufficient balance.");
      return;
    }

    const updatedRows = rows.map((user) => {
      if (user.id === selectedUser.id) {
        return { ...user, balance: user.balance - amount };
      } else if (user.id === recipientUser.id) {
        return { ...user, balance: user.balance + amount };
      } else {
        return user;
      }
    });

    setRows(updatedRows);

    setSelectedUser((prev) => ({
      ...prev,
      balance: prev.balance - amount,
    }));

    setSelectedUserBalance((prevBalance) => prevBalance - amount);

    addTransaction("Send", amount, selectedUser.name, recipientUser.name);

    // Reset
    setSendAmount("");
    setRecipientUser(null);
    setSendDialogOpen(false);
  };

  // ************************* CONST FOR TRANSACTION TABLE*************************

  const [transactions, setTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const addTransaction = (type, amount, sender, recipient = "") => {
    const now = new Date();
    const transaction = {
      id: Date.now(), // unique id
      type,
      amount,
      sender,
      recipient,
      date: now.toLocaleString(),
    };
    setTransactions((prev) => [transaction, ...prev]); // newest first
  };

  return (
    <div className="bank-app-container">
      <div className="container">
        {/************************* BANK USER TABLE ***************************/}
        <div className="box box-1">
          <h3 className="user-title">USER</h3>
          <div className="bank-usertable">
            <Paper
              sx={{
                width: "95%",
                margin: "0 auto",
                boxShadow: 0,
                border: 2,
                backgroundColor: "#ecf1f4",
              }}
            >
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

            <Box
              sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
              >
                Add New User
              </Button>
            </Box>

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
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="standard"
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
        </div>

        <div className="box box-2">
       
          <BankDropdownTable
            users={rows}
            onUserSelect={(user) => {
              console.log(user);
              handleUserSelected(user);
            }}
          />
        </div>

        <div className="box box-3">
          <p className="balance-p">Your Total Balance</p>
          <h4 className="balance-h4">
            {selectedUserBalance !== null
              ? `₱ ${selectedUserBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "select a user"}
          </h4>
          <p className="balance-time-and-date">
            {" "}
            {formattedDate} • {formattedTime}
          </p>
          <div className="balance-buttons">
            <div className="withdraw-button">
              <button onClick={openWithdrawDialog}>
                <img src={Withdraw} alt="withdraw" className="withdraw-icon" />
                <p>Withdraw</p>
              </button>
            </div>
            <div className="deposit-button">
              <button onClick={openDepositDialog}>
                <img src={Deposit} alt="deposit" className="deposit-icon" />
                <p>Deposit</p>
              </button>
            </div>
            <div className="send-button">
              <button onClick={openSendDialog}>
                <img src={Send} alt="send" className="send-icon" />
                <p>Send</p>
              </button>
            </div>
          </div>

          {/* DIALOG BOXES FOR BUTTONS */}

          {/* WITHDRAW DIALOG */}

          <Dialog
            open={withdrawDialogOpen}
            onClose={() => setWithdrawDialogOpen(false)}
          >
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="withdrawAmount"
                label="Amount"
                type="number"
                fullWidth
                variant="standard"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWithdrawDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmWithdraw} color="primary">
                Withdraw
              </Button>
            </DialogActions>
          </Dialog>

          {/* DEPOSIT DIALOG */}

          <Dialog
            open={depositDialogOpen}
            onClose={() => setDepositDialogOpen(false)}
          >
            <DialogTitle>Deposit</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Enter amount"
                type="number"
                fullWidth
                variant="standard"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDepositDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDeposit} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* SEND DIALOG */}

          <Dialog
            open={sendDialogOpen}
            onClose={() => setSendDialogOpen(false)}
          >
            <DialogTitle>Send Money</DialogTitle>
            <DialogContent sx={{ minWidth: 400 }}>
              <FormControl fullWidth sx={{ my: 2 }}>
                <InputLabel>Select Recipient</InputLabel>
                <Select
                  value={recipientUser?.id || ""}
                  label="Select Recipient"
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const user = rows.find((u) => u.id === id);
                    setRecipientUser(user);
                  }}
                >
                  {rows
                    .filter((user) => user.id !== selectedUser?.id)
                    .map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                label="Amount"
                type="number"
                fullWidth
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                sx={{ my: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSendDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSend}>
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <div className="box box-4">
          <h3 className="transaction-title">TRANSACTION HISTORY</h3>
          <TableContainer
            sx={{ height: "80%", border: 2, width: "95%", mx: "auto" }}
            component={Paper}
          >
            <Table aria-label="bank transaction table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Sender</TableCell>
                  <TableCell align="right">Recipient</TableCell>
                  <TableCell align="right">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No transactions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell align="right">
                        ₱{tx.amount.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">{tx.sender}</TableCell>
                      <TableCell align="right">{tx.recipient || "—"}</TableCell>
                      <TableCell align="right">{tx.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </div>
      </div>
    </div>
  );
}

export default BankApp;
