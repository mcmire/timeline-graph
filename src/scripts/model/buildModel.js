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

export default function buildModel(data) {
  let state = {
    companies: new CompanyCollection(),
    descriptionLines: [],
    events: new EventCollection(),
    lastThingParsed: null,
    rawDate: null,
  };

  data.split(/\n/).forEach(line => {
    if (state.lastThingParsed === "eventDate") {
      if (/\.( \[.+\])?$/.test(line)) {
        const description = state.descriptionLines
          .concat([line.replace(/^[ ]{2}/, "")])
          .join(" ")
          .replace(/[ ]+/g, " ");
        const date = buildEventDate(state.rawDate);
        const result = buildResult(state.companies, date, description);

        if (result != null) {
          state.lastThingParsed = "eventDescription";
          state.rawDate = null;
          state.descriptionLines = [];
          state.companies = state.companies.merge(result.companies);
          state.events = state.events.merge(result.events);
        } else {
          throw new Error(`Couldn't interpret "${description}"`);
        }
      } else if (/^[ ]{2}/.test(line)) {
        state.descriptionLines.push(line.replace(/^[ ]{2}/, ""));
      } else {
        throw new Error(`Couldn't figure out what to do with "${line}"`);
      }
    } else {
      const match = line.match(/^([^/].+):$/);

      if (match != null) {
        state.lastThingParsed = "eventDate";
        state.rawDate = match[1];
      }
    }
  });

  return { companies: state.companies, events: state.events };
}
