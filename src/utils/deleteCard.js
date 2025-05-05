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

        if (response.ok) {
            onClose();
      } else {
        console.error('Failed to delete the application');
      }
    } catch (error) {
      console.error('Error deleting the application:', error);
    }
  };