import _ from "lodash";

const newCompanyRegex =
  "(?:[Tt]he )?(.+? Company(?: of Canada|, Inc\\.)?)(?: \\((.+?)\\))?";

function buildCompanyRegex(companies) {
  if (companies.size() > 0) {
    const companyNames = companies.reduce((arr, company) => {
      return arr.concat([company.name]).concat(company.aliases);
    }, []);
    return "(?:[Tt]he )?(" + companyNames.join("|") + ")";
  } else {
    return "(?:[Tt]he )?(.+ Company)";
  }
}

function buildIncorporationResultFrom(companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const match = text.match(
    `^${newCompanyRegex} is (?:founded|formed)(?: by (.+?))?(?: as a ` +
    `subsidiary of ${companyRegex})?\\.$`
  );

  if (match) {
    const [newCompanies, company] = companies.findOrCreate(match[1], match[2]);
    let parentCompany;

    if (match[4] != null) {
      parentCompany = newCompanies.find(match[4]);
    }

    const founder = match[3];
    const events = [
      {
        company: company,
        data: { founder, parentCompany },
        date: date,
        type: "incorporation",
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
    const [newCompanies, company] = companies.findOrCreate(match[1], match[2]);
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
    `^${companyRegex} is re-established as ${newCompanyRegex}, a subsidiary ` +
    `of ${companyRegex}\\.$`
  );

  if (match) {
    const oldCompany = companies.find(match[1]);
    const company = companies.findOrCreate(match[2], match[3]);
    const parentCompany = companies.find(match[4]);
    const events = [
      {
        company: company,
        data: { oldCompany, parentCompany },
        date: date,
        type: "transfer",
      },
    ];
    return { companies, events };
  } else {
    return null;
  }
}

function buildAcquisitionResultFrom (companies, date, text) {
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
      {
        company: childCompany,
        data: { parentCompany: company },
        date: date,
        isHidden: true,
        type: "reverse-acquisition",
      },
    ];
    return { companies, events };
  } else {
    return null;
  }
}

function buildMergerResultFrom (companies, date, text) {
  const companyRegex = buildCompanyRegex(companies);
  const regexp = new RegExp(
    `^${companyRegex} and ${companyRegex} merge to become ` +
    `${newCompanyRegex}\\.$`
  );
  // console.log("regexp", regexp);
  const match = text.match(regexp);

  if (match) {
    const firstCompany = companies.find(match[1]);
    const secondCompany = companies.find(match[2]);
    const [newCompanies, company] = companies.findOrCreate(match[3], match[4]);
    const sources = _.sortBy([firstCompany, secondCompany], "index");
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
    const [newCompanies, company] = companies.findOrCreate(match[1], match[2]);
    const parentCompany = companies.find(match[3]);
    const events = [
      {
        company: company,
        data: { parentCompany },
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

export default function buildResult(companies, date, text) {
  return buildIncorporationResultFrom(companies, date, text) ||
    buildJointVentureResultFrom(companies, date, text) ||
    buildTransferResultFrom(companies, date, text) ||
    buildAcquisitionResultFrom(companies, date, text) ||
    buildMergerResultFrom(companies, date, text) ||
    buildSpinoffResultFrom(companies, date, text) ||
    buildReleaseResultFrom(companies, date, text);
}
