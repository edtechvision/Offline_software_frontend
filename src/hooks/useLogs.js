import { useState, useEffect } from 'react';
import { logsService } from '../services/apiService';

export const useLogs = (params = {}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await logsService.getLogs(params);
      if (response.success) {
        setLogs(response.data || []);
        setPagination({
          page: response.page || 1,
          limit: response.limit || 20,
          total: response.total || 0,
          totalPages: response.totalPages || 0
        });
      } else {
        setError(response.message || 'Failed to fetch logs');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [JSON.stringify(params)]);

  return {
    logs,
    loading,
    error,
    pagination,
    refetch: fetchLogs,
  };
};

export const useLog = (id) => {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLog = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await logsService.getLogById(id);
      if (response.success) {
        setLog(response.data);
      } else {
        setError(response.message || 'Failed to fetch log');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [id]);

  return {
    log,
    loading,
    error,
    refetch: fetchLog,
  };
};
