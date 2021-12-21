<template>
  <div class="container p-12">
    <h1 class="font-extrabold text-8xl">{{ quantity }} kg</h1>
    <span class="text-4xl mt-12 block">
      Terjual oleh <br />
      <span class="font-bold">{{ location }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "CustomToast",
  props: ["quantity", "location"],
};
</script>