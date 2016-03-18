
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

    describe("After onCheck() the task status", function() {
        it("should be finished", function() {
            for(var i=0 ; i<$scope.tasks.length; i++) {
                var task = $scope.tasks[i];
                var oldStatus = task.status;
                $scope.onCheck(task);
                
                switch(oldStatus) {
                    case "ongoing":
                        expect(task.status).toEqual('finished');
                        break;
                    case "finished":
                        expect(task.status).toEqual('ongoing');
                        break;
                    case "deleted":
                        expect(task.status).toEqual('finished');
                        break;
                }
            }
        });
    });
    
    describe("After onClearTrash(), the tasks array", function() {
        it("should not contain any task with deleted status", function() {
            $scope.onClearTrash();
            expect(
                $scope.tasks.some(function(task) {
                    return task.status === 'deleted';
                })
            ).toEqual(false);
        })
    })
})
