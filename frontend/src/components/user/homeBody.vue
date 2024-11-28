<template>
    <div>
        <userTopRating />
        <userLowestPrice />
        <userRandomBook />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
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
});
</script>