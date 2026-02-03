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
    // ... (You can add the rest of the 15 questions here following this pattern)
    { text: "Final Gut Feeling?", weight: 1.5, options: [
        { text: "Easy A", value: 10 }, { text: "Passable", value: 7 }, { text: "Risky", value: 4 }, { text: "Failed", value: 1 }
    ]}
];
