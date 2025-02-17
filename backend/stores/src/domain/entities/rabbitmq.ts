export interface CreateOrderMessage {
    event: string
    data: {
        orderId: number
        orderStatus: string
    }
}
