const coursesData = [
    {
        category: 'dev',
        title: 'Web Development with MERN',
        icon: 'fa-brands fa-react',
        color: '#61dafb'
    },
    {
        category: 'dev',
        title: 'Python',
        icon: 'fa-brands fa-python',
        color: '#ffde57',
        pdfFile: 'PYTHON PROGRAMMING NOTES.pdf'
    },
    {
        category: 'dev',
        title: 'Java',
        icon: 'fa-brands fa-java',
        color: '#f89820',
        pdfFile: 'NOTES ON OOPS THROUGH JAVA.pdf'
    },
    {
        category: 'dev',
        title: 'C++',
        icon: 'fa-solid fa-code',
        color: '#00599c',
        pdfFile: 'NOTES ON OOPS USING C++.pdf'
    },
    {
        category: 'it',
        title: 'Data Science',
        icon: 'fa-solid fa-database',
        color: '#4db33d',
        pdfFile: 'DATA SCIENCE NOTES.pdf'
    },
    {
        category: 'it',
        title: 'Data Analytics',
        icon: 'fa-solid fa-chart-simple',
        color: '#f4a261',
        pdfFile: 'Digital Notes of Data Analytics.pdf'
    },
    {
        category: 'it',
        title: 'Machine Learning',
        icon: 'fa-solid fa-brain',
        color: '#e76f51',
        pdfFile: 'MACHINE LEARNING NOTES.pdf'
    },
    {
        category: 'it',
        title: 'Cyber Security',
        icon: 'fa-solid fa-shield-halved',
        color: '#06b6d4',
        pdfFile: 'CYBER SECURITY NOTES.pdf'
    },
    {
        category: 'design',
        title: 'UI/UX Designing',
        icon: 'fa-solid fa-pen-nib',
        color: '#e91e63',
        pdfFile: 'NOTES ON UI UX  DESIGN.pdf'
    },
    {
        category: 'design',
        title: 'Graphic Design',
        icon: 'fa-solid fa-bezier-curve',
        color: '#9c27b0',
        pdfFile: 'GRAPHIC DESGNING NOTES.pdf'
    }
];


/* ==========================================
   Shadowscript QUESTION BANK (100+ QUESTIONS)
   ========================================== */
const courses = [
    {
        id: "mern",
        title: "Web Development (MERN)",
        icon: "fa-brands fa-react",
        color: "#61dafb",
        questions: [
            { q: "What does 'M' stand for in MERN?", options: ["MySQL", "MongoDB", "MariaDB", "Meteor"], correct: 1 },
            { q: "Which hook is used for side effects in React?", options: ["useState", "useContext", "useEffect", "useReducer"], correct: 2 },
            { q: "Express.js is a framework for which environment?", options: ["Python", "Node.js", "Java", "Ruby"], correct: 1 },
            { q: "What is the default port for MongoDB?", options: ["3000", "8080", "27017", "5000"], correct: 2 },
            { q: "In React, how do you pass data to child components?", options: ["State", "Props", "Refs", "Context"], correct: 1 },
            // ... Add 15 more questions for MERN
        ]
    },
    {
        id: "python",
        title: "Python Programming",
        icon: "fa-brands fa-python",
        color: "#ffde57",
        questions: [
            { q: "Which keyword is used to define a function?", options: ["func", "def", "function", "define"], correct: 1 },
            { q: "What is the correct file extension for Python files?", options: [".pt", ".pyt", ".py", ".pw"], correct: 2 },
            { q: "Which data type is immutable?", options: ["List", "Dictionary", "Tuple", "Set"], correct: 2 },
            { q: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], correct: 2 },
            { q: "Which library is used for Data Analysis?", options: ["Pandas", "Django", "Flask", "PyQt"], correct: 0 },
             // ... Add 15 more questions for Python
        ]
    },
    {
        id: "ds",
        title: "Data Science",
        icon: "fa-solid fa-database",
        color: "#4db33d",
        questions: [
            { q: "Which of the following is a supervised learning algorithm?", options: ["K-Means", "PCA", "Linear Regression", "Apriori"], correct: 2 },
            { q: "What does 'EDA' stand for?", options: ["Early Data Analysis", "Exploratory Data Analysis", "External Data Array", "Extended Data Access"], correct: 1 },
            { q: "Which language is most popular in Data Science?", options: ["C++", "Python", "Swift", "PHP"], correct: 1 },
            // ... Add 20 more questions for Data Science
        ]
    }
    // Repeat this pattern for Java, C++, UI/UX, Graphic Design, etc.
];

// Helper to get all questions into one giant practice pool
const allQuestionsPool = courses.flatMap(course => 
    course.questions.map(q => ({ ...q, subject: course.title }))
);
