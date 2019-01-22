import { compact, find, sortBy } from "lodash";
import findFirstResult from "../util/findFirstResult";

const newCompanyRegex =
  "(?:[Tt]he )?" +
  "(" +
  ".+? " +
  "(?:Corporation|Company|Laboratories|Department|Telephonic Exchange)" +
  "(?: of .+?|, Inc\\.)?" +
  ")" +
  "(?: \\((.+?)\\))?";

function buildCompanyRegex(companies) {
  if (companies.size() > 0) {
    const companyNames = companies.reduce((arr, company) => {
      return arr.concat([company.name]).concat(company.aliases);
    }, []).sort();
    return (
      "(?:(?:[Tt]he|an) )?" +
      "(" +
      "unknown company|" +
      "(?:" + companyNames.join("|") + ")" +
      ")"
    );
  } else {
    return "";
  }
}

function buildIncorporationResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${newCompanyRegex} is (?:created|founded|formed)(?: by (.+?))?(?: as a ` +
    `subsidiary of ${companyRegex})?\\.$`
  );

  if (match) {
    const [newCompanies, company] = companies.create({
      aliases: [match[2]],
      name: match[1],
    });
    const founder = match[3];
    const parentCompanies = [];

    if (match[4] != null) {
      parentCompanies.push(newCompanies.find(match[4]));
    }

    const events = [
      {
        company: company,
        data: { founder, parentCompanies },
        date: date,
        type: "incorporation",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildFormationResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${newCompanyRegex} is created as a division of ${companyRegex}\\.$`
  );

  if (match) {
    const [newCompanies, company] = companies.create({
      aliases: [match[2]],
      name: match[1],
    });
    let parentCompanies = [newCompanies.find(match[3])];

    const events = [
      {
        company: company,
        data: { parentCompanies },
        date: date,
        type: "formation",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildJointVentureResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${newCompanyRegex} is (?:founded|formed) as a joint venture between ` +
    `${companyRegex} and ${companyRegex}\\.$`
  );

  if (match) {
    const [newCompanies, company] = companies.create({
      aliases: [match[2]],
      name: match[1],
    });
    const firstParentCompany = companies.find(match[3]);
    const secondParentCompany = companies.find(match[4]);
    const events = [
      {
        company: company,
        data: { contributors: [firstParentCompany, secondParentCompany] },
        date: date,
        type: "jointVenture",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildTransferResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${companyRegex} is transferred to ${companyRegex}\\.$`
  );

  if (match) {
    const company = companies.find(match[1]);
    const parentCompany = companies.find(match[2]);

    const events = [
      {
        company: company,
        data: { parentCompany },
        date: date,
        type: "transfer",
      },
    ];
    return { companies: companies, events: events };
  } else {
    return null;
  }
}

function buildReestablishmentResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${companyRegex} is (?:re-established as|reorganized into) ` +
    `${newCompanyRegex}, a (?:subsidiary of|joint venture between) ` +
    `${companyRegex}(?: and ${companyRegex})?\\.$`
  );

  if (match) {
    const oldCompany = companies.find(match[1]);
    const [newCompanies, newCompany] = companies.create({
      aliases: [match[3]],
      index: oldCompany.index,
      name: match[2],
    });
    const parentCompanies = [companies.find(match[4])];

    if (match[5] != null) {
      parentCompanies.push(companies.find(match[5]));
    }

    const events = [
      {
        company: newCompany,
        data: { oldCompany, parentCompanies },
        date: date,
        type: "reestablishment",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildRenameResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${companyRegex} changes its name to ${newCompanyRegex}\\.$`
  );

  if (match) {
    const oldCompany = companies.find(match[1]);
    const [newCompanies, newCompany] = companies.create({
      aliases: [match[3]],
      index: oldCompany.index,
      name: match[2],
    });
    const events = [
      {
        company: newCompany,
        data: { oldCompany },
        date: date,
        type: "rename",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildBuyoutResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${companyRegex} is bought out by (.+), becoming ${newCompanyRegex}\\.`
  );

  if (match) {
    const oldCompany = companies.find(match[1]);
    const buyer = match[2];
    const [newCompanies, newCompany] = companies.create({
      aliases: [match[4]],
      index: oldCompany.index,
      name: match[3],
    });
    const events = [
      {
        company: newCompany,
        data: { buyer, oldCompany },
        date: date,
        type: "buyout",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildAcquisitionResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(`^${companyRegex} acquires ${companyRegex}\\.$`);

  if (match) {
    const company = companies.find(match[1]);
    const childCompany = companies.find(match[2]);
    const events = [
      {
        company: company,
        data: { childCompany },
        date: date,
        type: "acquisition",
      },
    ];
    return { companies, events };
  } else {
    return null;
  }
}

function buildMergerResultFrom (companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match1 = text.match(
    `${companyRegex} and ${companyRegex} merge to (?:become|form) ` +
    `${newCompanyRegex}\\.$`
  );
  const match2 = text.match(
    `${companyRegex} merges with ${companyRegex} to (?:become|form) ` +
    `${newCompanyRegex}\\.$`
  );
  const match = find([match1, match2]);

  if (match) {
    const firstCompany = companies.find(match[1]);
    let secondCompany;

    if (match[2] !== "unknown company") {
      secondCompany = companies.find(match[2]);
    }

    const [newCompanies, company] = companies.create({
      aliases: [match[4]],
      name: match[3],
    });
    const sources = sortBy(compact([firstCompany, secondCompany]), "index");
    const events = [
      {
        company: company,
        data: { sources },
        date: date,
        type: "merger",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildSpinoffResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const regexp = new RegExp(
    `^${newCompanyRegex} is (?:split|spun) off from ${companyRegex}\\.$`
  );
  const match = text.match(regexp);

  if (match) {
    const [newCompanies, company] = companies.create({
      aliases: [match[2]],
      name: match[1],
    });
    const parentCompanies = [companies.find(match[3])];
    const events = [
      {
        company: company,
        data: { parentCompanies },
        date: date,
        type: "spinoff",
      },
    ];
    return { companies: newCompanies, events: events };
  } else {
    return null;
  }
}

function buildReleaseResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const regexp = new RegExp(`^${companyRegex} releases (.+?)\\.$`);
  const match = text.match(regexp);

  if (match) {
    const company = companies.find(match[1]);
    const productName = match[2];
    const events = [
      {
        company: company,
        data: { productName },
        date: date,
        type: "release",
      },
    ];
    return { companies, events };
  } else {
    return null;
  }
}

function buildControllingInterestPurchaseResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const regexp = new RegExp(
    `^${companyRegex} purchases a controlling interest in ${companyRegex}\\.$`
  );
  const match = text.match(regexp);

  if (match) {
    const company = companies.find(match[1]);
    const providingCompany = companies.find(match[2]);
    const events = [
      {
        company: company,
        data: { providingCompany },
        date: date,
        type: "controllingInterestPurchase",
      },
    ];
    return { companies, events };
  } else {
    return null;
  }
}

function buildShareDivestureResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const regexp = new RegExp(
    `^${companyRegex} divests its shares of ${companyRegex}\\.$`
  );
  const match = text.match(regexp);

  if (match) {
    const company = companies.find(match[1]);
    const receivingCompany = companies.find(match[2]);
    const events = [
      {
        company: company,
        data: { receivingCompany },
        date: date,
        type: "shareDivesture",
      },
    ];
    return { companies, events };
  } else {
    return null;
  }
}

const typedResultBuilders = [
  buildAcquisitionResultFrom,
  buildBuyoutResultFrom,
  buildControllingInterestPurchaseResultFrom,
  buildFormationResultFrom,
  buildIncorporationResultFrom,
  buildJointVentureResultFrom,
  buildMergerResultFrom,
  buildReestablishmentResultFrom,
  buildReleaseResultFrom,
  buildRenameResultFrom,
  buildShareDivestureResultFrom,
  buildSpinoffResultFrom,
  buildTransferResultFrom,
];

export default function buildResult(companies, date, text) {
  return findFirstResult(typedResultBuilders, runTypedResultBuilder => {
    return runTypedResultBuilder(companies, date, text);
  });
}
