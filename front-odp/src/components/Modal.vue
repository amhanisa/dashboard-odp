<template>
  <transition name="modal-fade">
    <div
      class="
        modal-backdrop
        fixed
        h-full
        w-full
        top-0
        left-0
        bg-gray-500 bg-opacity-50
        flex
        items-center
        justify-center
      "
    >
      <div
        class="
          modal
          inline-block
          bg-white
          rounded-md
          overflow-hidden
          text-left
          max-w-lg
        "
      >
        <div class="px-6 py-4">
          <div class="mb-4 font-bold">
            <slot name="header"> </slot>
          </div>
          <div>
            <slot name="body"> default body </slot>
          </div>
        </div>
        <div
          class="
            bg-gray-50
            px-4
            py-3
            sm:px-6
            flex
            justify-end
            flex-col-reverse
            sm:flex-row
          "
        >
          <button @click="close" class="px-6 py-2 bg-gray-300 rounded-md mr-3">
            Close
          </button>

          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>