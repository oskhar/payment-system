// vite.config.ts
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.3_sass@1.76.0/node_modules/vite/dist/node/index.js";
import vue from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.11_@types+node@22.10.3_sass@1.76.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.1.1_vite@5.4.11_@types+node@22.10.3_sass@1.76.0__vue@3.5.13_typescript@5.7.2_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/unplugin-auto-import@0.18.6_@vueuse+core@10.11.1_vue@3.5.13_typescript@5.7.2___rollup@4.29.1/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/unplugin-vue-components@0.27.5_@babel+parser@7.26.3_rollup@4.29.1_vue@3.5.13_typescript@5.7.2_/node_modules/unplugin-vue-components/dist/vite.js";
import vuetify from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/vite-plugin-vuetify@2.0.3_vite@5.4.11_@types+node@22.10.3_sass@1.76.0__vue@3.5.13_typescript@5.7.2__vuetify@3.7.5/node_modules/vite-plugin-vuetify/dist/index.mjs";
import svgLoader from "file:///mnt/c/Users/muham/Github/payment-system/web-app/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.5.13_typescript@5.7.2_/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_import_meta_url = "file:///mnt/c/Users/muham/Github/payment-system/web-app/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [
      vue(),
      vueJsx(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
      vuetify({
        styles: {
          configFile: "src/assets/styles/variables/_vuetify.scss"
        }
      }),
      Components({
        dirs: ["src/@core/components", "src/components"],
        dts: true,
        resolvers: [
          (componentName) => {
            if (componentName === "VueApexCharts")
              return { name: "default", from: "vue3-apexcharts", as: "VueApexCharts" };
          }
        ]
      }),
      // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/core", "@vueuse/math", "pinia"],
        vueTemplate: true,
        // ℹ️ Disabled to avoid confusion & accidental usage
        ignore: ["useCookies", "useStorage"]
      }),
      svgLoader()
    ],
    define: {
      "process.env": env
      // Pastikan env didefinisikan di sini
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        "@core": fileURLToPath(new URL("./src/@core", __vite_injected_original_import_meta_url)),
        "@layouts": fileURLToPath(new URL("./src/@layouts", __vite_injected_original_import_meta_url)),
        "@images": fileURLToPath(new URL("./src/assets/images/", __vite_injected_original_import_meta_url)),
        "@styles": fileURLToPath(new URL("./src/assets/styles/", __vite_injected_original_import_meta_url)),
        "@configured-variables": fileURLToPath(
          new URL("./src/assets/styles/variables/_template.scss", __vite_injected_original_import_meta_url)
        )
      }
    },
    build: {
      chunkSizeWarningLimit: 5e3
    },
    optimizeDeps: {
      exclude: ["vuetify"],
      entries: ["./src/**/*.vue"]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvbXVoYW0vR2l0aHViL3BheW1lbnQtc3lzdGVtL3dlYi1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvYy9Vc2Vycy9tdWhhbS9HaXRodWIvcGF5bWVudC1zeXN0ZW0vd2ViLWFwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2MvVXNlcnMvbXVoYW0vR2l0aHViL3BheW1lbnQtc3lzdGVtL3dlYi1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB2dWV0aWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXHJcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xyXG5cclxuLy8gTG9hZCBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJ1ZJVEVfJylcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG5cclxuICAgICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5LWxvYWRlci90cmVlL21hc3Rlci9wYWNrYWdlcy92aXRlLXBsdWdpblxyXG4gICAgICB2dWV0aWZ5KHtcclxuICAgICAgICBzdHlsZXM6IHtcclxuICAgICAgICAgIGNvbmZpZ0ZpbGU6ICdzcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMvX3Z1ZXRpZnkuc2NzcycsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIGRpcnM6IFsnc3JjL0Bjb3JlL2NvbXBvbmVudHMnLCAnc3JjL2NvbXBvbmVudHMnXSxcclxuICAgICAgICBkdHM6IHRydWUsXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBjb21wb25lbnROYW1lID0+IHtcclxuICAgICAgICAgICAgLy8gQXV0byBpbXBvcnQgYFZ1ZUFwZXhDaGFydHNgXHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnROYW1lID09PSAnVnVlQXBleENoYXJ0cycpXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogJ2RlZmF1bHQnLCBmcm9tOiAndnVlMy1hcGV4Y2hhcnRzJywgYXM6ICdWdWVBcGV4Q2hhcnRzJyB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gRG9jczogaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0I3VucGx1Z2luLWF1dG8taW1wb3J0XHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAnQHZ1ZXVzZS9jb3JlJywgJ0B2dWV1c2UvbWF0aCcsICdwaW5pYSddLFxyXG4gICAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBcdTIxMzlcdUZFMEYgRGlzYWJsZWQgdG8gYXZvaWQgY29uZnVzaW9uICYgYWNjaWRlbnRhbCB1c2FnZVxyXG4gICAgICAgIGlnbm9yZTogWyd1c2VDb29raWVzJywgJ3VzZVN0b3JhZ2UnXSxcclxuICAgICAgfSksXHJcbiAgICAgIHN2Z0xvYWRlcigpLFxyXG4gICAgXSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICAncHJvY2Vzcy5lbnYnOiBlbnYsIC8vIFBhc3Rpa2FuIGVudiBkaWRlZmluaXNpa2FuIGRpIHNpbmlcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICAgJ0Bjb3JlJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy9AY29yZScsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAgICdAbGF5b3V0cyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvQGxheW91dHMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnQGltYWdlcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL2ltYWdlcy8nLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnQHN0eWxlcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL3N0eWxlcy8nLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnQGNvbmZpZ3VyZWQtdmFyaWFibGVzJzogZmlsZVVSTFRvUGF0aChcclxuICAgICAgICAgIG5ldyBVUkwoJy4vc3JjL2Fzc2V0cy9zdHlsZXMvdmFyaWFibGVzL190ZW1wbGF0ZS5zY3NzJywgaW1wb3J0Lm1ldGEudXJsKSxcclxuICAgICAgICApLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwMCxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgZXhjbHVkZTogWyd2dWV0aWZ5J10sXHJcbiAgICAgIGVudHJpZXM6IFsnLi9zcmMvKiovKi52dWUnXSxcclxuICAgIH0sXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtVLFNBQVMscUJBQXFCO0FBQ2hXLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sZUFBZTtBQVBrTCxJQUFNLDJDQUEyQztBQVV6UCxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLE9BQU87QUFFaEQsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBO0FBQUEsTUFHUCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsVUFDTixZQUFZO0FBQUEsUUFDZDtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsV0FBVztBQUFBLFFBQ1QsTUFBTSxDQUFDLHdCQUF3QixnQkFBZ0I7QUFBQSxRQUMvQyxLQUFLO0FBQUEsUUFDTCxXQUFXO0FBQUEsVUFDVCxtQkFBaUI7QUFFZixnQkFBSSxrQkFBa0I7QUFDcEIscUJBQU8sRUFBRSxNQUFNLFdBQVcsTUFBTSxtQkFBbUIsSUFBSSxnQkFBZ0I7QUFBQSxVQUMzRTtBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQTtBQUFBLE1BR0QsV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLE9BQU8sY0FBYyxnQkFBZ0IsZ0JBQWdCLE9BQU87QUFBQSxRQUN0RSxhQUFhO0FBQUE7QUFBQSxRQUdiLFFBQVEsQ0FBQyxjQUFjLFlBQVk7QUFBQSxNQUNyQyxDQUFDO0FBQUEsTUFDRCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sZUFBZTtBQUFBO0FBQUEsSUFDakI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsUUFDcEQsU0FBUyxjQUFjLElBQUksSUFBSSxlQUFlLHdDQUFlLENBQUM7QUFBQSxRQUM5RCxZQUFZLGNBQWMsSUFBSSxJQUFJLGtCQUFrQix3Q0FBZSxDQUFDO0FBQUEsUUFDcEUsV0FBVyxjQUFjLElBQUksSUFBSSx3QkFBd0Isd0NBQWUsQ0FBQztBQUFBLFFBQ3pFLFdBQVcsY0FBYyxJQUFJLElBQUksd0JBQXdCLHdDQUFlLENBQUM7QUFBQSxRQUN6RSx5QkFBeUI7QUFBQSxVQUN2QixJQUFJLElBQUksZ0RBQWdELHdDQUFlO0FBQUEsUUFDekU7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsdUJBQXVCO0FBQUEsSUFDekI7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxTQUFTO0FBQUEsTUFDbkIsU0FBUyxDQUFDLGdCQUFnQjtBQUFBLElBQzVCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
