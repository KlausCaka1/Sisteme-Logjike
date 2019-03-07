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
    label: 'A + !A',
    apply: expSchema => {
      let tmpExpSchema = [...expSchema];
      let curIndex = 0;

      while (curIndex < tmpExpSchema.length) {
        const group = tmpExpSchema[curIndex];
        if (group.vars.length === 1) {
          const otherValue =
            group.vars[0].length > 1 ? group.vars[0].substring(1) : `!${group.vars[0]}`;
          const otherIndex = tmpExpSchema
            .slice(curIndex + 1)
            .findIndex(
              otherGroup => otherGroup.vars.length === 1 && otherGroup.vars[0] === otherValue
            );

          if (otherIndex !== -1) {
            tmpExpSchema = [{ vars: ['1'] }];
          }
        }

        curIndex++;
      }

      return tmpExpSchema;
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
    apply: expSchema => {
      let tmpExpSchema = [...expSchema];
      let curIndex = 0;

      while (curIndex < tmpExpSchema.length) {
        const group = tmpExpSchema[curIndex];

        if (
          group.inner &&
          group.suffix.length === 0 &&
          group.prefix.length !== 0 &&
          group.prefix[0].vars[group.prefix[0].vars.length - 1] !== '!'
        ) {
          const newGroups = group.inner.map(innerGroup => {
            if (innerGroup.inner) {
              return {
                ...innerGroup,
                prefix: innerGroup.prefix[0]
                  ? [
                      {
                        ...innerGroup.prefix[0],
                        vars: group.prefix[0].vars.concat(innerGroup.prefix[0].vars)
                      }
                    ]
                  : group.prefix
              };
            }

            return { ...innerGroup, vars: innerGroup.vars.concat(group.prefix[0].vars) };
          });

          tmpExpSchema = []
            .concat(tmpExpSchema.slice(0, curIndex))
            .concat(newGroups)
            .concat(tmpExpSchema.slice(curIndex + 1));
        } else if (group.inner && group.suffix.length === 0 && group.prefix.length === 0) {
          //--------------------------------|
          // SPECIAL CASE  '(AB+C) => AB+C' |
          //--------------------------------|

          tmpExpSchema = []
            .concat(tmpExpSchema.slice(0, curIndex))
            .concat(group.inner)
            .concat(tmpExpSchema.slice(curIndex + 1));
        } else if (
          group.inner &&
          group.inner.length === 1 &&
          group.inner[0].vars.length === 1 &&
          group.prefix[0] &&
          group.prefix[0].vars.length === 1 &&
          group.prefix[0].vars[0] === '!'
        ) {
          //---------------------------|
          // SPECIAL CASE '!(A) => !A' |
          //---------------------------|

          tmpExpSchema[curIndex] = { vars: [`!${group.inner[0].vars[0]}`] };
          curIndex++;
        } else {
          curIndex++;
        }
      }

      return tmpExpSchema;
    }
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
          const otherVar = vars[i].length > 1 ? vars[i].substring(1) : `!${vars[i]}`;
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
