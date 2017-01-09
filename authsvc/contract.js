var Ajv = require('ajv')
var ajv =  new Ajv({ coerceTypes: true, useDefaults: true, removeAdditional: true })
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
// Fastest
var Ajv = require('ajv');
var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true} 
var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);
