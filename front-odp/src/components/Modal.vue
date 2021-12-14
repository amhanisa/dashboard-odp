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
          <div class="mb-4 font-bold flex">
            <slot name="header"> </slot>
            <button @click="close" class="p-2 bg-gray-300 rounded-md ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
              >
                <path
                  d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
                />
              </svg>
            </button>
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