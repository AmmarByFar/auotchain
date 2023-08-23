import { useAuthenticatedFetch } from './useAuthenticatedFetch';

export default async function useProducts() {
  const fetch = useAuthenticatedFetch();

  const products = await fetch('/api/products').then((res) => res.json());

  return {
    products,
  };
}
