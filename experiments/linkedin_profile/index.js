const ExperimentRunner = require("../../utils/ExperimentRunner");
require("dotenv").config();

const LINKEDIN_QUERY = `
{
  profile {
    name
    headline
    currentPosition
    about
    experience[] {
      title
      company
      duration
      description
    }
    education[] {
      school
      degree
      duration
      description
    }
    skills[] {
      name
    }
    recommendations[] {
      name
      description
    }
    patents[] {
      title
      date
      id
      description
    }
    awards[] {
      title
      date
      description
    }
    languages[] {
      name
    }
    interests {
      topVoices[] {
        name
        title
      }
      companies[]
      groups[]
      newsletters[] {
        name
        description
        url
        people
      }
      schools[]
    }
    causes[]
  }
}`;

async function main() {
  const runner = new ExperimentRunner({
    headless: false,
    baseUrl: "http://localhost:3000",
  });

  await runner.init();

  try {
    const { result, savedTo } = await runner.runExperiment(
      "linkedin_profile",
      LINKEDIN_QUERY,
      "Jody Glidden _ LinkedIn"
    );

    console.log("Experiment completed!");
    console.log("Results saved to:", savedTo);
    console.log("Extracted Data:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Experiment failed:", err);
  }
}

main().catch(console.error);
