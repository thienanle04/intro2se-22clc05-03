<template>
    <div>
        <userTopRating v-if="books" />
        <userLowestPrice v-if="books" />
        <userRandomBook v-if="books"/>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import userTopRating from '@/components/user/userTopRating.vue';
import userLowestPrice from '@/components/user/userLowestPrice.vue';
import userRandomBook from '@/components/user/userRandomBook.vue';

export default defineComponent({
    name: 'UserBookSections',
    components: {
        userTopRating,
        userLowestPrice,
        userRandomBook,
    },
    data() {
        return {
            books: null
        };
    },
    mounted() {
        (async () => {
            try {
                const response = await fetch ('/api/v1/books');
                console.log(response);
                
                if (response.ok) {
                    const res = await response.json();
                    this.books = res.data.books;  // Update the books
                } else {
                    console.error('Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching books data:', error.message);
            }
        })();
    },
    provide() {
        return {
            books: computed(() => this.books)
        };
    },
});
</script>