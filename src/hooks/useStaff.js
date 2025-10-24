import { useCallback, useEffect, useMemo, useState } from 'react';
import { staffService } from '../services/apiService';

export const useStaff = (initialParams = { page: 1, limit: 10, search: '' }) => {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [pages, setPages] = useState(1);
  const [limit, setLimit] = useState(initialParams.limit || 10);
  const [search, setSearch] = useState(initialParams.search || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mergedParams = useMemo(() => ({ page, limit, search }), [page, limit, search]);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffService.getStaff({ page, limit, search: search || '' });
      // Expecting shape: { total, page, pages, limit, data: [...] }
      setData(res?.data || res || []);
      setTotal(res?.total || res?.length || 0);
      setPage(res?.page || 1);
      setPages(res?.pages || 1);
      setLimit(res?.limit || limit);
    } catch (e) {
      setError(e?.message || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const createStaff = useCallback(async (payload) => {
    await staffService.createStaff(payload);
    await fetchStaff();
  }, [fetchStaff]);

  const updateStaff = useCallback(async (id, payload) => {
    await staffService.updateStaff(id, payload);
    await fetchStaff();
  }, [fetchStaff]);

  const deleteStaff = useCallback(async (id) => {
    await staffService.deleteStaff(id);
    await fetchStaff();
  }, [fetchStaff]);

  const toggleBlockStaff = useCallback(async (id) => {
    await staffService.toggleBlockStaff(id);
    await fetchStaff();
  }, [fetchStaff]);

  const setSearchAndResetPage = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  return {
    data,
    total,
    page,
    pages,
    limit,
    search,
    loading,
    error,
    setPage,
    setLimit,
    setSearch: setSearchAndResetPage,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleBlockStaff,
    params: mergedParams,
  };
};

export default useStaff;
