import { intersection } from './helpers';

export const applyRules = parsed =>
  rules.reduce(
    (exp, rule) =>
      rule.apply(
        exp.map(group =>
          group.inner
            ? {
                vars: [],
                inner: applyRules(group.inner),
                suffix: applyRules(group.suffix),
                prefix: applyRules(group.prefix)
              }
            : group
        )
      ),
    parsed
  );

// TODO: X + !X

const rules = [
  {
    label: '!!! => !',
    apply: expSchema =>
      expSchema.map(group => ({
        ...group,
        vars: group.vars.map(v =>
          v.length > 2 ? v.substr(v.length % 2 === 0 ? v.length - 2 : v.length - 1) : v
        )
      }))
  },
  {
    label: 'X + X',
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
    label: 'X(A + B)Z => XZ(A + B)',
    apply: expSchema =>
      expSchema.map(group => {
        if (group.inner && group.suffix.length > 0) {
          const isSuffixComplex = group.suffix[0].inner;
          const prefixVars = group.prefix[0] ? group.prefix[0].vars : [];

          if (!isSuffixComplex) {
            return {
              ...group,
              prefix: [{ vars: prefixVars.concat(group.suffix[0].vars) }],
              suffix: []
            };
          }

          const subGroup = group.suffix[0];
          const subGroupPrefixVars = subGroup.prefix[0] ? subGroup.prefix[0].vars : [];

          return {
            ...group,
            prefix: [{ vars: prefixVars.concat(subGroupPrefixVars) }],
            suffix: [
              {
                ...subGroup,
                prefix: []
              }
            ]
          };
        }

        return group;
      })
  },
  {
    label: 'X*(Y + Z) = X*Y + X*Z',
    apply: expSchema => expSchema
  },
  {
    label: 'X * X',
    apply: expSchema =>
      expSchema.map(group => ({
        ...group,
        vars: Object.keys(group.vars.reduce((acc, cur) => ({ ...acc, [cur]: true }), {}))
      }))
  },
  {
    label: 'X * !X',
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
