<template>
  <div class="create-view">
    <el-card class="create-wrap">
      <el-row>
        <el-input v-model="title" placeholder="标题"></el-input>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="author" placeholder="作者"></el-input>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="addTime"
            type="datetime"
            style="width: 100%;">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <textarea class="myeditor"></textarea>
      </el-row>
      <el-button type="primary" class="newcreate" @click="getPostItem">新建</el-button>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'create-view',
    data () {
      return {
        title: '',
        author: '',
        addTime: new Date(),
        myeditor: '',
        configs: {
          renderingConfig: {
            codeSyntaxHighlighting: true,
            highlightingTheme: 'atom-one-light' // 自定义代码高亮主题，可选列表(https://github.com/isagalaev/highlight.js/tree/master/src/styles)
          },
          spellChecker: false
        },
        socket: ''
      }
    },
    mounted () {
      this.initEditor()
      this.addPreviewClass('markdown-body')
      this.highlight('atom-one-light')
      this.getSocket()
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
      },
      getSocket () {
        this.socket = new WebSocket("ws://localhost:8181")
        this.socket.onopen = (e) => {
          console.log('Connection to server opened')
        }
      },
      getPostItem () {
        this.socket.send(JSON.stringify({
          title: this.title,
          author: this.author,
          addTime: this.addTime,
          content: this.myeditor.value()
        }))
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
    .title
      margin-bottom 20px
    .el-row
      margin-bottom 20px
      &:last-of-type
        margin-bottom 0
</style>