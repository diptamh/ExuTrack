const express = require("express");
const { celebrate, Joi, Segments } = require("celebrate");
const jsforce = require("jsforce");
const Salesforce = require("../../services/salesforce");
const router = express.Router();

router.post("/automations", async (req, res) => {
  const token = req.user?.oauth?.accessToken.params;
  if (!token) {
    return res.status(401).send("Unauthorized");
  } else {
    const conn = new jsforce.Connection({
      accessToken: token.access_token,
      instanceUrl: token.instance_url,
      version: "54.0",
    });
    const salesforce = new Salesforce(conn);
    await salesforce.initMap();
    const validation = await salesforce.getValidationRules(req?.body?.name);
    console.log("validation->", validation);
    // await salesforce.getAllTrigger(req?.body?.name);
    const beforeTrigger = await salesforce.getBeforeTrigger(req?.body?.name);
    console.log("beforeTrigger 1->", beforeTrigger);
    const beforeFlow = await salesforce.getBeforeFlow(req?.body?.name);
    console.log("beforeFlow 1->", beforeFlow);
    const duplicateRule = await salesforce.getDuplicateRules(req?.body?.name);
    console.log("duplicateRule 1->", duplicateRule);
    const afterTrigger = await salesforce.getAfterTrigger(req?.body?.name);
    console.log("afterTrigger 1->", afterTrigger);
    const assignmentRule = await salesforce.getAssignmentRules(req?.body?.name);
    console.log("assignmentRule 1->", assignmentRule);
    const autoResponseRule = await salesforce.getAutoResponseRules(
      req?.body?.name
    );
    console.log("autoResponseRule 1->", autoResponseRule);
    const workflowRules = await salesforce.getWorkflowRules(req?.body?.name);
    console.log("workflowRules 1->", workflowRules);
    const afterSaveTrigger = await salesforce.getAfterSaveTrigger(
      req?.body?.name
    );
    console.log("afterSaveTrigger 1->", afterSaveTrigger);
    const entitlementProcess = await salesforce.getEntitlementProcess(
      req?.body?.name
    );
    console.log("entitlementProcess 1->", entitlementProcess);

    res.json({
      validation: validation,
      beforeTrigger: beforeTrigger,
      beforeFlow: beforeFlow,
      duplicateRule: duplicateRule,
      afterTrigger: afterTrigger,
      assignmentRule: assignmentRule,
      autoResponseRule: autoResponseRule,
      workflowRules: workflowRules,
      afterSaveTrigger: afterSaveTrigger,
      entitlementProcess: entitlementProcess,
    });
  }
});

router.get("/objects", async (req, res) => {
  const token = req.user?.oauth?.accessToken.params;
  if (!token) {
    return res.status(401).send("Unauthorized");
  } else {
    const conn = new jsforce.Connection({
      accessToken: token.access_token,
      instanceUrl: token.instance_url,
      version: "54.0",
    });

    const salesforce = new Salesforce(conn);
    res.json(await salesforce.getObjects());
  }
});

module.exports = router;
