# CalComposer

## Installation
```npm install --save https://github.com/kiselli/calDavComposer```

## Usage

```js
var composer = require('calDavComposer');

var arrayOfUrls = [
'http://user:password@myCalendar.com'
];

composer.composeFromUrls(arrayOfUrls).then(function(calendar){
	....
});

```

## Demo
```git clone https://github.com/kiselli/calDavComposer.git   

cd calDavComposer```

modify demo/config.js for your needs

```npm install   

node demo```


## Tests
npm test
