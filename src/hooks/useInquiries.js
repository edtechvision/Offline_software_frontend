import { useCallback, useEffect, useMemo, useState } from 'react';
import { inquiryService } from '../services/apiService';

export const useInquiries = (initialParams = { page: 1, limit: 10, search: '' }) => {
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

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await inquiryService.getInquiries({ page, limit, search: search || undefined });
      // Expecting shape: { total, page, pages, limit, data: [...] }
      setData(res?.data || []);
      setTotal(res?.total || 0);
      setPage(res?.page || 1);
      setPages(res?.pages || 1);
      setLimit(res?.limit || limit);
    } catch (e) {
      setError(e?.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const createInquiry = useCallback(async (payload) => {
    await inquiryService.createInquiry(payload);
    await fetchInquiries();
  }, [fetchInquiries]);

  const deleteInquiry = useCallback(async (id) => {
    await inquiryService.deleteInquiry(id);
    await fetchInquiries();
  }, [fetchInquiries]);

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
    fetchInquiries,
    createInquiry,
    deleteInquiry,
    params: mergedParams,
  };
};

export default useInquiries;


