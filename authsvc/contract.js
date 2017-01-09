var Ajv = require('ajv')
var ajv = Ajv();
var schema = {
  "type": "object",
  "properties": {
    "foo": { "type": "number" },
    "bar": { "type": "string" }
  },
  "required": [ "foo", "bar" ]
};

var data = { "foo": 1 };

var valid = ajv.validate(schema, data);

if (!valid) {
  return res.send(400, ajv.errorsText(), ajv.errors);
}
