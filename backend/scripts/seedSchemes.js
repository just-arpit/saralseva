import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from '../src/models/Scheme.js';

dotenv.config();

const sampleSchemes = [
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "Direct income support scheme for farmers with landholding up to 2 hectares",
    shortDescription: "₹6,000 per year in 3 installments for small and marginal farmers",
    category: "agriculture",
    subcategory: "income-support",
    level: "central",
    department: {
      name: "Ministry of Agriculture and Farmers Welfare",
      ministry: "Ministry of Agriculture and Farmers Welfare",
      website: "https://pmkisan.gov.in",
      contactEmail: "support@pmkisan.gov.in",
      contactPhone: "1800-180-1551"
    },
    eligibility: {
      ageRange: { min: 18, max: 100 },
      incomeRange: { min: 0, max: 200000 },
      category: ["general", "obc", "sc", "st"],
      states: ["all"],
      occupations: ["farmer", "agricultural-laborer"],
      education: ["below-10th", "10th", "12th", "graduate", "post-graduate"],
      isForWomen: false,
      isForDisabled: false,
      isForSeniorCitizen: false,
      isForMinority: false
    },
    benefits: {
      type: "financial",
      amount: { min: 6000, max: 6000, currency: "INR" },
      description: "₹6,000 per year in 3 equal installments of ₹2,000 each",
      isRecurring: true,
      frequency: "yearly"
    },
    applicationProcess: {
      isOnline: true,
      isOffline: true,
      onlineUrl: "https://pmkisan.gov.in",
      steps: [
        {
          stepNumber: 1,
          title: "Registration",
          description: "Register on PM-KISAN portal with Aadhaar number",
          estimatedTime: "5 minutes"
        },
        {
          stepNumber: 2,
          title: "Land Records Verification",
          description: "Verify land records with revenue department",
          estimatedTime: "1-2 days"
        },
        {
          stepNumber: 3,
          title: "Bank Account Linking",
          description: "Link bank account for direct benefit transfer",
          estimatedTime: "1 day"
        }
      ],
      processingTime: "15-30 days",
      applicationFee: { amount: 0, waived: true }
    },
    requiredDocuments: [
      { name: "Aadhaar Card", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Land Records", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 10 },
      { name: "Bank Account Details", isMandatory: true, acceptedFormats: ["pdf"], maxSize: 5 },
      { name: "Mobile Number", isMandatory: true }
    ],
    dates: {
      launchDate: new Date("2019-02-01"),
      isAlwaysOpen: true
    },
    status: "active",
    translations: {
      hindi: {
        name: "प्रधानमंत्री किसान सम्मान निधि",
        description: "2 हेक्टेयर तक की जमीन वाले किसानों के लिए प्रत्यक्ष आय सहायता योजना",
        shortDescription: "छोटे और सीमांत किसानों के लिए सालाना ₹6,000 तीन किस्तों में"
      }
    },
    keywords: ["pm-kisan", "farmer", "agriculture", "income-support", "kisan"],
    tags: ["central", "agriculture", "financial", "direct-benefit"],
    externalLinks: {
      official: "https://pmkisan.gov.in",
      guidelines: "https://pmkisan.gov.in/guidelines",
      helpline: "1800-180-1551"
    }
  },
  {
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
    description: "World's largest health insurance scheme providing coverage of ₹5 lakh per family per year",
    shortDescription: "Health coverage of ₹5 lakh per family per year for secondary and tertiary care",
    category: "healthcare",
    subcategory: "health-insurance",
    level: "central",
    department: {
      name: "Ministry of Health and Family Welfare",
      ministry: "Ministry of Health and Family Welfare",
      website: "https://pmjay.gov.in",
      contactEmail: "support@pmjay.gov.in",
      contactPhone: "14555"
    },
    eligibility: {
      ageRange: { min: 0, max: 100 },
      incomeRange: { min: 0, max: 50000 },
      category: ["general", "obc", "sc", "st"],
      states: ["all"],
      isForWomen: false,
      isForDisabled: false,
      isForSeniorCitizen: false,
      isForMinority: false
    },
    benefits: {
      type: "insurance",
      amount: { min: 500000, max: 500000, currency: "INR" },
      description: "Health coverage of ₹5 lakh per family per year for secondary and tertiary care",
      isRecurring: true,
      frequency: "yearly"
    },
    applicationProcess: {
      isOnline: true,
      isOffline: true,
      onlineUrl: "https://pmjay.gov.in",
      steps: [
        {
          stepNumber: 1,
          title: "Eligibility Check",
          description: "Check eligibility using SECC 2011 data",
          estimatedTime: "2 minutes"
        },
        {
          stepNumber: 2,
          title: "Card Generation",
          description: "Generate Ayushman Bharat card",
          estimatedTime: "1 day"
        }
      ],
      processingTime: "1-2 days",
      applicationFee: { amount: 0, waived: true }
    },
    requiredDocuments: [
      { name: "Aadhaar Card", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Ration Card", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Income Certificate", isMandatory: false, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 }
    ],
    dates: {
      launchDate: new Date("2018-09-23"),
      isAlwaysOpen: true
    },
    status: "active",
    translations: {
      hindi: {
        name: "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना",
        description: "दुनिया की सबसे बड़ी स्वास्थ्य बीमा योजना जो प्रति परिवार प्रति वर्ष ₹5 लाख का कवरेज प्रदान करती है",
        shortDescription: "द्वितीयक और तृतीयक देखभाल के लिए प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य कवरेज"
      }
    },
    keywords: ["ayushman-bharat", "health-insurance", "healthcare", "pmjay", "medical"],
    tags: ["central", "healthcare", "insurance", "medical"],
    externalLinks: {
      official: "https://pmjay.gov.in",
      guidelines: "https://pmjay.gov.in/guidelines",
      helpline: "14555"
    }
  }
];

