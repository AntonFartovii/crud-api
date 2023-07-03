#### Комманды 
```
nodemon --exec ts-node index.ts
```
`ts-node` - для запуска ts файлов  
`nodemon` - для перезапуска при изменениях  
`–exec` - позволяет указать двоичный файл, с помощью которого будет выполняться файл. 
Например, в сочетании с двоичным файлом ts-node –exec 
может отслеживать изменения и запускать файлы TypeScript.

Команду можно разместить в nodemon.json или package.json  
```
nodemon.json
{
  "watch": ["server"],
  "ext": "ts",
  "ignore": ["*.test.ts"],
  "delay": "3",
  "execMap": {
    "ts": "ts-node"
  }
}
```
Обратите внимание: вместо флага –exec мы используем здесь execMap. 
execMap позволяет указывать двоичные файлы, которые следует применять при определенных расширениях файлов.
```
package.json
"nodemonConfig": {
  "watch": [
    "server"
  ],
  "ext": "ts",
  "ignore": [
    "*.test.ts"
  ],
  "delay": "3",
  "execMap": {
    "ts": "ts-node"
  }
}
```
После внесения изменений в nodemon.json или package.json 
я могу запустить nodemon таким образом:
```
nodemon index.ts
```

