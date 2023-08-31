export default function useCreateOrder(fetch) {
  const createOrder = async (payload) => {
    const result = await fetch('/api/orders', {
      method: 'POST',
      body: payload,
    });
    const data = await result.json();
    return data;
  };

  return {
    createOrder
  }
}
