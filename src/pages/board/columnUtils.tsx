// columnUtils.ts

export const addCardToColumn = (columns, setColumns, columnId, card) => {
    const updatedColumns = columns.map(col => {
        if (col.id === columnId) {
            return { ...col, cards: [...col.cards, { ...card, id: Date.now() }] };
        }
        return col;
    });
    console.log('Updated Columns:', updatedColumns);

    setColumns(updatedColumns);
};
