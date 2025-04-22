// /api/user POST

import prisma from "~/lib/prisma"
import bcrypt from "bcryptjs";
import validator from 'validator';
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        if (!validator.isEmail(body.email)) {
            throw createError({ statusCode: 400, message: 'Invalid email, please change.' })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        })

        const isValid = await bcrypt.compare(body.password, user.password)

        if (!isValid) {
            throw createError({ statusCode: 400, message: 'Username or password is invalid.' })
        }

        const token = jwt.sign(
            { id: user.id }, process.env.JWT_SECRET);

        setCookie(event, 'NoteNestJWT', token)

        return { data: 'success!' }
    } catch (error) {
        if (error.code === 'P2002') {
            throw createError({ statusCode: 409, message: 'Email already exists' })
        }
        throw error
    }

})

// GET
// POST
// PUT
// DELETE
// PATCH
// DELETE