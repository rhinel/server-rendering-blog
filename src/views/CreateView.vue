<template>
  <div class="create-view">
    <el-card class="create-wrap">
      <textarea class="myeditor"></textarea>
    </el-card>
  </div>
</template>

<script>
  let simplemde
  if (process.env.VUE_ENV == 'client') {
    simplemde = require('simplemde')
    require('simplemde/dist/simplemde.min.css')
    require.ensure([], () => require('github-markdown-css'), 'markdown-style')
  }

  export default {
    name: 'create-view',
    data () {
      return {
        myeditor: ''
      }
    },
    mounted () {
      this.myeditor = new simplemde({
        element: document.querySelector('.myeditor')[0]
      })
      this.addPreviewClass('markdown-body')
    },
    methods: {
      addPreviewClass(className) {
        const wrapper = this.myeditor.codemirror.getWrapperElement()
        const preview = document.createElement('div')
        wrapper.nextSibling.className += ` ${className}`
        preview.className = `editor-preview ${className}`
        wrapper.appendChild(preview)
      }
    }
  }
</script>

<style lang="stylus">
.create
  &-view
    padding 20px 0
  &-wrap
    position relative
    z-index 1000
    overflow visible
</style>