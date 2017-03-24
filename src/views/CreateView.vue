<template>
  <div class="create-view">
    <el-card class="create-wrap">
      <textarea class="myeditor"></textarea>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'create-view',
    data () {
      return {
        myeditor: '',
        configs: {
          renderingConfig: {
            codeSyntaxHighlighting: true,
            highlightingTheme: 'atom-one-light' // 自定义代码高亮主题，可选列表(https://github.com/isagalaev/highlight.js/tree/master/src/styles)
          },
          spellChecker: false
        }
      }
    },
    mounted () {
      this.initEditor()
      this.addPreviewClass('markdown-body')
      this.highlight('atom-one-light')
    },
    methods: {
      initEditor () {
        let configs = {
          element: document.querySelector('.myeditor')[0]
        }
        Object.assign(configs, this.configs)
        let simplemde = require('simplemde')
        require('simplemde/dist/simplemde.min.css')
        require.ensure([], () => require('github-markdown-css'), 'markdown-style')
        this.myeditor = new simplemde(configs)
      },
      addPreviewClass (className) {
        const wrapper = this.myeditor.codemirror.getWrapperElement()
        const preview = document.createElement('div')
        wrapper.nextSibling.className += ` ${className}`
        preview.className = `editor-preview ${className}`
        wrapper.appendChild(preview)
      },
      highlight (tm) {
        require.ensure([], () => {
          const theme = tm || 'default'
          window.hljs = require('highlight.js')
          require(`highlight.js/styles/${theme}.css`)
        }, 'highlight')
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