import { useCallback, useEffect, useMemo, useState } from 'react';
import { attendanceService } from '../services/apiService';

export const useAttendance = (initialParams = { 
  page: 1, 
  limit: 10, 
  search: '', 
  startDate: '', 
  endDate: '', 
  sortBy: 'date', 
  order: 'desc' 
}) => {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(initialParams.limit || 10);
  const [search, setSearch] = useState(initialParams.search || '');
  const [startDate, setStartDate] = useState(initialParams.startDate || '');
  const [endDate, setEndDate] = useState(initialParams.endDate || '');
  const [sortBy, setSortBy] = useState(initialParams.sortBy || 'date');
  const [order, setOrder] = useState(initialParams.order || 'desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mergedParams = useMemo(() => ({ 
    page: currentPage, 
    limit, 
    search, 
    startDate, 
    endDate, 
    sortBy, 
    order 
  }), [currentPage, limit, search, startDate, endDate, sortBy, order]);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: currentPage,
        limit,
        search: search || '',
      };
      
      if (startDate) queryParams.startDate = startDate;
      if (endDate) queryParams.endDate = endDate;
      if (sortBy) queryParams.sortBy = sortBy;
      if (order) queryParams.order = order;
      
      const res = await attendanceService.getAttendance(queryParams);
      setData(res?.results || []);
      setTotalRecords(res?.totalRecords || 0);
      setCurrentPage(res?.currentPage || 1);
      setTotalPages(res?.totalPages || 1);
      setLimit(res?.limit || limit);
    } catch (e) {
      setError(e?.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, search, startDate, endDate, sortBy, order]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const setSearchAndResetPage = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const setDateRangeAndResetPage = useCallback((start, end) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  }, []);

  const setSortAndResetPage = useCallback((sort, order) => {
    setSortBy(sort);
    setOrder(order);
    setCurrentPage(1);
  }, []);

  return {
    data,
    totalRecords,
    currentPage,
    totalPages,
    limit,
    search,
    startDate,
    endDate,
    sortBy,
    order,
    loading,
    error,
    setCurrentPage,
    setLimit,
    setSearch: setSearchAndResetPage,
    setDateRange: setDateRangeAndResetPage,
    setSort: setSortAndResetPage,
    fetchAttendance,
    params: mergedParams,
  };
};

export default useAttendance;
