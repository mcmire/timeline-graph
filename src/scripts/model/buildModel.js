import _ from "lodash";
import buildResult from "./buildResult";
import CompanyCollection from "./CompanyCollection";
import EventCollection from "./EventCollection";

function buildEventDate(rawDate) {
  const yearDateMatch = rawDate.match(/^(\d+)(\?)?$/);

  if (yearDateMatch) {
    return {
      isFuzzy: (yearDateMatch[2] !== undefined),
      value: new Date(`Jan 1, ${yearDateMatch[1]}`),
    };
  } else {
    return {
      isFuzzy: false,
      value: new Date(rawDate),
    };
  }
}

export default function buildModel(story) {
  return story
    .split(/\n+/)
    .filter(text => {
      return !/^#/.exec(text) && !_.isEmpty(text);
    })
    .reduce(
      (model, line) => {
        const lineMatch = line.match(/^(.+): (.+)$/);

        if (lineMatch) {
          const [rawDate, description] = lineMatch.slice(1);
          const date = buildEventDate(rawDate);
          const result = buildResult(model.companies, date, description);

          if (result) {
            return {
              companies: model.companies.merge(result.companies),
              events: model.events.merge(result.events),
            };
          } else {
            throw new Error(`Couldn't build result from "${line}"`);
          }
        } else {
          return model;
        }
      },
      {
        companies: new CompanyCollection(),
        events: new EventCollection(),
      }
    );
}
