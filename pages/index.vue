<template>
    <div class="flex bg-zinc-900 h-screen">
        <!-- sidebar -->
        <div class="bg-black w-[338px] p-8 flex flex-col overflow-scroll">
            <div>
                <Logo />
            </div>

            <!-- today main container -->
            <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-8 mb-4">Today</p>
                <div class="ml-2 space-y-2">
                    <div v-for="note in todayNotes" class="p-2 rounded-lg cursor-pointer"
                        :class="{ 'bg-[#A1842C]': selectedNote.id === note.id, 'hover:bg-[#A1842C]/50': note.id !== selectedNote.id }"
                        @click="setNote(note)">
                        <h3 class="text-sm font-bold text-[#C2C2C5] truncate">
                            {{ note.text.substring(0, 50) }}
                        </h3>
                        <div class="leading-none truncate text-[#D6D6D6]">
                            <span class="text-xs text-[#F4F4F5] mr-4">{{ new
                                Date(note.updatedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                            }}</span>
                            <span v-if="note.text.length > 50" class="text-xs text-[#D6D6D6]"> {{
                                note.text.substring(50, 100) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /today main container -->

            <!-- yesterday main container -->
            <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-8 mb-4">Yesterday</p>
                <div class="ml-2">
                    <div v-for="note in yesterdayNotes" class="p-2 rounded-lg cursor-pointer"
                        :class="{ 'bg-[#A1842C]': selectedNote.id === note.id, 'hover:bg-[#A1842C]/50': note.id !== selectedNote.id }"
                        @click="setNote(note)">
                        <h3 class="text-sm font-bold text-[#C2C2C5] truncate">
                            {{ note.text.substring(0, 50) }}
                        </h3>
                        <div class="leading-none truncate text-[#D6D6D6]">
                            <span class="text-xs text-[#F4F4F5] mr-4">
                                Yesterday
                            </span>
                            <span v-if="note.text.length > 50" class="text-xs text-[#D6D6D6]"> {{ note.text.substring(50, 100) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /yesterday main container -->

            <!-- everything else main container -->
            <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-8 mb-4">Prev 30 Days</p>
                <div class="ml-2">
                    <div v-for="note in earlierNotes" class="p-2 rounded-lg cursor-pointer"
                        :class="{ 'bg-[#A1842C]': selectedNote.id === note.id, 'hover:bg-[#A1842C]/50': note.id !== selectedNote.id }"
                        @click="setNote(note)">
                        <h3 class="text-sm font-bold text-[#C2C2C5] truncate">
                            {{ note.text.substring(0, 50) }}
                        </h3>
                        <div class="leading-none truncate text-[#D6D6D6]">
                            <span class="text-xs text-[#F4F4F5] mr-4">
                                {{ new Date(note.updatedAt).toLocaleDateString() }}
                            </span>
                            <span v-if="note.text.length > 50" class="text-xs text-[#D6D6D6]"> {{ note.text.substring(50, 100) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /everything else main container -->

        </div>
        <!-- /sidebar -->
        <!-- note container -->
        <div class="w-full flex flex-col">
            <div class="flex justify-between items-start w-full p-8">
                <button @click="createNewNote"
                    class="inline-flex items-center text-xs text-[#C2C2C5] font-bold space-x-2 hover:text-white">
                    <PencilIcon />
                    <span>Create Note</span>
                </button>
                <button>
                    <TrashIcon class="text-[#6D6D73] hover:text-white" />
                </button>
            </div>
            <div class="max-w-[437px] mx-auto w-full flex-grow flex flex-col">
                <p class="text-[#929292] font-playfair">
                    {{ new Date(selectedNote.updatedAt).toLocaleDateString() }}
                </p>
                <textarea ref="textarea" v-model="updatedNote" name="note" id="note"
                    class="text-[#D4D4D4] my-4 font-playfair w-full bg-transparent focus:outline-none resize-none flex-grow"
                    @input="
                        () => {
                            debouncedFn()
                            selectedNote.text = updatedNote
                        }
                    ">
        </textarea>
            </div>

            <button class="text-zinc-400 hover:text-white text-sm font-bold absolute right-0 bottom-0 p-8"
                @click="logout">
                Logout
            </button>
        </div>
        <!-- /note container -->
    </div>
</template>


<script setup>
const notes = ref([])
const selectedNote = ref({})
const updatedNote = ref('')
const textarea = ref(null)


definePageMeta({
    middleware: ['auth']
})

function setNote(note) {
    selectedNote.value = note
    updatedNote.value = note.text
}

function logout() {
    const jwtCookie = useCookie('NoteNestJWT')
    jwtCookie.value = null
    navigateTo('/login')
}

async function createNewNote() {
    try {
        const newNote = await $fetch(`/api/notes/`, {
            method: 'POST',
        })
        notes.value.unshift(newNote)
        selectedNote.value = notes.value[0]
        updatedNote.value = ''
        textarea.value.focus()
    } catch (error) {
        console.error('Error updating note:', error)
    }
}

const debouncedFn = useDebounceFn(async () => {
    await updatedNoteFunc()
}, 1000)

async function updatedNoteFunc() {
    try {
        await $fetch(`/api/notes/${selectedNote.value.id}`, {
            method: 'PATCH',
            body: {
                updatedNote: updatedNote.value
            }
        })
    } catch (error) {
        console.error('Error updating note:', error)
    }
}

const todayNotes = computed(() => {
    return notes.value.filter(note => {
        const noteDate = new Date(note.updatedAt).toDateString()
        const todayDate = new Date().toDateString()
        return noteDate === todayDate
    })
})
const yesterdayNotes = computed(() => {
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    return notes.value.filter(note => {
        const noteDate = new Date(note.updatedAt).toDateString()
        return noteDate === yesterdayDate.toDateString()
    })
})
const earlierNotes = computed(() => {
    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    return notes.value.filter(note => {
        const noteDate = new Date(note.updatedAt)
        return noteDate < yesterdayDate && noteDate.toDateString() !== yesterdayDate.toDateString()
    })
})

onMounted(async () => {
    notes.value = await $fetch('/api/notes')
    notes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    if (notes.value.length > 0) {
        selectedNote.value = notes.value[0]
    } else {
        await createNewNote()
        selectedNote.value = notes.value[0]
    }

    updatedNote.value = selectedNote.value.text
    textarea.value.focus()
})
</script>