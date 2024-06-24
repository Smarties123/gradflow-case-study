import React from 'react';
import { faker } from '@faker-js/faker/locale/en';
import uniqueId from 'lodash/uniqueId';
import { Icon } from '@rsuite/icons';
import { FaJsSquare } from 'react-icons/fa';

export const creatCard = () => {
  return {
    id: uniqueId(),
    companyName: 'Company Name',
    companyPosition: 'Position',
    icon: <FaJsSquare />,
    to: faker.internet.url()
  };
};

export const mockCards = (length: number) =>
  Array.from({ length }, () => creatCard());

const boards = [
  {
    id: 1,
    icon: <Icon as={FaJsSquare} />,
    data: [
      {
        title: 'Applied',
        cards: mockCards(2)
      },
      {
        title: 'Assessment',
        cards: mockCards(2)
      },
      {
        title: 'Interview',
        cards: mockCards(2)
      },
      {
        title: 'Offer',
        cards: mockCards(2)
      }
    ]
  }
];

export type CardType = ReturnType<typeof creatCard>;
export type CardList = typeof boards[0]['data'];
export type BoardType = typeof boards[0];

export default boards;
