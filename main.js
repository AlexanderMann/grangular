require.config({
  paths: {
    "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js",
    "bootstrap": "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js",
    "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular",
    "angularResource": "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-resource",
    "angularRoute": "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-route",
    "grangularConcatApp": "release/grangularExampleNgConcatApp.js"
  },
  shim: {
    "jquery": {
       "exports": "$"
    },
    "bootstrap": {
       "deps": ["jquery"]
    },
    "angular": {
      "exports": "angular"
    },
    "angularResource": {
      "deps": ["angular"]
    },
    "angularRoute": {
      "deps": ["angular"]
    },
    "angularSanitize": {
      "deps": ["angular"]
    },
    "grangularNgApp": {
      "deps": [
        "angular",
        "angularResource",
        "angularRoute",
        "angularSanitize"
      ],
      "exports": "grangularNgApp"
    }
  }
});
