generator-fayde-library
===================

Yeoman generator for Fayde Libraries.

Install `generator-fayde-library` globally.

`npm install -g generator-fayde-library`

### Generate Fayde Library

Yeoman generator will scaffold testsite sandboxed app, all build components, and a test environment that can be run from command line or launched in the browser.

```
# Create a directory and scaffold
$ mkdir <new directory>
$ cd <new directory>
$ yo fayde-library
```

### Install bower libraries and set up test and testsite libraries
```
$ gulp reset
```

### Run tests
```
# Run tests in command line
$ gulp test
```

### Run test site
```
# Launch testsite sandbox app in browser
$ gulp testsite
```
