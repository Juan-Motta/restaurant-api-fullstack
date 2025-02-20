export interface Buy {
  id: number
  date: string
  items: {
    id: number
    name: string
  }[]
}
