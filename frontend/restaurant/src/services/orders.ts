import { type Order, OrderStatus } from '../types/orders'

export async function getAllOrders(): Promise<Order[]> {
  return [
    {
      id: 1,
      name: 'Jhon',
      status: OrderStatus.PREPARING,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
    {
      id: 2,
      name: 'Jhon',
      status: OrderStatus.PREPARING,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
    {
      id: 3,
      name: 'Jhon',
      status: OrderStatus.IN_KITCHEN,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
    {
      id: 4,
      name: 'Jhon',
      status: OrderStatus.IN_KITCHEN,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
    {
      id: 5,
      name: 'Jhon',
      status: OrderStatus.FINISHED,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
    {
      id: 6,
      name: 'Jhon',
      status: OrderStatus.FINISHED,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
    {
      id: 7,
      name: 'Jhon',
      status: OrderStatus.PREPARING,
      date: '2021-01-01 10:00:00',
      recipe: {
        id: 1,
        name: 'Pizza',
        ingredients: [
          {
            id: 1,
            name: 'Flour',
            quantity: 1,
          },
          {
            id: 2,
            name: 'Tomato',
            quantity: 2,
          },
          {
            id: 3,
            name: 'Cheese',
            quantity: 3,
          },
        ],
      },
    },
  ]
}
