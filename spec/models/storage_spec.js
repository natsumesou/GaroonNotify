describe("garoon.Models.Storage", function() {
    var storage;
    beforeEach(function() {
        storage = new garoon.Models.Storage();
    });

    describe("schedules", function(){
        beforeEach(function() {
            storage.set({schedules: new garoon.Collections.Schedule([
                                                                    new garoon.Models.Schedule(),
                                                                    new garoon.Models.Schedule()
            ])});
        });

        it("get schedules data", function() {
            expect(storage.schedules().length).toBe(2);
        });

        it("set scheduels data", function() {
            var schedules = new garoon.Collections.Schedule();
            expect(storage.schedules(schedules).length).toBe(0);
        });
    });

    describe("domain", function(){
        beforeEach(function() {
            storage = new garoon.Models.Storage({domain: 'http://test.com'});
        });

        it("get domain data", function() {
            expect(storage.domain()).toBe('http://test.com');
        });

        it("set domain data", function() {
            expect(storage.domain('http://test.jp')).toBe('http://test.jp');
        });
    });

    describe("username", function(){
        beforeEach(function() {
            storage = new garoon.Models.Storage({username: 'testuser'});
        });

        it("get username data", function() {
            expect(storage.username()).toBe('testuser');
        });

        it("set username data", function() {
            expect(storage.username('testuser2')).toBe('testuser2');
        });
    });

    describe("password", function(){
        beforeEach(function() {
            storage = new garoon.Models.Storage({password: 'testpass'});
        });

        it("get password data", function() {
            expect(storage.password()).toBe('testpass');
        });

        it("set password data", function() {
            expect(storage.password('testpass2')).toBe('testpass2');
        });
    });

    describe("load", function(){
        beforeEach(function() {
            Storage['domain'] = 'test'
            storage = new garoon.Models.Storage();
        });

        it("load localStorage data", function() {
            expect(storage.load().domain()).toBe('test');
        });
    });

    describe("save", function(){
        beforeEach(function() {
            storage = new garoon.Models.Storage();
        });

        it("data to loadStorage", function() {
            storage.domain('hoge.jp');
            storage.save();
            expect(Storage['domain']).toBe('hoge.jp');
        });
    });

    afterEach(function() {
        Storage['domain'] = undefined;
    });
});
