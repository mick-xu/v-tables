<template>
<component :is="compName" :type="iconName" :color="iconColor" :size="iconSize" />
</template>

<script>
import CustomIcon from "./CustomIcon";
export default {
    name: "Icons",
    components: {
        CustomIcon
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        color: String,
        size: {
            type: [Number, String],
            default: 16
        }
    },
    computed: {
        compName() {
            return this.type ? this.type.startsWith("icon") ? "CustomIcon" : "Icon" : 'CustomIcon';
        },
        iconName() {
            return this.type;
        },
        iconSize() {
            return this.size || (this.iconType === "CustomIcon" ? 16 : undefined);
        },
        iconColor() {
            return this.color || "";
        }
    },
    methods: {}
};
</script>

<style>
</style>
