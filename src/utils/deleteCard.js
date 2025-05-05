export const deleteCard = async (cardId, userToken) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/applications/${cardId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to delete the application');
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Error deleting the application:', error);
    throw error; // let caller decide what to do
  }
};
