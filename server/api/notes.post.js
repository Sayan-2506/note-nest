import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event)
    const token = cookies.NoteNestJWT

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authorized to access notes',
      })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (typeof decodedToken !== 'object' || !decodedToken.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid token',
      })
    }

    const newNote = await prisma.note.create({
      data: {
        text: '',
        userId: decodedToken.id,
      },
    })

    return newNote
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not verify jwt',
    })
  }
})
