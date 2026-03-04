export const liveCandidates = [
  {
    id: 45,
    name: "John Doe",
    trustScore: 40,
    risk: "HIGH",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Emma K.",
    trustScore: 45,
    risk: "HIGH",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "David P.",
    trustScore: 92,
    risk: "LOW",
    image: "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    id: 4,
    name: "Priya S.",
    trustScore: 76,
    risk: "MEDIUM",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];


export const candidates = [
  {
    "id": 1,
    "name": "John Doe",
    "image": "https://i.pravatar.cc/150?img=1",
    "exam": "Math Test",
    "risk": "HIGH",
    "violations": "Multiple Faces, No Face Detected",
    "trust": 40
  },
  {
    "id": 2,
    "name": "Emma K.",
    "image": "https://i.pravatar.cc/150?img=2",
    "exam": "CS Exam",
    "risk": "HIGH",
    "violations": "Phone Usage",
    "trust": 45
  },
  {
    "id": 3,
    "name": "David P.",
    "image": "https://i.pravatar.cc/150?img=3",
    "exam": "Final Assessment",
    "risk": "LOW",
    "violations": "None",
    "trust": 92
  },
  {
    "id": 4,
    "name": "Priya S.",
    "image": "https://i.pravatar.cc/150?img=4",
    "exam": "Physics Quiz",
    "risk": "MEDIUM",
    "violations": "Audio Anomaly",
    "trust": 70
  },
  {
    "id": 5,
    "name": "Mark S.",
    "image": "https://i.pravatar.cc/150?img=5",
    "exam": "CS Exam",
    "risk": "MEDIUM",
    "violations": "Tab Switching",
    "trust": 68
  },
  {
    "id": 6,
    "name": "Maria L.",
    "image": "https://i.pravatar.cc/150?img=6",
    "exam": "English Test",
    "risk": "HIGH",
    "violations": "Multiple Faces, Phone Usage",
    "trust": 38
  },
  {
    "id": 7,
    "name": "Kevin M.",
    "image": "https://i.pravatar.cc/150?img=7",
    "exam": "Math Test",
    "risk": "LOW",
    "violations": "None",
    "trust": 89
  },
  {
    "id": 8,
    "name": "Alejandro S.",
    "image": "https://i.pravatar.cc/150?img=8",
    "exam": "Final Assessment",
    "risk": "LOW",
    "violations": "None",
    "trust": 94
  },
  {
    "id": 9,
    "name": "Nina R.",
    "image": "https://i.pravatar.cc/150?img=9",
    "exam": "Biology Test",
    "risk": "MEDIUM",
    "violations": "Background Noise",
    "trust": 72
  },
  {
    "id": 10,
    "name": "Rahul V.",
    "image": "https://i.pravatar.cc/150?img=10",
    "exam": "Chemistry Exam",
    "risk": "HIGH",
    "violations": "Face Not Centered",
    "trust": 42
  }
]


export const examAttempts = [
  {
    id: 1,
    studentName: "John Doe",
    examName: "AFCAT Test Series 2023 I",
    subject: "Reasoning",
    submittedAt: "2026-02-01 10:45 AM",
    timeTaken: "02:45:12",
    score: 72,
    trustScore: 40,
    risk: "HIGH",
    status: "Submitted"
  },
  {
    id: 2,
    studentName: "Emma K.",
    examName: "CS Mock Test",
    subject: "Computer Science",
    submittedAt: "2026-02-01 11:20 AM",
    timeTaken: "02:30:05",
    score: 81,
    trustScore: 55,
    risk: "MEDIUM",
    status: "Submitted"
  },
  {
    id: 3,
    studentName: "David P.",
    examName: "Final Assessment",
    subject: "Physics",
    submittedAt: "2026-02-01 09:55 AM",
    timeTaken: "02:58:10",
    score: 93,
    trustScore: 92,
    risk: "LOW",
    status: "Submitted"
  }
];


export const allAttempts = [
  {
    id: 1,
    student: {
      name: "Rahul Sharma",
      email: "rahul@gmail.com"
    },
    exam: {
      name: "AFCAT Test Series 2023",
      subject: "Reasoning"
    },
    attempt: {
      status: "Submitted",
      score: 72,
      violations: 4,
      recording: true,
      risk: "HIGH"
    }
  },
  {
    id: 2,
    student: {
      name: "Ananya Verma",
      email: "ananya@gmail.com"
    },
    exam: {
      name: "CS Mock Test",
      subject: "Computer Science"
    },
    attempt: {
      status: "Submitted",
      score: 88,
      violations: 1,
      recording: true,
      risk: "LOW"
    }
  },
  {
    id: 3,
    student: {
      name: "Amit Das",
      email: "amit@gmail.com"
    },
    exam: {
      name: "Physics Final",
      subject: "Physics"
    },
    attempt: {
      status: "In Progress",
      score: "--",
      violations: 2,
      recording: false,
      risk: "MEDIUM"
    }
  }
];
