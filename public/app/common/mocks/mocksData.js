define([], function() { return [
  {
    "name": "Users",
    "description": "API for getting users",
    "resources": [
      {
        "description": "List all users.",
        "method": "GET",
        "url": "/users?limit={limit}&offset={offset}&sort={sort}&dir={dir}",
        "request": {
          "headers": {},
          "body": null
        },
        "responses": [
          {
            "status": 200,
            "headers": {
              "Content-Type": "application/json"
            },
            "body": "[\n    {        \n        \"access\": \"rw\",\n        \"agencyLimit\": \"0\",\n        \"agencyStatus\": \"client-agency\",\n        \"avgCpc\": \"11.018451\",\n        \"avgPos\": \"3.91\",\n        \"changeAccessRequest\": \"no-request\",\n        \"clicks\": \"439\",\n        \"convCost\": \"\",\n        \"convCostValRate\": \"\",\n        \"convRate\": \"\",\n        \"convValue\": \"0\",\n        \"conversions\": \"0\",\n        \"credit\": \"0\",\n        \"creditWithVat\": \"0\",\n        \"ctr\": \"0.117915\",\n        \"dayBudget\": \"0.0\",\n        \"domain\": \"seznam.cz\",\n        \"exhaustedBudget\": \"0\",\n        \"id\": \"207100\",\n        \"impressions\": \"372302\",\n        \"ish\": \"100.0\",\n        \"lowQuality\": \"0\",\n        \"missImpressions\": \"0\",\n        \"missedPrice\": \"0.0\",\n        \"money\": \"4837.1\",\n        \"notDisplayedMessages\": \"5\",\n        \"relationName\": \"1200000aut@seznam.cz\",\n        \"relationStatus\": \"agency\",\n        \"rusUserId\": \"44355524\",\n        \"selectAccess\": \"agency\",\n        \"sendNotice\": \"0\",\n        \"stoppedBySchedule\": \"0\",\n        \"underForestThreshold\": \"0\",\n        \"underLowerThreshold\": \"0\",\n        \"username\": \"1200000aut\",\n        \"verifiedInWallet\": \"0\"\n    },\n    {        \n        \"access\": \"rw\",\n        \"agencyLimit\": \"0\",\n        \"agencyStatus\": \"client-agency\",\n        \"avgCpc\": \"11.018451\",\n        \"avgPos\": \"3.91\",\n        \"changeAccessRequest\": \"no-request\",\n        \"clicks\": \"439\",\n        \"convCost\": \"\",\n        \"convCostValRate\": \"\",\n        \"convRate\": \"\",\n        \"convValue\": \"0\",\n        \"conversions\": \"0\",\n        \"credit\": \"0\",\n        \"creditWithVat\": \"0\",\n        \"ctr\": \"0.117915\",\n        \"dayBudget\": \"0.0\",\n        \"domain\": \"seznam.cz\",\n        \"exhaustedBudget\": \"0\",\n        \"id\": \"207100\",\n        \"impressions\": \"372302\",\n        \"ish\": \"100.0\",\n        \"lowQuality\": \"0\",\n        \"missImpressions\": \"0\",\n        \"missedPrice\": \"0.0\",\n        \"money\": \"4837.1\",\n        \"notDisplayedMessages\": \"5\",\n        \"relationName\": \"huhu@seznam.cz\",\n        \"relationStatus\": \"agency\",\n        \"rusUserId\": \"44355524\",\n        \"selectAccess\": \"agency\",\n        \"sendNotice\": \"0\",\n        \"stoppedBySchedule\": \"0\",\n        \"underForestThreshold\": \"0\",\n        \"underLowerThreshold\": \"0\",\n        \"username\": \"1200000aut\",\n        \"verifiedInWallet\": \"0\"\n    },\n    {        \n        \"access\": \"rw\",\n        \"agencyLimit\": \"0\",\n        \"agencyStatus\": \"client-agency\",\n        \"avgCpc\": \"11.018451\",\n        \"avgPos\": \"3.91\",\n        \"changeAccessRequest\": \"no-request\",\n        \"clicks\": \"439\",\n        \"convCost\": \"\",\n        \"convCostValRate\": \"\",\n        \"convRate\": \"\",\n        \"convValue\": \"0\",\n        \"conversions\": \"0\",\n        \"credit\": \"0\",\n        \"creditWithVat\": \"0\",\n        \"ctr\": \"0.117915\",\n        \"dayBudget\": \"0.0\",\n        \"domain\": \"seznam.cz\",\n        \"exhaustedBudget\": \"0\",\n        \"id\": \"207100\",\n        \"impressions\": \"372302\",\n        \"ish\": \"100.0\",\n        \"lowQuality\": \"0\",\n        \"missImpressions\": \"0\",\n        \"missedPrice\": \"0.0\",\n        \"money\": \"4837.1\",\n        \"notDisplayedMessages\": \"5\",\n        \"relationName\": \"test@seznam.cz\",\n        \"relationStatus\": \"agency\",\n        \"rusUserId\": \"44355524\",\n        \"selectAccess\": \"agency\",\n        \"sendNotice\": \"0\",\n        \"stoppedBySchedule\": \"0\",\n        \"underForestThreshold\": \"0\",\n        \"underLowerThreshold\": \"0\",\n        \"username\": \"1200000aut\",\n        \"verifiedInWallet\": \"0\"\n    },\n    {        \n        \"access\": \"rw\",\n        \"agencyLimit\": \"0\",\n        \"agencyStatus\": \"client-agency\",\n        \"avgCpc\": \"11.018451\",\n        \"avgPos\": \"3.91\",\n        \"changeAccessRequest\": \"no-request\",\n        \"clicks\": \"439\",\n        \"convCost\": \"\",\n        \"convCostValRate\": \"\",\n        \"convRate\": \"\",\n        \"convValue\": \"0\",\n        \"conversions\": \"0\",\n        \"credit\": \"0\",\n        \"creditWithVat\": \"0\",\n        \"ctr\": \"0.117915\",\n        \"dayBudget\": \"0.0\",\n        \"domain\": \"seznam.cz\",\n        \"exhaustedBudget\": \"0\",\n        \"id\": \"207100\",\n        \"impressions\": \"372302\",\n        \"ish\": \"100.0\",\n        \"lowQuality\": \"0\",\n        \"missImpressions\": \"0\",\n        \"missedPrice\": \"0.0\",\n        \"money\": \"4837.1\",\n        \"notDisplayedMessages\": \"5\",\n        \"relationName\": \"huhu@seznam.cz\",\n        \"relationStatus\": \"agency\",\n        \"rusUserId\": \"44355524\",\n        \"selectAccess\": \"agency\",\n        \"sendNotice\": \"0\",\n        \"stoppedBySchedule\": \"0\",\n        \"underForestThreshold\": \"0\",\n        \"underLowerThreshold\": \"0\",\n        \"username\": \"Ondrej\",\n        \"verifiedInWallet\": \"0\"\n    }\n]"
          }
        ]
      },
      {
        "description": "Ulozi jednoho uzivatele (ucet).",
        "method": "POST",
        "url": "/users/{id}",
        "request": {
          "headers": {},
          "body": null
        },
        "responses": [
          {
            "status": 200,
            "headers": {
              "Content-Type": "application/json"
            },
            "body": "{\n\t\"id\": 1,\n\t\"relationName\": \"franta\"\n}"
          }
        ]
      },
      {
        "description": "Smaze propojeni uctu.",
        "method": "DELETE",
        "url": "/users/{id}/disconnectAccount",
        "request": {
          "headers": {},
          "body": null
        },
        "responses": [
          {
            "status": 200,
            "headers": {
              "Content-Type": "application/json"
            },
            "body": "{\t\n\t\"id\": 1,\n\t\"relationName\": \"franta\"\n}"
          }
        ]
      }
    ]
  }
]; });