import Planner from "../models/planner.model.js";
import EventCatalog from "../models/eventCatalog.model.js";
import defaultEventCatalog from "./defaultEventCatalog.js";
import defaultPlanners from "./defaultPlanners.js";

const ensureSeedData = async () => {
  for (const planner of defaultPlanners) {
    const normalizedPlanner = {
      ...planner,
      contact: {
        ...planner.contact,
        email: planner.contact.email.toLowerCase(),
      },
    };

    await Planner.findOneAndUpdate(
      { "contact.email": normalizedPlanner.contact.email },
      normalizedPlanner,
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );
  }

  for (const eventRecord of defaultEventCatalog) {
    await EventCatalog.findOneAndUpdate(
      { slug: eventRecord.slug },
      eventRecord,
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );
  }
};

export default ensureSeedData;
