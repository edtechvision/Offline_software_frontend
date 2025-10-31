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
  const [status, setStatus] = useState(initialParams.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update status when initialParams.status changes
  useEffect(() => {
    if (initialParams.status !== undefined) {
      setStatus(initialParams.status);
    }
  }, [initialParams.status]);

  const mergedParams = useMemo(() => {
    const params = { page, limit, search };
    if (status) {
      params.status = status;
    }
    return params;
  }, [page, limit, search, status]);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requestParams = { page, limit, search: search || '' };
      if (status) {
        requestParams.status = status;
      }
      const res = await inquiryService.getInquiries(requestParams);
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
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const createInquiry = useCallback(async (payload) => {
    await inquiryService.createInquiry(payload);
    await fetchInquiries();
  }, [fetchInquiries]);

  const updateInquiry = useCallback(async (id, inquiryData) => {
    await inquiryService.updateInquiry(id, inquiryData);
    await fetchInquiries();
  }, [fetchInquiries]);

  const deleteInquiry = useCallback(async (id) => {
    await inquiryService.deleteInquiry(id);
    await fetchInquiries();
  }, [fetchInquiries]);

  const updateInquiryStatus = useCallback(async (id, statusData) => {
    await inquiryService.updateInquiryStatus(id, statusData);
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
    updateInquiry,
    deleteInquiry,
    updateInquiryStatus,
    params: mergedParams,
  };
};

export default useInquiries;


