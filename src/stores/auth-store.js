import { authLogin } from "@/api/auth"
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const AuthStore = (set) => ({
    token: null,
    user:null,
    actionLogin: async(data) => {
        const res = await authLogin(data)
        set({
            token: res.data.access_token,
            user: res.data.payload
        })
    }
})

const userPersist = {
    name: "token",
    storage: createJSONStorage(() => localStorage)
}

const useAuthStore = create(persist(AuthStore, userPersist))

export default useAuthStore
