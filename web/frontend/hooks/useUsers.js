import { useState, useEffect } from 'react';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

export default function useUsers() {
  const fetch = useAuthenticatedFetch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  return users;
}