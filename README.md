# front-movies-deep-learning

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Building and development

When retrieving the project, run the following commands:

	sudo npm install -g grunt-cli bower yo generator-karma generator-angular
	npm install && bower install

WARNING: material-angular-paging bower module isn't working with grunt (wiredep task) because of a missing `main` attribute in its bower.json. Replace `"main":""` with `"main":"build/dist.min.js"` to fix the bug !

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing
Warning : no unit test currently : need to be done.

Running `grunt test` will run the unit tests with karma.

## TODOs

- [x] Check wrong password/username on login
- [ ] Check if username don't already exist on sign up (account creation, when user enter his username)