import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tracking } from '../utils/Helpers';

export function PageTracker() {
    const location = useLocation();
  
    useEffect(() => {
      const currentPage = location.pathname.replace('/', '') || 'home';
      
      tracking(
        'globalcounter',
        'TMD_firstVisit',  // site-wide key
        `${currentPage}Expiry`
      );
  
    }, [location.pathname]);
  
    return null;
}