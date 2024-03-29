<template>
    <div id="MainLayout" class="w-full z-50 fixed">
        <div id="TopMenu" class="w-full bg-[#FAFAFA] border-b md:block hidden">
            <ul class="
                flex
                items-center
                justify-end
                text-xs
                text-[#333333]  
                font-light
                px-2
                h-10
                bg-[#FAFAFAFA]
                max-w-[1200px] 
            ">
                <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
                    Sell on AlieExpress
                </li>
                <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
                    Cookies Preferences
                </li>
                <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
                    Help
                </li>
                <li class="border-r border-r-gray-400 px-3 hover:text-[#FF4646] cursor-pointer">
                    Buyer Protection
                </li>
                <li class=" px-3 hover:text-[#FF4646] cursor-pointer">
                    <Icon name="ic:sharp-install-mobile" size="17" />
                    App
                </li>
                <li
                    @mouseenter="mouseEnter"
                    @mouseleave="mouseLeave"
                    class="relative flex items-center px-1.5 hover:text-[#FF4646] h-full cursor-pointer"
                    :class="isAccountMenu ? 'bg-white border z-40 shadow-[0_15px_100px_40px_rgb(0,0,0,0.3)]' : 'border border-[#FAFAFA]'"
                >
                    <Icon name="ph:user-thin" size="17" />
                    Account
                    <Icon name="mdi:chevron-down" size="15" class="ml-5" />

                    <div 
                    id="AccountMenu" 
                    v-if="isAccountMenu"
                    class="absolute bg-white w-[220px] text-[#333333] z-40 top-[38px] -left-[100px] border-x border-b">
                        <div v-if="!user">
                            <div class="text-semibold text-[15px] my-4 px-3">Welcome to AliExpress</div>
                            <div class="flex items-center gap-1 px-3 mb-3">
                                <NuxtLink to="/auth" class="bg-[#FF4646] text-center w-full text-[16px] rounded-sm text-white font-semibold p-2">
                                    Login / Register
                                </NuxtLink>
                            </div>
                        </div>
                        <div class="border-b" />
                        <ul class="bg-white">
                            <li 
                                @click="navigateTo('/orders')"
                                class="text-[13px] py-2 px-4 w-full hover:bg-gray-200">
                                My Orders
                            </li>
                            <li
                                v-if="user"    
                                class="text-[13px] py-2 px-4 w-full hover:bg-gray-200"
                                @click="signOut"
                            >
                                Sign Out
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div class="w-full bg-[#ffffff]">
            <div
                class="flex lg:justify-start justify-between gap-10 max-w-[1150px] w-full px-3 py-5 mx-auto "
            >
                <NuxtLink to="/" class="min-w-[170px]">
                    <img src="/AliExpress-logo.png" alt="AlieExpress-logo" width="170">
                </NuxtLink>
                <div class="max-w-[700px] w-full md:block hidden">
                    <div class="relative">
                        <div class="flex items-center border-2 border-[#FF4646] rounded-md w-full">
                            <input type="text"
                                class="
                                w-full
                                placeholder-gray-400
                                text-sm
                                pl-3
                                focus:outline-none
                                "
                                placeholder="kitchen accesories"
                                v-model="searchItem"
                            >
                            <Icon
                                v-if="isSearching"
                                name="eos-icons:loading"
                                size="25"
                                class="mr-2"
                            />
                            <button class="flex items-center h-[100%] p-1.5 px-2 bg-[#FF4646]">
                                <Icon name="ph:magnifying-glass" size="20" color="#ffffff" />
                            </button>
                        </div>
                        <div v-if="items && showResult" class="absolute bg-white max-w-[700px] h-auto w-full">
                            <div class="p-1 ">
                                <NuxtLink
                                    v-for="item in items"
                                    :to="`/item/${item.id}`"
                                    class="flex items-center justify-between w-full cursor-pointer hover:bg-gray-100 mt-2"
                                    @click="dispose"
                                >
                                    <div class="flex items-center">
                                        <img :src="item.url" alt="g" class="rounded-md" width="40">
                                        <div class="truncate ml-2">{{ item.title }}</div>
                                    </div>
                                    <div class="truncate">{{ item.price / 100 }}</div>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
                <NuxtLink 
                    to="/shoppingcart"
                    class="flex items-center "
                >
                    <button
                        @mouseenter="mouseEnterCartIcon"
                        @mouseleave="mouseLeaveCartIcon"
                        class="relative md:block hidden"
                    >
                        <span
                            class="absolute flex items-center justify-center top-0 right-0 bg-[#FF4646] h-[17px] min-w-[17px] text-xs text-white px-0.5 rounded-full"
                        >
                            {{ userStore.cart.length }}
                        </span>
                        <div class="min-w-[40px]">
                            <Icon name="ph:shopping-cart-simple-light" size="33" :color="isCartHover ? '#FF4646' : ''"/>
                        </div>
                    </button>
                </NuxtLink>
                <button 
                    @click="userStore.isMenuOverlay = true"
                    class="md:hidden block rounded-full p-1.5 -mt-[4px] hover:bg-gray-200"
                >
                    <Icon name="radix-icons:hamburger-menu" size="33"/>
                </button>
            </div>
        </div>
    </div>

    <Loading v-if="userStore.isLoading" />

    <div class="lg:pt-[150px] md:pt-[130px] pt-[80px]"></div>
    <slot />
    <Footer v-if="!userStore.isLoading"/>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
const client = useSupabaseClient()
const user = useSupabaseUser()
const userStore = useUserStore()

const isAccountMenu = ref(false)
const mouseEnter = () => {
    isAccountMenu.value = true
}
const mouseLeave = () => {
    isAccountMenu.value = false
}

const searchItem = ref('')
const isSearching = ref(false)
const items = ref(null)
const searchByName = useDebounce(async () => {
    isSearching.value = true
    const data = await $fetch(`/api/prisma/search-by-name/${searchItem.value}`)
    isSearching.value = false
    items.value = data
}, 100)
watch(searchItem, async () => {
    if(!searchItem.value) {
        setTimeout(() => {
            items.value = null
            isSearching.value = false
            return
        })
    }
    searchByName()
})
const showResult = ref(false)
watch(items,() => {
    if(items.value) {
        showResult.value = true
    } else {
        showResult.value = false
    }
})

const isCartHover = ref(false)
const mouseEnterCartIcon = () => {
    isCartHover.value = true
}
const mouseLeaveCartIcon = () => {
    isCartHover.value = false
}

const signOut = async () => {
    client.auth.signOut()
}

const dispose = () => {
    searchItem.value = null
    items.value = null
    showResult.value = false
    isSearching.value = false
}

</script>