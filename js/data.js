// Departments List
export const departments = [
    "Computer Science (CSE)",
    "Information Technology (IT)",
    "Electronics & Comm (ECE)",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering (EEE)",
    "Artificial Intelligence (AI&DS)",
    "Biotechnology",
    "Business Administration (MBA)"
];

// Country Codes
export const countryCodes = [
    { code: "+1", flag: "🇺🇸", country: "USA" },
    { code: "+44", flag: "🇬🇧", country: "UK" },
    { code: "+91", flag: "🇮🇳", country: "IND" },
    { code: "+81", flag: "🇯🇵", country: "JPN" },
    { code: "+49", flag: "🇩🇪", country: "GER" },
    { code: "+33", flag: "🇫🇷", country: "FRA" },
    { code: "+86", flag: "🇨🇳", country: "CHN" },
    { code: "+971", flag: "🇦🇪", country: "UAE" }
];

// Exam Questions (Existing)
export const questions = [
    { text: "Did you attend >85% of lectures?", weight: 1.0, options: [
        { text: "Yes, consistent", value: 10 }, { text: "Missed some", value: 7 }, { text: "Rarely", value: 3 }, { text: "Never", value: 1 }
    ]},
    { text: "How many past papers did you solve?", weight: 1.8, options: [
        { text: "3+ Years", value: 10 }, { text: "1-2 Years", value: 8 }, { text: "Glanced only", value: 5 }, { text: "None", value: 1 }
    ]},
    { text: "Did you cover high-weightage chapters?", weight: 2.0, options: [
        { text: "100% Mastery", value: 10 }, { text: "Most of them", value: 7 }, { text: "Only basics", value: 4 }, { text: "No strategy", value: 2 }
    ]},
    { text: "Sleep quality before exam?", weight: 1.2, options: [
        { text: "8 Hours", value: 10 }, { text: "6 Hours", value: 7 }, { text: "4 Hours", value: 4 }, { text: "All-nighter", value: 2 }
    ]},
    { text: "Anxiety level during paper?", weight: 1.3, options: [
        { text: "Zero / Flow State", value: 10 }, { text: "Manageable", value: 8 }, { text: "Panicked", value: 5 }, { text: "Frozen", value: 1 }
    ]},
    { text: "Handwriting & Presentation?", weight: 1.0, options: [
        { text: "Excellent", value: 10 }, { text: "Readable", value: 8 }, { text: "Messy", value: 5 }, { text: "Illegible", value: 2 }
    ]},
    { text: "Did you finish on time?", weight: 1.8, options: [
        { text: "Yes, with review", value: 10 }, { text: "Just in time", value: 8 }, { text: "Missed a bit", value: 5 }, { text: "Left huge chunk", value: 1 }
    ]},
    { text: "Evaluator Strictness (Predicted)?", weight: 1.0, options: [
        { text: "Lenient", value: 10 }, { text: "Fair", value: 7 }, { text: "Strict", value: 4 }, { text: "Unknown", value: 5 }
    ]},
    { text: "Final Gut Feeling?", weight: 1.5, options: [
        { text: "Easy A", value: 10 }, { text: "Passable", value: 7 }, { text: "Risky", value: 4 }, { text: "Failed", value: 1 }
    ]}
];
