import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook for managing URL parameters
 * @param {Object} defaultParams - Default parameter values
 * @returns {Object} - URL parameters and setter functions
 */
export const useURLParams = (defaultParams = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [params, setParams] = useState(() => {
    const initialParams = { ...defaultParams };
    
    // Extract parameters from URL
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const courseId = searchParams.get('courseId');
    const batchId = searchParams.get('batchId');
    const className = searchParams.get('className');
    
    if (page) initialParams.page = parseInt(page, 10);
    if (limit) initialParams.limit = parseInt(limit, 10);
    if (search) initialParams.search = search;
    if (courseId) initialParams.courseId = courseId;
    if (batchId) initialParams.batchId = batchId;
    if (className) initialParams.className = className;
    
    return initialParams;
  });

  // Update URL when params change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        newSearchParams.set(key, value.toString());
      }
    });
    
    setSearchParams(newSearchParams, { replace: true });
  }, [params, setSearchParams]);

  const updateParam = (key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateMultipleParams = (updates) => {
    setParams(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetParams = () => {
    setParams(defaultParams);
  };

  return {
    params,
    updateParam,
    updateMultipleParams,
    resetParams
  };
};

export default useURLParams;
