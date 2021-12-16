<template>
  <div class="container">
    <h1 class="font-extrabold text-xl">{{ quantity }} kg</h1>
    <span
      >Terjual oleh <span class="font-bold">{{ location }}</span></span
    >
  </div>
</template>

<script>
export default {
  name: "CustomToast",
  props: ["quantity", "location"],
};
</script>