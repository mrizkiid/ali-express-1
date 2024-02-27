import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler( async () => {
    let products = await prisma.products.findMany()
    return products
})