import _ from "lodash";
import buildResult from "./buildResult";
import EventCollection from "./EventCollection";
import CompanyCollection from "./CompanyCollection";

function buildEventDate(rawDate) {
  const yearDateMatch = rawDate.match(/^(\d+)(\?)?$/);

  if (yearDateMatch) {
    return {
      value: new Date(`Jan 1, ${yearDateMatch[1]}`),
      isFuzzy: (yearDateMatch[2] !== undefined)
    };
  } else {
    return {
      value: new Date(rawDate),
      isFuzzy: false
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
              events: model.events.add(result.event),
              companies: model.companies.merge(result.companies)
            };
          } else {
            throw `Couldn't build result from "${line}"`;
          }
        } else {
          return model;
        }
      },
      {
        events: new EventCollection(),
        companies: new CompanyCollection()
      }
    );
}
