<script setup lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];
</script>

<template>
  <div class="quill-editor-wrapper">
    <ClientOnly>
      <QuillEditor
        v-model:content="content"
        contentType="html"
        theme="snow"
        :toolbar="toolbarOptions"
      />
    </ClientOnly>
  </div>
</template>

<style>
.quill-editor-wrapper .ql-container {
  min-height: 300px;
  font-family: "Kanit", sans-serif;
  font-size: 1rem;
}

.quill-editor-wrapper .ql-editor {
  @apply prose prose-lg max-w-none text-gray-600;
  min-height: 100%;
}

/* Fix for placeholder color to match prose */
.quill-editor-wrapper .ql-editor.ql-blank::before {
  @apply text-gray-400 not-italic;
}
</style>
