# 基于webpack4搭建ts环境

## 初始化项目
`yarn init -y`

## 安装依赖
`yarn add "ts-loader": "^5.3.3","tslint": "^5.13.0","typescript": "^3.3.3333","webpack": "^4.29.5","webpack-cli": "^3.2.3" --save`

## 全局下的package.json

```
{
  "name": "webpack-ts-demo",
  "version": "0.0.1",
  "private": true,
  "author": "wuhaohao <1611499758@qq.com>",
  "license": "MIT",
  "scripts": {
    "build": "webpack",
    "dev": "tsc --watch && yarn lint",
    "lint": "tslint --project tslint.json"
  },
  "dependencies": {
    "ts-loader": "^5.3.3",
    "tslint": "^5.13.0",
    "typescript": "^3.3.3333",
    "webpack": "^4.29.5",
    "webpack-cli": "^3.2.3"
  }
}
```
## 全局下的tsconfig.json
```
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* 选择es6 */
    "module": "es6",                     /* 采用es6模块,可以使用import与export. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    "declaration": true,                   /* 生成对应的.d.ts声明文件. */
    "declarationMap": true,                /* 生成对应的.d.tsmap声明文件. */
    // "sourceMap": true,                     /* 生成对应的map文件，用于对于错误的捕捉. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "./dist",                        /* 输出为dist目录. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    "removeComments": true,                /* 输出文件没有注释 */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitAny": true,                 /* 如果没有类型会报错的 */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictPropertyInitialization": true,  /* Enable strict che  cking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    "moduleResolution": "node",            /* 采用node形式. */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    "experimentalDecorators": true,        /* 这个是可以写装饰器的. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  },
  "include": [ /* 入口文件目录 */
    "src/**/*"
  ],
  "exclude": [  /* 这写文件不需要编译 */
    "dist",
    "node_modules",
    "**/*.spec.ts"
  ] 
}
```
## 全局下的webpack.config.js
```
const path = require('path');

module.exports = {
    entry: './src/index.ts',//入口文件
    devtool: 'inline-source-map',//错误匹配到src下对应的文件
    module: {
        rules: [ //匹配规则:匹配所有的ts,使用ts-loader,忽略node_modules
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {  
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {  //编译为dist/bundle.js
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```

## 全局下的tslint.json
```
{
    "defaultSeverity": "error",  //错误警告
    "extends": "tslint:recommended", //使用typescript稳定型的
    "jsRules": {},
    "rules": {  //代码规则
        "interface-name": false,
        "trailing-comma": false,
        "max-classes-per-file": false,
        "ordered-imports": false,
        "variable-name": false,
        "prefer-const": false,
        "member-ordering": false,
        "no-bitwise": false,
        "forin": false,
        "object-literal-sort-keys": false,
        "one-line": [
            false
        ],
        "object-literal-key-quotes": [
            false
        ],
        "no-string-literal": false,
        "no-angle-bracket-type-assertion": false,
        "only-arrow-functions": false,
        "no-namespace": false,
        "no-internal-module": false,
        "unified-signatures": false,
        "ban-types": false,
        "no-conditional-assignment": false,
        "radix": false,
        "no-console": false,
        "semicolon": false,
        "eofline": false,
        "quotemark": false,
        "no-unused-variable": false,
        "no-trailing-whitespace": false,
        "no-unused-expression": false,
        "no-empty": false
    },
    "rulesDirectory": []
}
```