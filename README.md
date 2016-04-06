# todo
a tasks management tool

## How to run in local mode
1. in MacOS, Open a terminal window, run mongod
2. Open another window, enter 'todo' path, run DEBUG=todo:* npm start
3. Open a browser, goto localhost:3000

## Front end
javascript, angularjs

## Back end
nodejs, expressjs, mongoDB

## Unit test
#### Install
1. npm install angular --save
2. npm install -g karma --save-dev
3. npm install karma-jasmine jasmine-core --save-dev
4. npm install angular-mocks --save-dev

#### Config
1. mkdir unittest   // for save unit test .js files
2. karma init   
// Select Jasmine as your testing framework.
// Select browser, Chrome
// Specify the paths to your js and spec files. Eg. 'public/javascripts/*.js', 'unittest/*.js‘.
// After answering a few more questions you should be done.
3. Open up your karama.conf.js and add these location in to the files array (if you need them).
    'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
    'node_modules/angular/angular.js',
    'https://code.angularjs.org/1.5.0-rc.0/angular-animate.min.js',
    'node_modules/angular-mocks/angular-mocks.js',

#### Create test script
describe("taskController", function() {
    var $rootScope,
        $scope,
        controller;
    
    beforeEach(function() {
        module('todoApp');
    
        inject(function($injector){
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('taskController', {$scope: $scope});
        })
    });
    
    describe("The initial tasks count", function() {
        it("should be 6", function() {
            expect($scope.tasks.length).toEqual(6);
        });
    });
})

#### Run
(no need run server)
karma start

## e2e test
1. run server
mongod
DEBUG=todo:* npm start

2. run Selenium Service
webdriver-manager start

3. run e2e test
cd e2etest
protractor conf.js

## Run on OpenShift
### Modify Source Code
1. package.json
scripts.start: "node ./bin/www" // do not use nodemon
main: "./bin/www"

2. bin/www
set real port, and listen ip address

3. MongoDB
connect to real host and port

4. e2e test
browser.get real url address

### Uplode to OpenShift
1. Register an account
get 3 free application

2. Generate SSH key
https://developers.openshift.com/managing-your-applications/client-tools.html

3. Create Application
OpenShift web console
and create a clone in local

4. Add MongoDB and RockMongo Cartridge
OpenShift web console

5. Commit and Sync
Github Desktop, Add the correspondence project

### Run online
just open http://easenote-bennyxu.rhcloud.com in browser 