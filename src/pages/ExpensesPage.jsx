import React, { useState, useEffect } from 'react';
import { FaUpload, FaMoneyBillWave, FaCalendarAlt, FaBuilding, FaChartLine, FaEdit, FaTrash, FaCheck, FaTimes, FaFileUpload } from 'react-icons/fa';
import { useExpenses, useCreateExpense, useDeleteExpense, useUpdateExpenseStatus, useToggleExpenseApproval } from '../hooks';
import { useAuthContext } from '../contexts/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';

const ExpensesPage = () => {
  const { userRole } = useAuthContext();
  const { expenses, loading, error, refetch } = useExpenses();
  const { createExpense, loading: createLoading } = useCreateExpense();
  const { deleteExpense, loading: deleteLoading } = useDeleteExpense();
  const { updateStatus, loading: statusLoading } = useUpdateExpenseStatus();
  const { toggleApproval, loading: approvalLoading } = useToggleExpenseApproval();

  // Form state
  const [formData, setFormData] = useState({
    expenseHead: '',
    amount: '',
    details: '',
    file: null
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Material UI dialog states
  const [deleteDialog, setDeleteDialog] = useState({ open: false, expenseId: null, expenseHead: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const categories = ['Utilities', 'Maintenance', 'Supplies', 'Equipment', 'Marketing', 'Staff', 'Other'];

  // Helper function to show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.expenseHead || !formData.amount) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      const expenseData = new FormData();
      expenseData.append('expenseHead', formData.expenseHead);
      expenseData.append('amount', formData.amount);
      if (formData.details) {
        expenseData.append('details', formData.details);
      }
      if (formData.file) {
        expenseData.append('file', formData.file);
      }

      await createExpense(expenseData);
      showSnackbar('Expense created successfully!');
      setFormData({ expenseHead: '', amount: '', details: '', file: null });
      setSelectedFile(null);
      refetch();
    } catch (error) {
      showSnackbar('Failed to create expense: ' + error.message, 'error');
    }
  };

  // Handle expense deletion
  const handleDeleteClick = (id, expenseHead) => {
    setDeleteDialog({ open: true, expenseId: id, expenseHead });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteExpense(deleteDialog.expenseId);
      showSnackbar('Expense deleted successfully!');
      setDeleteDialog({ open: false, expenseId: null, expenseHead: '' });
      refetch();
    } catch (error) {
      showSnackbar('Failed to delete expense: ' + error.message, 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, expenseId: null, expenseHead: '' });
  };

  // Handle status update
  const handleStatusUpdateClick = async (id, currentStatus) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
    try {
      await updateStatus(id, newStatus);
      showSnackbar(`Expense status updated to ${newStatus}!`);
      refetch();
    } catch (error) {
      showSnackbar('Failed to update status: ' + error.message, 'error');
    }
  };

  // Handle approval toggle (only for admin)
  const handleApprovalToggleClick = async (id, isApproved) => {
    if (userRole !== 'admin') {
      showSnackbar('Only admins can approve expenses', 'error');
      return;
    }
    try {
      await toggleApproval(id);
      showSnackbar('Expense approval status updated!');
      refetch();
    } catch (error) {
      showSnackbar('Failed to update approval: ' + error.message, 'error');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  // Format amount for display
  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // Get status badge styling
  const getStatusBadge = (expense) => {
    const isApproved = expense.isApproved;
    const status = expense.status;
    
    if (isApproved && status === 'paid') {
      return 'bg-green-100 text-green-800';
    } else if (isApproved && status === 'unpaid') {
      return 'bg-blue-100 text-blue-800';
    } else if (!isApproved && status === 'paid') {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  // Get status text
  const getStatusText = (expense) => {
    const isApproved = expense.isApproved;
    const status = expense.status;
    
    if (isApproved && status === 'paid') {
      return 'Approved & Paid';
    } else if (isApproved && status === 'unpaid') {
      return 'Approved';
    } else if (!isApproved && status === 'paid') {
      return 'Paid (Pending Approval)';
    } else {
      return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Center Expenses Management</h1>
            <p className="text-emerald-100">Upload and manage center expenses across all locations</p>
          </div>
          <FaMoneyBillWave className="text-5xl text-emerald-200" />
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaUpload className="mr-2 text-emerald-600" />
          Upload New Expense
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Head *</label>
              <input 
                type="text" 
                name="expenseHead"
                value={formData.expenseHead}
                onChange={handleInputChange}
                placeholder="Enter expense head/category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
          </div>
          
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input 
              type="number" 
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
              placeholder="₹0.00" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
            />
          </div>
          
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receipt/Invoice</label>
              <div className="relative">
            <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <FaFileUpload className="mr-1" />
                    {selectedFile.name}
                  </div>
                )}
              </div>
          </div>
        </div>
        
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
          <textarea 
              name="details"
              value={formData.details}
              onChange={handleInputChange}
            rows="3" 
            placeholder="Enter expense description..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-6 flex space-x-3">
            <button 
              type="submit"
              disabled={createLoading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
            <FaUpload className="mr-2" />
              {createLoading ? 'Creating...' : 'Create Expense'}
          </button>
            <button 
              type="button"
              onClick={() => {
                setFormData({ expenseHead: '', amount: '', details: '', file: null });
                setSelectedFile(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
            Clear Form
          </button>
        </div>
        </form>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-emerald-600" />
            Recent Expenses
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-2 text-gray-600">Loading expenses...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={refetch}
              className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Head</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{expense.expenseHead}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">{formatAmount(expense.amount)}</span>
                  </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{expense.details || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{formatDate(expense.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(expense)}`}>
                          {getStatusText(expense)}
                    </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {expense.file ? (
                          <a 
                            href={expense.file} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-900 text-sm"
                          >
                            View File
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No file</span>
                        )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          {/* Payment Status Toggle */}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Paid:</span>
                            <Tooltip title={expense.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}>
                              <Switch
                                checked={expense.status === 'paid'}
                                onChange={() => handleStatusUpdateClick(expense._id, expense.status)}
                                disabled={statusLoading}
                                color="success"
                                size="small"
                              />
                            </Tooltip>
                          </div>
                          
                          {/* Approval Status Toggle (Admin only) */}
                          {userRole === 'admin' && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Approved:</span>
                              <Tooltip title={expense.isApproved ? 'Disapprove' : 'Approve'}>
                                <Switch
                                  checked={expense.isApproved}
                                  onChange={() => handleApprovalToggleClick(expense._id, expense.isApproved)}
                                  disabled={approvalLoading}
                                  color="primary"
                                  size="small"
                                />
                              </Tooltip>
                            </div>
                          )}
                          
                          {/* Delete Button */}
                          <Tooltip title="Delete Expense">
                            <IconButton
                              onClick={() => handleDeleteClick(expense._id, expense.expenseHead)}
                              disabled={deleteLoading}
                              size="small"
                              color="error"
                            >
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                        </div>
                  </td>
                </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Material UI Dialogs and Snackbar */}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the expense "{deleteDialog.expenseHead}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDeleteCancel} color="primary">
            Cancel
          </MuiButton>
          <MuiButton 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </MuiButton>
        </DialogActions>
      </Dialog>


      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ExpensesPage;
