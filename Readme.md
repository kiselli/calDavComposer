# CalComposer

## Installation
```npm install --save <git remote url>```

## Usage

```nodejs
var composer = require('calDavComposer');

var arrayOfUrls = [
'http://user:password@myCalendar.com'
];

composer.composeFromUrls(arrayOfUrls);
```

## Tests
npm test