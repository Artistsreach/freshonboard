export const tools = [
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
      name: "toggleTheme",
      description: "Toggle the theme of the desktop interface.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
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
            description: "If 'screenshot', the desktop will capture a screenshot and ask OpenRouter to extract chart-ready config; otherwise use provided data/options.",
            enum: ["screenshot", "data"],
          },
          prompt: {
            type: "string",
            description: "Optional instruction for how to extract data and which chart to build from the screenshot or provided data.",
          }
        },
      },
    },
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
      name: "openCalculator",
      description: "Open the calculator.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
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
  },
  {
    type: "function",
    function: {
      name: "analyzeImage",
      description: "Capture a screenshot of the current screen and analyze it with AI for insights.",
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
  },
  {
    type: "function",
    function: {
      name: "openAppWithAutomation",
      description: "Open an application or desktop shortcut with optional automation parameters.",
      parameters: {
        type: "object",
        properties: {
          appName: {
            type: "string",
            description: "The name of the application or shortcut to open.",
          },
          automationParams: {
            type: "object",
            description: "Optional automation parameters to pass to the application.",
          },
        },
        required: ["appName"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generateEmailDraft",
      description: "Generate an email draft using AI and open the Gmail app with the draft ready to edit.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Recipient email address (optional)." },
          subject: { type: "string", description: "Subject for the email (optional)." },
          prompt: { type: "string", description: "Description of what the email should say." },
          tone: { type: "string", description: "Tone of the email, e.g., friendly, formal, concise (optional)." },
          length: { type: "string", description: "Desired length, e.g., short, medium, long (optional)." },
          includeSignature: { type: "boolean", description: "Whether to include a signature block.", default: false }
        },
        required: ["prompt"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generateDocument",
      description: "Generate a plain text document using AI and open it in the Notepad window for editing.",
      parameters: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Describe the document to generate (topic, details, requirements)." },
          title: { type: "string", description: "Optional title to include at the top of the document." },
          tone: { type: "string", description: "Optional tone, e.g., professional, concise, persuasive." },
          length: { type: "string", description: "Optional length, e.g., short, medium, long." }
        },
        required: ["prompt"],
      },
    },
  },
];
