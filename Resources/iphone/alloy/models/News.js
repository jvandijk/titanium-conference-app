var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

var moment = require("alloy/moment");

exports.definition = {
    config: {
        columns: {
            id: "INTEGER PRIMARY KEY",
            title: "TEXT",
            content: "TEXT",
            date: "TEXT",
            modified: "TEXT"
        },
        URL: "http://conference.phpbenelux.eu/2015/api/get_recent_posts",
        debug: 0,
        deleteAllOnFetch: true,
        useStrictValidation: 0,
        parentNode: "posts",
        adapter: {
            idAttribute: "id",
            type: "sqlrest",
            collection_name: "news",
            addModifedToUrl: true,
            lastModifiedColumn: "modified"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            comparator: function(item) {
                return -parseInt(moment(item.get("date")).format("X"));
            }
        });
        return Collection;
    }
};

model = Alloy.M("news", exports.definition, []);

collection = Alloy.C("news", exports.definition, model);

exports.Model = model;

exports.Collection = collection;