<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon
        icon="ri-heart-line"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By
      <a
        href="https://github.com/oskhar"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >Oskhar</a>
    </span>
  </div>
</template>
