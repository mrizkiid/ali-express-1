<template>
     <div id="IndexPage" class="mt-4 max-w-[1200px] mx-auto px-2">
        <div class="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4">
          <div v-if="products" v-for="product in products" :key="product.id">
            <ProductComponent :product="product"/></div>
        </div>
     </div>
</template>

<script setup>
definePageMeta({
  layout: 'main-layout'
})

import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
// const products = ref([])

//fetching
// products.value = await useFetch('/api/prisma/get-all-products')
const { data: products } = await useFetch('/api/prisma/get-all-products')

onMounted(() => {
  userStore.isLoading = false
})


</script>
