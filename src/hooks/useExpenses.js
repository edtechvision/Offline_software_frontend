import { useState, useEffect } from 'react';
import { expenseService } from '../services/apiService';

export const useExpenses = (params = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.getExpenses(params);
      if (response.success) {
        setExpenses(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch expenses');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [JSON.stringify(params)]);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
  };
};

export const useExpense = (id) => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpense = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.getExpenseById(id);
      if (response.success) {
        setExpense(response.data);
      } else {
        setError(response.message || 'Failed to fetch expense');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch expense');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  return {
    expense,
    loading,
    error,
    refetch: fetchExpense,
  };
};

export const useCreateExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createExpense = async (expenseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.createExpense(expenseData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createExpense,
    loading,
    error,
  };
};

export const useUpdateExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.updateExpense(id, expenseData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateExpense,
    loading,
    error,
  };
};

export const useDeleteExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteExpense = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.deleteExpense(id);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteExpense,
    loading,
    error,
  };
};

export const useUpdateExpenseStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (id, status, paidDate = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.updateExpenseStatus(id, status, paidDate);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update expense status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    loading,
    error,
  };
};

export const useToggleExpenseApproval = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleApproval = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await expenseService.toggleExpenseApproval(id);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to toggle expense approval');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleApproval,
    loading,
    error,
  };
};
