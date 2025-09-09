export const tools = [
  {
    functionDeclarations: [
      {
        name: "createStore",
        description: "Create a new store on the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the store to create.",
            },
            description: {
              type: "string",
              description: "The description of the store to create (what it sells, vibe, audience).",
            },
            storeType: {
              type: "string",
              description: "The type of store to create. One of: print_on_demand, dropship, fund.",
              enum: ["print_on_demand", "dropship", "fund"],
            },
          },
          required: ["name", "description", "storeType"],
        },
      },
      {
        name: "buildApp",
        description: "Build a new app on the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "The description of the app to build.",
            },
          },
          required: ["description"],
        },
      },
      {
        name: "createVideo",
        description: "Create a new video on the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "The description of the video to create.",
            },
          },
          required: ["description"],
        },
      },
      {
        name: "createNFT",
        description: "Create a new NFT on the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "The description of the NFT to create.",
            },
          },
          required: ["description"],
        },
      },
      {
        name: "createPodcast",
        description: "Create a new podcast on the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "The description of the podcast to create.",
            },
          },
          required: ["description"],
        },
      },
      {
        name: "toggleTheme",
        description: "Toggle the theme of the desktop interface.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "deepResearch",
        description: "Perform a deep research task on a given topic.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The topic to research.",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "generateImage",
        description: "Generate an image based on a prompt.",
        parameters: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt to generate the image from.",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "generateVideo",
        description: "Generate a short video by first creating an image from a prompt and then animating it (image-to-video).",
        parameters: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt to generate the image and derived video from.",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "openNotepad",
        description: "Open a notepad window and generate content for it.",
        parameters: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt to generate the content from.",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "createTable",
        description: "Create a table with the given data.",
        parameters: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt to generate the table from.",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "createChart",
        description: "Create an interactive Chart.js chart. Optionally, analyze a screenshot to extract data and generate the chart configuration.",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Optional title to display on the chart window.",
            },
            chartType: {
              type: "string",
              description: "Chart.js chart type.",
              enum: ["bar", "line", "pie", "doughnut", "radar", "polarArea", "scatter", "bubble"],
            },
            data: {
              type: "object",
              description: "Chart.js data object with labels and datasets.",
            },
            options: {
              type: "object",
              description: "Chart.js options object (animations, interaction, plugins, scales, etc).",
            },
            source: {
              type: "string",
              description: "If 'screenshot', the desktop will capture a screenshot and ask Gemini to extract chart-ready config; otherwise use provided data/options.",
              enum: ["screenshot", "data"],
            },
            prompt: {
              type: "string",
              description: "Optional instruction for how to extract data and which chart to build from the screenshot or provided data.",
            }
          },
        },
      },
      {
        name: "automateTask",
        description: "Automate a task by dispatching a tool call to the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            tool_call: {
              type: "object",
              description: "The tool call to dispatch. Should be an object with 'name' and 'args' properties.",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the tool to call.",
                },
                args: {
                  type: "object",
                  description: "The arguments to pass to the tool.",
                },
              },
              required: ["name", "args"],
            },
          },
          required: ["tool_call"],
        },
      },
      {
        name: "openCalculator",
        description: "Open the calculator.",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "createContract",
        description: "Create a new contract on the desktop interface.",
        parameters: {
          type: "object",
          properties: {
            companyName: {
              type: "string",
              description: "The name of the company.",
            },
            clientName: {
              type: "string",
              description: "The name of the client.",
            },
            services: {
              type: "string",
              description: "The services provided.",
            },
            cost: {
              type: "number",
              description: "The cost of the services.",
            },
            details: {
              type: "string",
              description: "The details of the agreement.",
            },
          },
          required: ["companyName", "clientName", "services", "cost", "details"],
        },
      },
      {
        name: "analyzeImage",
        description: "Capture a screenshot of the current screen and analyze it with Gemini for insights.",
        parameters: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Optional instruction for how to analyze the screenshot.",
            },
          },
        },
      },
      { name: "openEmail", description: "Open the email client.", parameters: { type: "object", properties: {} } },
      { name: "openCalendar", description: "Open the calendar app.", parameters: { type: "object", properties: {} } },
      { name: "openSheets", description: "Open Google Sheets or spreadsheet tool.", parameters: { type: "object", properties: {} } },
      { name: "openDocs", description: "Open Google Docs or document editor.", parameters: { type: "object", properties: {} } },
      { name: "openSlides", description: "Open Google Slides or presentation tool.", parameters: { type: "object", properties: {} } },
      { name: "openMeet", description: "Open Google Meet or meeting tool.", parameters: { type: "object", properties: {} } },
      { name: "openChat", description: "Open Google Chat or team chat.", parameters: { type: "object", properties: {} } },
      { name: "openSites", description: "Open Google Sites or website builder.", parameters: { type: "object", properties: {} } },
      { name: "openYouTube", description: "Open YouTube surface.", parameters: { type: "object", properties: {} } },
      { name: "openAnalytics", description: "Open analytics dashboard.", parameters: { type: "object", properties: {} } },
      { name: "openSearch", description: "Open search surface.", parameters: { type: "object", properties: {} } },
      { name: "openMaps", description: "Open maps surface.", parameters: { type: "object", properties: {} } },
      { name: "openPhotos", description: "Open photos/media library.", parameters: { type: "object", properties: {} } },
      { name: "openContacts", description: "Open contacts/CRM surface.", parameters: { type: "object", properties: {} } },
      { name: "openKeep", description: "Open notes/Keep surface.", parameters: { type: "object", properties: {} } },
      { name: "openTasks", description: "Open tasks/to-do manager.", parameters: { type: "object", properties: {} } },
      { name: "openDriveFolder", description: "Open a Drive folder picker.", parameters: { type: "object", properties: {} } },
      { name: "uploadToDrive", description: "Upload a file to Drive.", parameters: { type: "object", properties: {} } },
      { name: "downloadFromDrive", description: "Download a file from Drive.", parameters: { type: "object", properties: {} } },
      { name: "listDriveFiles", description: "List files in Drive.", parameters: { type: "object", properties: {} } },
      { name: "createDocFromNote", description: "Create a Google Doc from a note.", parameters: { type: "object", properties: {} } },
      { name: "createSheet", description: "Create a new spreadsheet.", parameters: { type: "object", properties: {} } },
      { name: "createSlideDeck", description: "Create a new slide deck.", parameters: { type: "object", properties: {} } },
      { name: "startMeeting", description: "Start a new meeting.", parameters: { type: "object", properties: {} } },
      { name: "scheduleEvent", description: "Schedule a calendar event.", parameters: { type: "object", properties: {} } },
      { name: "sendEmail", description: "Compose and send an email.", parameters: { type: "object", properties: {} } },
      { name: "draftEmail", description: "Create a draft email.", parameters: { type: "object", properties: {} } },
      { name: "analyzeSEO", description: "Analyze SEO for a site.", parameters: { type: "object", properties: {} } },
      { name: "runAdCampaign", description: "Launch an ad campaign.", parameters: { type: "object", properties: {} } },
      { name: "manageCatalog", description: "Manage product catalog.", parameters: { type: "object", properties: {} } },
      { name: "importProducts", description: "Import products from CSV or APIs.", parameters: { type: "object", properties: {} } },
      { name: "exportCSV", description: "Export data as CSV.", parameters: { type: "object", properties: {} } },
      { name: "syncShopify", description: "Sync with Shopify.", parameters: { type: "object", properties: {} } },
      { name: "syncEtsy", description: "Sync with Etsy.", parameters: { type: "object", properties: {} } },
      { name: "connectStripe", description: "Connect Stripe account.", parameters: { type: "object", properties: {} } },
      { name: "viewBalance", description: "View Stripe balance.", parameters: { type: "object", properties: {} } },
      { name: "createInvoice", description: "Create an invoice.", parameters: { type: "object", properties: {} } },
      { name: "processRefund", description: "Process a refund.", parameters: { type: "object", properties: {} } },
      { name: "generateReport", description: "Generate a report.", parameters: { type: "object", properties: {} } },
      { name: "visualizeData", description: "Create a data visualization.", parameters: { type: "object", properties: {} } },
      { name: "takeScreenshot", description: "Capture a screenshot.", parameters: { type: "object", properties: {} } },
      { name: "recordAudioNote", description: "Record an audio note.", parameters: { type: "object", properties: {} } },
      { name: "transcribeAudio", description: "Transcribe audio to text.", parameters: { type: "object", properties: {} } },
      { name: "summarizeText", description: "Summarize selected text.", parameters: { type: "object", properties: {} } },
      { name: "translateText", description: "Translate text to a target language.", parameters: { type: "object", properties: {} } }
    ],
  },
];
