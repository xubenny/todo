

describe('todo homepage', function() {
    it('should greet the named user', function() {
        browser.get('http://localhost:3000/index.html');

        element(by.model('keyword')).sendKeys('book');
        todoList = element.all(by.repeater('task in filteredTasks'));
        expect(todoList.count()).toEqual(2);

        element(by.model('keyword')).sendKeys('s');
        todoList = element.all(by.repeater('task in filteredTasks'));
        expect(todoList.count()).toEqual(1);
    });
});


