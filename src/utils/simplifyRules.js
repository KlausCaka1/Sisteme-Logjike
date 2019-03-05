import { intersection } from './helpers';

const rules = [
  {
    label: 'X+X',
    apply: expSchema => {
      let schema = expSchema;
      let i = 0;

      while (i < schema.length) {
        const dupIndex = schema
          .slice(i + 1)
          .findIndex(
            group =>
              schema[i].vars.length === group.vars.length &&
              intersection(schema[i].vars, group.vars).length === group.vars.length
          );

        if (dupIndex !== -1) {
          schema = schema.filter((el, j) => j !== i);
        } else {
          i++;
        }
      }

      return schema;
    }
  },
  {
    label: 'X*X',
    apply: expSchema =>
      expSchema.map(group => ({
        vars: Object.keys(group.vars.reduce((acc, cur) => ({ ...acc, [cur]: true }), {}))
      }))
  },
  {
    label: 'X*!X',
    apply: expSchema =>
      expSchema.filter(group => {
        const vars = [...group.vars];
        let i = 0;

        while (i < vars.length) {
          const otherVar = vars[i].length > 1 ? vars[i].substr(1) : `!${vars[i]}`;
          const otherIndex = vars.slice(i + 1).findIndex(el => el === otherVar);

          if (otherIndex !== -1) {
            return false;
          }

          i++;
        }

        return true;
      })
  }
];

export default rules;