// Add more schemes to reach 30-50 total
const additionalSchemes = [
  {
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    description: "Housing for All by 2022 - providing affordable housing to eligible families",
    shortDescription: "Housing assistance of ₹1.2 lakh to ₹2.67 lakh based on category and location",
    category: "housing",
    level: "central",
    department: {
      name: "Ministry of Housing and Urban Affairs",
      ministry: "Ministry of Housing and Urban Affairs",
      website: "https://pmaymis.gov.in",
      contactEmail: "support@pmaymis.gov.in",
      contactPhone: "1800-11-6163"
    },
    eligibility: {
      ageRange: { min: 18, max: 100 },
      incomeRange: { min: 0, max: 300000 },
      category: ["general", "obc", "sc", "st"],
      states: ["all"],
      isForWomen: false,
      isForDisabled: false,
      isForSeniorCitizen: false,
      isForMinority: false
    },
    benefits: {
      type: "financial",
      amount: { min: 120000, max: 267000, currency: "INR" },
      description: "Housing assistance ranging from ₹1.2 lakh to ₹2.67 lakh based on category and location",
      isRecurring: false,
      frequency: "one-time"
    },
    applicationProcess: {
      isOnline: true,
      isOffline: true,
      onlineUrl: "https://pmaymis.gov.in",
      steps: [
        {
          stepNumber: 1,
          title: "Registration",
          description: "Register on PMAY portal with Aadhaar number",
          estimatedTime: "10 minutes"
        },
        {
          stepNumber: 2,
          title: "Document Upload",
          description: "Upload required documents",
          estimatedTime: "30 minutes"
        },
        {
          stepNumber: 3,
          title: "Verification",
          description: "Local authority verification",
          estimatedTime: "30-45 days"
        }
      ],
      processingTime: "60-90 days",
      applicationFee: { amount: 0, waived: true }
    },
    requiredDocuments: [
      { name: "Aadhaar Card", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Income Certificate", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Address Proof", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Bank Account Details", isMandatory: true, acceptedFormats: ["pdf"], maxSize: 5 }
    ],
    dates: {
      launchDate: new Date("2015-06-25"),
      isAlwaysOpen: true
    },
    status: "active",
    translations: {
      hindi: {
        name: "प्रधानमंत्री आवास योजना",
        description: "2022 तक सभी के लिए आवास - पात्र परिवारों को सस्ता आवास प्रदान करना",
        shortDescription: "श्रेणी और स्थान के आधार पर ₹1.2 लाख से ₹2.67 लाख तक का आवास सहायता"
      }
    },
    keywords: ["pmay", "housing", "affordable-housing", "urban", "rural"],
    tags: ["central", "housing", "financial", "urban-development"],
    externalLinks: {
      official: "https://pmaymis.gov.in",
      guidelines: "https://pmaymis.gov.in/guidelines",
      helpline: "1800-11-6163"
    }
  },
  {
    name: "Startup India",
    description: "Government initiative to promote startup culture and entrepreneurship in India",
    shortDescription: "Support for startups including tax benefits, funding, and simplified procedures",
    category: "startup",
    level: "central",
    department: {
      name: "Department for Promotion of Industry and Internal Trade",
      ministry: "Ministry of Commerce and Industry",
      website: "https://www.startupindia.gov.in",
      contactEmail: "support@startupindia.gov.in",
      contactPhone: "1800-210-0066"
    },
    eligibility: {
      ageRange: { min: 18, max: 65 },
      incomeRange: { min: 0, max: 100000000 },
      category: ["general", "obc", "sc", "st"],
      states: ["all"],
      isForWomen: false,
      isForDisabled: false,
      isForSeniorCitizen: false,
      isForMinority: false
    },
    benefits: {
      type: "financial",
      amount: { min: 0, max: 10000000, currency: "INR" },
      description: "Tax benefits, funding support, and simplified procedures for startups",
      isRecurring: false,
      frequency: "one-time"
    },
    applicationProcess: {
      isOnline: true,
      isOffline: false,
      onlineUrl: "https://www.startupindia.gov.in",
      steps: [
        {
          stepNumber: 1,
          title: "Registration",
          description: "Register your startup on Startup India portal",
          estimatedTime: "15 minutes"
        },
        {
          stepNumber: 2,
          title: "Document Submission",
          description: "Submit required documents and business plan",
          estimatedTime: "1 hour"
        },
        {
          stepNumber: 3,
          title: "Verification",
          description: "Government verification and approval",
          estimatedTime: "7-10 days"
        }
      ],
      processingTime: "10-15 days",
      applicationFee: { amount: 0, waived: true }
    },
    requiredDocuments: [
      { name: "Business Plan", isMandatory: true, acceptedFormats: ["pdf", "doc", "docx"], maxSize: 10 },
      { name: "PAN Card", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Aadhaar Card", isMandatory: true, acceptedFormats: ["pdf", "jpg", "jpeg"], maxSize: 5 },
      { name: "Bank Account Details", isMandatory: true, acceptedFormats: ["pdf"], maxSize: 5 }
    ],
    dates: {
      launchDate: new Date("2016-01-16"),
      isAlwaysOpen: true
    },
    status: "active",
    translations: {
      hindi: {
        name: "स्टार्टअप इंडिया",
        description: "भारत में स्टार्टअप संस्कृति और उद्यमिता को बढ़ावा देने के लिए सरकारी पहल",
        shortDescription: "स्टार्टअप्स के लिए कर लाभ, फंडिंग और सरलीकृत प्रक्रियाओं सहित सहायता"
      }
    },
    keywords: ["startup", "entrepreneurship", "business", "innovation", "funding"],
    tags: ["central", "startup", "business", "innovation"],
    externalLinks: {
      official: "https://www.startupindia.gov.in",
      guidelines: "https://www.startupindia.gov.in/content/sih/en/startup-scheme.html",
      helpline: "1800-210-0066"
    }
  }
];

// Combine all schemes
const allSchemes = [...sampleSchemes, ...additionalSchemes];

async function seedSchemes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saral-seva-pro');
    console.log('Connected to MongoDB');

    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes');

    // Generate slugs for all schemes before inserting
    const schemesWithSlugs = allSchemes.map(scheme => ({
      ...scheme,
      slug: scheme.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }));

    // Insert new schemes one by one to handle any errors
    let insertedCount = 0;
    for (const scheme of schemesWithSlugs) {
      try {
        await Scheme.create(scheme);
        insertedCount++;
        console.log(`Inserted: ${scheme.name}`);
      } catch (error) {
        console.error(`Error inserting ${scheme.name}:`, error.message);
      }
    }

    console.log(`Successfully inserted ${insertedCount} schemes`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding schemes:', error);
    process.exit(1);
  }
}

seedSchemes();
