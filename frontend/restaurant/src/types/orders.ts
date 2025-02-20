export interface Order {
  id: number
  recipe: {
    id: number
    name: string
  }
  status: OrderStatus
  createdAt: string
}

export enum OrderStatus {
  PREPARING = 'PREPARING',
  IN_KITCHEN = 'IN_KITCHEN',
  FINISHED = 'FINISHED',
}

export interface OrderStatusResume {
  status: string
  count: number
  totalCount: number
}
