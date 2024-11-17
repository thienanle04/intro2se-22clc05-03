import { addComponent } from "./addComponent.js";

export default {
    data() {
        return {
            isAddComponent: true
        }
    },
    components: {
        addComponent
    },
    methods: {
        addBook(data){
            console.log(data);
        }
    },
    template: `
    <addComponent v-if="isAddComponent === true" @submit-book="addBook"/>
`
};
