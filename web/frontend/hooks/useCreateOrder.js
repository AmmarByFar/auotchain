export default function useCreateOrder(fetch) {
  const createOrder = async (payload) => {
    const result = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await result.json();
    return data;
  };

  return {
    createOrder
  }
}
