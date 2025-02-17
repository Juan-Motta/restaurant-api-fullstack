import { Body } from './commons'

export interface User {
    id?: number
    name: string
    email: string
    password: string
    createdAt?: Date
}

export interface CreateUserInput extends Body {
    name: string
    email: string
    password: string
    confirmPassword: string
}
