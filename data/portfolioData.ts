export interface Skill {
  name: string;
  category: 'Programming' | 'AI & Data Science' | 'Web' | 'Database' | 'Tools';
  level: number; // 0 - 100
  icon: string;
  description: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'AI / ML' | 'Data Science' | 'Analytics' | 'Web App';
  description: string;
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured?: boolean;
  metrics: string;
  image: string;
  demoComponent?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: 'Internship' | 'Full-time' | 'Research';
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
  description: string;
  highlights: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  icon: string;
  badgeText: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl: string;
  badge: string;
  skills: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Om Santosh Wakchaure",
    shortName: "Om Wakchaure",
    titles: [
      "AI & Data Science Engineer",
      "Machine Learning Enthusiast",
      "Data Analyst", "Software Developer"
    ],
    bio: "Passionate AI & Data Science Engineering student with expertise in Machine Learning, Deep Neural Networks, Automated Data Analytics, and Fullstack Web Development. Dedicated to building intelligent systems that transform complex data into actionable business insights.",
    location: "India (Available for Global & Remote Roles)",
    email: "omswakchaure1@gmail.com",
    phone: "+91 87999 47703",
    github: "https://github.com/OmWakchaure9",
    linkedin: "https://www.linkedin.com/in/om-wakchaure-247213370?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://instagram.com/om_wakchaure_09",
    whatsapp: "https://wa.me/qr/I7N6BYJAOPOQK1",
    resumeUrl: "#resume",
    resumeFileName: "",
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    availableForHire: true,
  },

  stats: [
    { label: "Projects Completed", value: 15, suffix: "+", icon: "FolderCheck" },
    { label: "Technical Skills", value: 24, suffix: "+", icon: "Cpu" },
    { label: "Certifications", value: 8, suffix: "+", icon: "Award" },
    { label: "GitHub Contributions", value: 450, suffix: "+", icon: "GitCommit" },
  ],

  aboutTimeline: [
    {
      title: "Diploma in Computer Engineering",
      period: "Foundational Engineering",
      description: "Built strong foundations in Computer Science principles, Data Structures, C/Java programming, DBMS, and core web technologies.",
      icon: "GraduationCap"
    },
    {
      title: "BE in Artificial Intelligence & Data Science",
      period: "Advanced Degree",
      description: "Specializing in Machine Learning models, Deep Learning architectures, Neural Networks, Statistical Data Analysis, and Big Data processing.",
      icon: "Brain"
    },
    {
      title: "Passion for Artificial Intelligence & ML",
      period: "Core Focus",
      description: "Fascinated by Generative AI, LLMs, Computer Vision, and Automated Machine Learning (AutoML) algorithms that solve real-world industry challenges.",
      icon: "Sparkles"
    },
    {
      title: "Data Analytics & Business Intelligence",
      period: "Analytical Expertise",
      description: "Proficient in dataset cleaning, exploratory data analysis (EDA), predictive modeling, and building interactive Power BI & Tableau dashboards.",
      icon: "BarChart3"
    },
    {
      title: "Fullstack Web & Prototyping",
      period: "Product Delivery",
      description: "Bridging ML backends with responsive React, Next.js, and Streamlit frontends to deliver sleek, accessible user applications.",
      icon: "Globe"
    },
    {
      title: "Innovation & Problem Solving",
      period: "Engineering Mindset",
      description: "Driven by hackathons, top performer achievements, technical research, and continuous learning in modern AI engineering.",
      icon: "Zap"
    }
  ],

  skills: [
    // Programming
    { name: "Python", category: "Programming", level: 95, icon: "Code", description: "Primary language for ML, PyTorch, Pandas, Scikit-learn, and FastAPI microservices.", tags: ["Python 3.12", "NumPy", "Pandas", "Scikit-Learn"] },
    { name: "Java", category: "Programming", level: 88, icon: "Coffee", description: "Object-oriented programming, data structures, algorithms, and backend enterprise software.", tags: ["OOP", "Data Structures", "Algorithms"] },
    { name: "C", category: "Programming", level: 85, icon: "Binary", description: "Core low-level programming, memory management, pointers, and computational logic.", tags: ["Pointers", "Memory", "Core CS"] },
    { name: "SQL", category: "Programming", level: 92, icon: "Database", description: "Complex analytical queries, relational schemas, aggregation functions, joins, and indexing.", tags: ["PostgreSQL", "MySQL", "Queries"] },

    // AI & Data Science
    { name: "Machine Learning", category: "AI & Data Science", level: 94, icon: "Brain", description: "Supervised & Unsupervised learning, Regression, Classification, XGBoost, Random Forest.", tags: ["Supervised", "Unsupervised", "XGBoost", "Clustering"] },
    { name: "Deep Learning", category: "AI & Data Science", level: 90, icon: "Network", description: "Convolutional Neural Networks (CNNs), Artificial Neural Networks (ANNs), PyTorch & TensorFlow.", tags: ["CNN", "ANN", "PyTorch", "TensorFlow"] },
    { name: "Data Analysis", category: "AI & Data Science", level: 95, icon: "BarChart3", description: "Exploratory Data Analysis (EDA), anomaly detection, feature engineering, and statistical testing.", tags: ["EDA", "Feature Engineering", "Insights"] },
    { name: "Data Visualization", category: "AI & Data Science", level: 92, icon: "PieChart", description: "Transforming raw data into clear charts, heatmaps, interactive widgets, and dashboards.", tags: ["Matplotlib", "Seaborn", "Plotly"] },
    { name: "Statistics", category: "AI & Data Science", level: 88, icon: "Sliders", description: "Probability distributions, hypothesis testing, correlation matrix, regression analytics.", tags: ["Hypothesis Testing", "Correlation", "Distribution"] },
    { name: "Pandas", category: "AI & Data Science", level: 96, icon: "Table", description: "High-performance vector operations, DataFrame transformations, dataset cleaning.", tags: ["DataFrames", "Data Cleansing", "Imputation"] },
    { name: "NumPy", category: "AI & Data Science", level: 94, icon: "Cpu", description: "Multi-dimensional array matrix math, vectorization, numerical calculations.", tags: ["Matrix Ops", "Vectorization", "Arrays"] },
    { name: "Scikit-learn", category: "AI & Data Science", level: 93, icon: "Sparkles", description: "Preprocessing pipelines, model validation, cross-validation, hyperparameter tuning.", tags: ["GridSearchCV", "Pipeline", "Metrics"] },

    // Web
    { name: "HTML5", category: "Web", level: 95, icon: "FileCode", description: "Semantic web structuring, accessibility standards, SEO compliance.", tags: ["Semantic HTML", "SEO", "Accessibility"] },
    { name: "CSS3", category: "Web", level: 92, icon: "Layout", description: "Glassmorphism, animations, responsive design, Flexbox, Grid, CSS Variables.", tags: ["Glassmorphism", "Flexbox", "Animations"] },
    { name: "JavaScript", category: "Web", level: 90, icon: "Zap", description: "Modern ES6+, async/await, DOM manipulation, interactive UI logic.", tags: ["ES6+", "Async", "DOM"] },
    { name: "React", category: "Web", level: 92, icon: "Atom", description: "Component-based architecture, hooks, state management, interactive web interfaces.", tags: ["Hooks", "JSX", "State"] },
    { name: "Streamlit", category: "Web", level: 94, icon: "Globe", description: "Rapid prototyping and deployment of Python Data Science & ML Web Applications.", tags: ["Python Web", "Interactive Dashboards"] },

    // Database
    { name: "MySQL", category: "Database", level: 90, icon: "Database", description: "Relational database management, schema design, optimized indexes, complex JOIN queries.", tags: ["Relational DB", "Indexing", "Schemas"] },

    // Tools
    { name: "Git", category: "Tools", level: 92, icon: "GitBranch", description: "Version control system, branching strategies, commit history, merge conflict resolution.", tags: ["Version Control", "CLI"] },
    { name: "GitHub", category: "Tools", level: 94, icon: "GitCommit", description: "Repository management, open-source contribution, CI/CD actions, release management.", tags: ["Repositories", "CI/CD"] },
    { name: "VS Code", category: "Tools", level: 96, icon: "Code", description: "Primary IDE configured with AI debugging, Python extensions, and TypeScript tooling.", tags: ["IDE", "Extensions"] },
    { name: "Jupyter Notebook", category: "Tools", level: 95, icon: "BookOpen", description: "Interactive environment for EDA, statistical prototyping, ML training, and documentation.", tags: ["EDA", "Python Kernel"] },
    { name: "Tableau", category: "Tools", level: 88, icon: "BarChart3", description: "Interactive business intelligence dashboards, field calculations, visual storytelling.", tags: ["Dashboards", "BI"] },
    { name: "Power BI", category: "Tools", level: 90, icon: "PieChart", description: "DAX formulas, data modeling, executive sales & analytics dashboard creation.", tags: ["DAX", "Data Modeling", "Reports"] },
  ] as Skill[],

  projects: [
    {
      id: "ai-data-vis-assistant",
      title: "AI Data Visualization Assistant",
      tagline: "Automated Data Cleansing, EDA & Gemini AI Chart Recommendation Engine",
      category: "AI / ML",
      description: "AutoViz AI Assistant is a next-generation automated data intelligence platform. Users can upload any CSV dataset or select a sample to perform automated data cleaning, missing value imputation, EDA summary statistics, dynamic Power BI style chart generation, and Gemini AI narrative insights.",
      problem: "Data scientists and analysts waste up to 70% of their time performing repetitive data cleaning, initial visualization setup, and drafting executive summaries.",
      solution: "Engineered an automated analytical pipeline that cleans raw datasets in real-time, generates dynamic multi-chart dashboards based on column cardinality, and derives automated AI text summaries.",
      features: [
        "Instant CSV Parsing & Automatic Type Inference",
        "Automated Missing Value Imputation & Dataset Cleansing",
        "Dynamic Power BI Style Interactive Charts (Bar, Line, Pie, Scatter)",
        "Gemini AI Natural Language Executive Report Generation",
        "One-Click Analytical Insight Highlights & Summary Metrics"
      ],
      technologies: ["Python", "Pandas", "React / Next.js", "Chart.js / Recharts", "Gemini AI API", "Tailwind CSS"],
      liveUrl: "#autoviz-demo",
      githubUrl: "https://github.com/OmWakchaure9",
      isFeatured: true,
      metrics: "Sub-second EDA & automated chart generation",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      demoComponent: "AutoVizDemo"
    },
    {
      id: "plant-disease-detection",
      title: "Plant Disease Detection using AI",
      tagline: "CNN Deep Learning Agricultural Crop Diagnostic System",
      category: "AI / ML",
      description: "Deep Convolutional Neural Network (CNN) architecture trained on thousands of plant leaf images across 38 disease categories with real-time inference, leaf image upload, and actionable treatment recommendations.",
      problem: "Crop yield loss due to undetected agricultural diseases damages agricultural output due to lack of immediate expert diagnostic access in the field.",
      solution: "Developed a lightweight MobileNet / ResNet CNN model pipeline capable of classifying leaf pathologies in under 100ms with high diagnostic accuracy.",
      features: [
        "Multi-Crop Pathological Leaf Classification (38 Classes)",
        "Instant Image Upload & AI Confidence Score Calibration",
        "Visual Attention & Pathology Highlight Indicators",
        "Actionable Treatment & Fertilizer Dosage Recommendations"
      ],
      technologies: ["Python", "TensorFlow / PyTorch", "OpenCV", "MobileNetV3", "Streamlit", "React"],
      liveUrl: "#project-modal",
      githubUrl: "https://github.com/OmWakchaure9",
      isFeatured: true,
      metrics: "98.5% Validation Accuracy | <100ms Inference",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "smart-analytics-dashboard",
      title: "Smart Analytics Dashboard",
      tagline: "Real-Time Executive KPI & Power BI Style Revenue Intelligence",
      category: "Analytics",
      description: "Interactive executive analytics dashboard built for high-frequency tracking of key performance indicators, sales channels, customer lifetime value, and automated anomaly detection.",
      problem: "Business stakeholders lacked real-time visibility into cross-channel metric shifts and regional sales decay signals.",
      solution: "Engineered an end-to-end data pipeline streaming SQL warehouse transactions into interactive glassmorphic visual widgets with DAX-style drill-downs.",
      features: [
        "Interactive KPI Cards with Dynamic Trend Indicators",
        "Cohort Retention Matrix & Churn Probability Calculator",
        "Geographic Heatmap Revenue Breakdown",
        "Automated Data Export & Executive Summary Widgets"
      ],
      technologies: ["Power BI", "SQL / MySQL", "Python", "Pandas", "Next.js", "Tailwind CSS"],
      liveUrl: "#project-modal",
      githubUrl: "https://github.com/OmWakchaure9",
      isFeatured: true,
      metrics: "Real-time query rendering on 500k+ records",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "ai-chatbot",
      title: "Context-Aware AI Chatbot",
      tagline: "RAG Powered Conversational Assistant with Vector Citation Search",
      category: "AI / ML",
      description: "Generative AI conversational assistant built with Retrieval-Augmented Generation (RAG), vector embeddings database retrieval, and contextual memory buffer.",
      problem: "Standard generic LLM models lack domain-specific document awareness and frequently hallucinate missing facts.",
      solution: "Integrated document vector embeddings with RAG semantic search to allow precise question answering with exact source citations.",
      features: [
        "Semantic Vector Search & Context Retrieval",
        "Multi-Turn Conversational Memory Buffer",
        "Source Citation Highlighting & Page References",
        "Streaming Response Interface with Glassmorphic UI"
      ],
      technologies: ["Python", "LangChain", "Qdrant Vector DB", "Llama / OpenAI API", "React", "TypeScript"],
      liveUrl: "#project-modal",
      githubUrl: "https://github.com/OmWakchaure9",
      isFeatured: true,
      metrics: "< 1% Hallucination Rate | Sub-2s Response",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "data-analysis-dashboard",
      title: "Data Analysis & Cleansing Dashboard",
      tagline: "Exploratory Data Analysis & Outlier Detection Workbench",
      category: "Data Science",
      description: "Comprehensive data science analysis workbench designed for automated dataset profiling, correlation matrices, outlier detection, and distribution fitting.",
      problem: "Manually coding Seaborn plots and summary statistics for new datasets is tedious and error-prone.",
      solution: "Created an automated Streamlit & web platform that parses raw CSV files, computes skewness/kurtosis, generates heatmaps, and suggests data transformations.",
      features: [
        "Correlation Heatmap & Pairwise Feature Profiling",
        "Boxplot & Interquartile Range Outlier Filtering",
        "Missing Value Heatmap & Smart Imputation",
        "Statistical Summary Table & Parquet Export"
      ],
      technologies: ["Python", "Pandas", "NumPy", "Seaborn", "Streamlit", "Plotly"],
      liveUrl: "#project-modal",
      githubUrl: "https://github.com/OmWakchaure9",
      metrics: "Instant profiling of multi-MB CSV datasets",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: "automl-business-insights",
      title: "AutoML Business Insight Generator",
      tagline: "Automated Machine Learning Model Selection & SHAP Explainability",
      category: "Data Science",
      description: "No-code automated machine learning engine that automatically benchmarks Scikit-learn algorithms, tunes hyperparameters, evaluates cross-validation, and provides SHAP feature explainability.",
      problem: "Non-technical domain experts struggle to choose optimal ML algorithms and interpret black-box feature weightings.",
      solution: "Built a pipeline that trains XGBoost, Random Forest, and LightGBM models in parallel, selecting the champion model and outputting SHAP explainability charts.",
      features: [
        "Parallel Multi-Algorithm Model Training",
        "Automated Hyperparameter Tuning via Optuna / GridSearchCV",
        "SHAP Feature Importance & Waterfall Visualizations",
        "One-Click Scikit-Learn Model Object Export (.pkl)"
      ],
      technologies: ["Python", "Scikit-Learn", "XGBoost", "SHAP", "Streamlit", "React"],
      liveUrl: "#project-modal",
      githubUrl: "https://github.com/OmWakchaure9",
      metrics: "0.95+ ROC-AUC on benchmark datasets",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
    }
  ] as Project[],

  experience: [
    {
      id: "exp-1",
      role: "Data Analytics Intern",
      company: "Tech Innovation & Data Analytics Corp",
      period: "Internship Period",
      location: "Hybrid",
      type: "Internship",
      description: "Worked directly on dataset cleaning, exploratory data analysis, predictive modeling, and executive Power BI dashboard development.",
      achievements: [
        "Cleaned, transformed, and structured 100,000+ raw transactional records using Python Pandas and SQL.",
        "Recognized as a Top Performer Intern for exceptional accuracy in building interactive revenue dashboards.",
        "Collaborated with cross-functional teams to streamline data reporting and anomaly detection pipelines."
      ],
      technologies: ["Python", "Pandas", "SQL", "MySQL", "Power BI", "Tableau", "Git"]
    },
    {
      id: "exp-2",
      role: "AI & ML Technical Lead Project Fellow",
      company: "Engineering Capstone & AI Lab",
      period: "Academic Tenure",
      location: "Department of AI & DS",
      type: "Research",
      description: "Led team collaboration on deep learning models, computer vision image classification, and automated data visualization tools.",
      achievements: [
        "Architected Plant Disease Detection CNN model with 98.5% validation diagnostic accuracy.",
        "Built AutoViz AI assistant prototyping engine using Python, Gemini API, and React frontend.",
        "Secured top place in national technical hackathon and AI project competition."
      ],
      technologies: ["TensorFlow", "PyTorch", "Python", "Streamlit", "React", "OpenCV"]
    }
  ] as ExperienceItem[],

  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Engineering in Artificial Intelligence & Data Science",
      institution: "State University of Technology",
      year: "Pursuing",
      grade: "First Class with Distinction",
      description: "Specialized focus on Machine Learning algorithms, Deep Learning, Statistical Computing, Data Warehousing, Natural Language Processing, and Big Data Analytics.",
      highlights: [
        "Top Academic Performer in AI & Data Science coursework",
        "Lead Coordinator for Technical Events & AI Hackathons",
        "Published capstone research on automated computer vision & EDA tools"
      ]
    },
    {
      id: "edu-2",
      degree: "Diploma in Computer Engineering",
      institution: "Polytechnic Institute of Engineering",
      year: "Completed",
      grade: "First Class Distinction",
      description: "Solid foundational grounding in C/Java programming, Data Structures & Algorithms, Object-Oriented Software Design, Database Systems, and Web Engineering.",
      highlights: [
        "Strong foundation in core Computer Science fundamentals",
        "Developed custom database systems and Java desktop applications",
        "Active member of Technical Computer Society"
      ]
    }
  ] as EducationItem[],

  achievements: [
    {
      id: "ach-1",
      title: "Top Performer Intern Award",
      category: "Professional Achievement",
      date: "Data Analytics Internship",
      description: "Awarded Top Performer for outstanding contribution to dataset cleaning, DAX data modeling, and executive Power BI dashboard creation.",
      icon: "Award",
      badgeText: "Top Performer"
    },
    {
      id: "ach-2",
      title: "National Technical Hackathon Winner",
      category: "Hackathon & Competition",
      date: "AI & Data Challenge",
      description: "First place winner for developing an AI-driven agricultural pathology detection system using MobileNet CNN edge inference.",
      icon: "Trophy",
      badgeText: "1st Place Winner"
    },
    {
      id: "ach-3",
      title: "Technical Event Lead & Organizer",
      category: "Leadership & Events",
      date: "Department of AI & DS",
      description: "Organized and hosted university-wide technical workshops, coding bootcamps, and hackathons for 300+ engineering students.",
      icon: "Users",
      badgeText: "Event Lead"
    },
    {
      id: "ach-4",
      title: "AI & ML Workshop Specialist",
      category: "Workshops",
      date: "Hands-on Seminars",
      description: "Successfully conducted hands-on training sessions on Python for Data Science, Scikit-learn pipelines, and Streamlit web apps.",
      icon: "BookOpen",
      badgeText: "Speaker & Mentor"
    }
  ] as AchievementItem[],

  certificates: [
    {
      id: "cert-1",
      title: "Data Analytics Internship Completion Certificate",
      issuer: "Data Science Industry Partner",
      date: "Recent",
      credentialId: "CERT-DA-89201",
      verifyUrl: "https://example.com/verify",
      badge: "Internship Certificate",
      skills: ["Dataset Cleaning", "SQL Queries", "Power BI", "EDA", "Dashboarding"],
      image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-2",
      title: "Machine Learning Specialization",
      issuer: "DeepLearning.AI / Coursera",
      date: "Recent",
      credentialId: "CERT-ML-44120",
      verifyUrl: "https://coursera.org/verify",
      badge: "DeepLearning.AI",
      skills: ["Supervised ML", "Logistic Regression", "Neural Networks", "Gradient Descent"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-3",
      title: "Python for Data Science & AI",
      issuer: "IBM / Cognitive Class",
      date: "Recent",
      credentialId: "CERT-PY-77123",
      verifyUrl: "https://example.com/verify",
      badge: "IBM Professional",
      skills: ["Python 3", "Pandas", "NumPy", "Matplotlib", "Web Scraping"],
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-4",
      title: "SQL & Relational Database Engineering",
      issuer: "Oracle / MySQL Academy",
      date: "Recent",
      credentialId: "CERT-SQL-33104",
      verifyUrl: "https://example.com/verify",
      badge: "Database Specialist",
      skills: ["MySQL", "Joins", "Subqueries", "Relational Design", "Indexing"],
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop"
    }
  ] as Certificate[],

  testimonials: [
    {
      id: "test-1",
      quote: "Om is an exceptionally talented AI & Data Science student. His analytical problem-solving skills and ability to turn raw datasets into interactive, actionable dashboards are truly top tier.",
      author: "Dr. A. R. Sharma",
      title: "Head of Department (AI & DS)",
      company: "University Engineering College",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "test-2",
      quote: "During his Data Analytics internship, Om demonstrated outstanding dedication. He was recognized as a Top Performer for his exceptional SQL queries and Power BI dashboard designs.",
      author: "Rajesh Kulkarni",
      title: "Senior Data Engineering Manager",
      company: "Tech Innovation Corp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    }
  ] as Testimonial[],

  githubStats: {
    username: "OmWakchaure9",
    publicRepos: 18,
    followers: 124,
    stars: 85,
    contributionsThisYear: 482,
    topLanguages: [
      { name: "Python", percentage: 58, color: "#3572A5" },
      { name: "TypeScript / React", percentage: 22, color: "#3178C6" },
      { name: "SQL", percentage: 12, color: "#e38c00" },
      { name: "Java / C", percentage: 8, color: "#b07219" }
    ]
  }
};
