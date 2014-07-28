/// <reference path="qunit.d.ts" />

declare var require;
module runner {
    var testModules = [
        "tests/test1"
    ];

    require(testModules, (...modules: any[]) => {
        for (var i = 0; i < modules.length; i++) {
            modules[i].load();
        }
        QUnit.load();
        QUnit.start();
    });
}