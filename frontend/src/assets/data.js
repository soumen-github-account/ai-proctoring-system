

export const user_data = [
    {
        "id": 1,
        "userId":"student12",
        "pssword":"1234"
    }
]

export const examInstructions = {
  title: "Important Instructions for Candidates",
  subtitle: "This examination is monitored using an AI Proctoring System",

  instructions: [
    "This exam is conducted under AI-based remote proctoring. Your webcam and microphone will remain active throughout the test.",
    "Ensure you are seated alone in a well-lit room with your face clearly visible at all times.",
    "Do not use mobile phones, smart watches, earphones, books, notes, or any other electronic devices during the exam.",
    "Do not change browser tabs, minimize the exam window, or attempt to navigate away from the test screen.",
    "Multiple faces, background noise, or suspicious movements may be flagged by the proctoring system.",
    "Any attempt to cheat or violate exam rules may result in automatic disqualification.",
    "Ensure a stable internet connection and sufficient battery backup before starting the exam."
  ]
};


export const examData = {
  examName: "AFCAT Test Series 2023 I",
  subject: "Reasoning",
  duration: "03:00:00",
  totalQuestions: 10,

  questions: [
    {
      id: 1,
      text:
        "For some people patriotism __________________ as much as to any one country.",
      options: [
        "is not confined",
        "confines not",
        "has not confined",
        "was not confined"
      ],
      correctAnswer: 1, // index based
      selectedOption: null,
      status: "notVisited" // notVisited | visited | answered | review
    },
    {
      id: 2,
      text:
        "Choose the word which is most nearly the same in meaning as the word 'BRIEF'.",
      options: [
        "Short",
        "Lengthy",
        "Detailed",
        "Extended"
      ],
      correctAnswer: 0,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 3,
      text:
        "Find the odd one out.",
      options: [
        "Apple",
        "Banana",
        "Mango",
        "Carrot"
      ],
      correctAnswer: 3,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 4,
      text:
        "If A = 1, B = 2, then what is the value of Z?",
      options: [
        "24",
        "25",
        "26",
        "27"
      ],
      correctAnswer: 2,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 5,
      text:
        "Choose the correct antonym of the word 'GENERATE'.",
      options: [
        "Create",
        "Produce",
        "Destroy",
        "Form"
      ],
      correctAnswer: 2,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 6,
      text:
        "Complete the analogy: Pen : Write :: Knife : ?",
      options: [
        "Cut",
        "Sharp",
        "Steel",
        "Weapon"
      ],
      correctAnswer: 0,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 7,
      text:
        "Find the missing number in the series: 2, 6, 12, 20, ?",
      options: [
        "28",
        "30",
        "32",
        "34"
      ],
      correctAnswer: 0,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 8,
      text:
        "Choose the correctly spelled word.",
      options: [
        "Accomodate",
        "Acommodate",
        "Accommodate",
        "Acomodate"
      ],
      correctAnswer: 2,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 9,
      text:
        "If today is Monday, what day will it be after 61 days?",
      options: [
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      correctAnswer: 3,
      selectedOption: null,
      status: "notVisited"
    },
    {
      id: 10,
      text:
        "Choose the word opposite in meaning to 'OPTIMISTIC'.",
      options: [
        "Hopeful",
        "Positive",
        "Confident",
        "Pessimistic"
      ],
      correctAnswer: 3,
      selectedOption: null,
      status: "notVisited"
    }
  ]
};


export const CandidateAttempt = [
  {
    "attemptId": "ATT_1002",
    "candidateId": "CAND_21",
    "candidateName": "Priya Sharma",
    "examId": "EXAM_101",
    "examName": "AFCAT Test Series 2023 I",
    "startedAt": "2026-02-05T10:00:00Z",
    "remainingTime": 9030,
    "responses": [
      { "questionId": 1, "selectedOption": 1, "status": "answered" },
      { "questionId": 2, "selectedOption": 3, "status": "answered" }
    ],
    "score": null,
    "trustScore": 92,
    "riskLevel": "LOW",
    "violations": [],
    "systemEvents": {
      "tabSwitchCount": 0,
      "faceNotDetected": 0,
      "multipleFacesDetected": 0
    }
  },
  {
    "attemptId": "ATT_1003",
    "candidateId": "CAND_34",
    "candidateName": "Aman Gupta",
    "examId": "EXAM_101",
    "examName": "AFCAT Test Series 2023 I",
    "startedAt": "2026-02-05T10:00:00Z",
    "remainingTime": 7812,
    "responses": [
      { "questionId": 1, "selectedOption": 2, "status": "answered" },
      { "questionId": 2, "selectedOption": null, "status": "review" }
    ],
    "score": null,
    "trustScore": 48,
    "riskLevel": "HIGH",
    "violations": [
      {
        "type": "Multiple Faces Detected",
        "timestamp": "2026-02-05T10:18:44Z",
        "severity": "CRITICAL"
      }
    ],
    "systemEvents": {
      "tabSwitchCount": 4,
      "faceNotDetected": 2,
      "multipleFacesDetected": 1
    }
  }
]
