const ExperimentRunner = require("../../utils/ExperimentRunner");
require("dotenv").config();

const SEC_QUERY = `
{
  filer {
    filerName
    filerCompanyName
  }
  citizenShipOrPlaceOfOrganization 
  issuerName
  nameOfReportingPersons[]
  percentageAcquired 
  purpose    
}`;

async function main() {
  const runner = new ExperimentRunner();
  await runner.init();

  try {
    const { result, savedTo } = await runner.runExperiment(
      "sec_filing",
      SEC_QUERY,
      "example_1"
    );

    console.log("Experiment completed!");
    console.log("Results saved to:", savedTo);
    console.log("Extracted Data:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Experiment failed:", err);
  }
}

main().catch(console.error);
