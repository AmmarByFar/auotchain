export default function useUpdateOrder(fetch) {
    const updateOrder = async (orderId, payload) => {
      const result = await fetch(`/api/order/${orderId}`, {
        method: 'PUT',   // or 'PATCH' if you're doing a partial update
        body: payload,
      });
      const data = await result.json();
      return data;
    };
  
    return {
      updateOrder
    }
  }
  