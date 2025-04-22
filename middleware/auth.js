export default defineNuxtRouteMiddleware((event) => {
    const jwt = useCookie('NoteNestJWT')

    if (!jwt.value) {
        return navigateTo('/register')
    }
})