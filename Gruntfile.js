module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // ============== 文件合并  ===============
    concat: {
      // 合并公用 css
      commonCss: {
        src: ['lib/layer.mobile/layer/need/layer.css', 'assets/css/global.css', 'lib/ice.scrollY/main.css', 'lib/ice.slider/main.css', 'assets/css/layout.css', 'assets/css/dev.css', 'assets/css/theme-default.css'],
        dest: 'assets/css/common.css'
      },
      // 合并 commonjs
      commonJs: {
        src: ['lib/require.js', 'lib/require.config.js', 'lib/ice.js', 'lib/ice.*/main.js'],
        dest: 'dist/assets/js/common.js'
      }
    },

    // ============== css 压缩  ===============
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      // 压缩公用 css
      commonCss: {
        src: 'assets/css/common.css',
        dest: 'dist/assets/css/common.css'
      }
    },

    // ============== js 压缩  ===============
    uglify: {
      options: {
        mangle: {
          except: ['define', 'require', 'module', 'exports']
        },
        compress: false,
        stripBanners: true
      },
      commonJs: {
        files: [{
          expand: true,
          cwd: 'dist/assets/js/',
          src: ['common.js'],
          dest: 'dist/assets/js/',
          extDot: '',
          ext: '.js'
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: 'assets/js/',
          src: ['*/*.js'],
          dest: 'dist/assets/js/',
          extDot: '',
          ext: '.js'
        }]
      }
    },

    // =============== 合并 html =============
    includereplace: {
      meta: {
        options: {

        },
        src: 'html/**/*.*',
        dest: 'dist/'
      }
    },

    // =============== 复制 =============
    copy: {
      icon: {
        files: [{
          expand: true,
          src: ['favicon.icon'],
          dest: 'dist/'
        }]
      },
      app: {
        files: [{
          expand: true,
          src: ['app/**'],
          dest: 'dist/'
        }]
      },
      action: {
        files: [{
          expand: true,
          src: ['action/**'],
          dest: 'dist/'
        }]
      },
      lib: {
        files: [{
          expand: true,
          src: ['lib/*/**', 'libapp/*/**'],
          dest: 'dist/'
        }]
      }
    },

    // ============== html 压缩 =============
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'dist/html',
          src: '**/*.*',
          dest: 'dist/html'
        }]
      }
    },

    // ============== 图片压缩 =============
    imagemin: {
      main: {
        options: {
          //定义 jpg png 图片优化水平
          optimizationLevel: 4,
          pngquant: true,
          svgoPlugins: [{
            removeViewBox: false
          }]
        },
        files: [{
          expand: true,
          cwd: 'assets/images',
          src: ['**/*.{png,jpg,jpeg}'],
          dest: 'dist/assets/images'
        }]
      }
    },

    // ============== 监控 =================
    watch: {
      // 监控配置
      options: {
        // 1s 执行，默认 500ms
        debounceDelay: 1000
      },

      // 后端文件
      app: {
        files: ['app/**'],
        tasks: ['copy:app']
      },

      // 接口文件
      action: {
        files: ['action/**'],
        tasks: ['copy:action']
      },

      // 小图标
      icon: {
        files: ['*.icon'],
        tasks: ['copy:icon']
      },

      // 合并压缩 common.js
      commonJs: {
        files: ['lib/*.js', 'lib/ice*/*.js'],
        tasks: ['concat:commonJs', 'uglify:commonJs']
      },

      // 合并压缩 common.css
      commonCss: {
        files: ['assets/css/*.css', 'lib/ice*/*.css'],
        tasks: ['concat:commonCss', 'cssmin:commonCss' ]
      },

      // 压缩项目普通脚本
      scripts: {
        files: ['assets/js/**/*'],
        tasks: ['uglify:js']
      },

      // 合并项目 html 代码
      html: {
        files: ['html/**/*', 'modules/*'],
        tasks: ['includereplace', 'htmlmin']
      },

      // 插件复制
      lib: {
        files: ['lib/*/**', 'libapp/*/**'],
        tasks: ['copy:lib']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('img', '图片压缩', function() {
    grunt.task.run(['imagemin']);
  });

  grunt.registerTask('pack', '监控打包', function() {
    grunt.task.run(['watch']);
  });

  grunt.registerTask('default', '默认任务', function() {
    grunt.task.run(['concat', 'cssmin', 'uglify', 'includereplace', 'htmlmin', 'copy'])
  });
};
