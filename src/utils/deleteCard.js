// In demo mode, this function is a no-op since deletion is handled locally
export const deleteCard = async (cardId, userToken) => {
  // In demo mode, deletion is handled by local state updates
  // This function is kept for compatibility but does nothing
  return Promise.resolve();
};
