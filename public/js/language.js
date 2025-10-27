// Language Switching System
const translations = {
  hi: {
    // Navigation
    home: "होम",
    getDetails: "विवरण प्राप्त करें",
    gallery: "गैलरी",
    profile: "प्रोफ़ाइल",
    admin: "एडमिन",
    logout: "लॉगआउट",
    register: "रजिस्टर करें",
    login: "लॉगिन",
    
    // Home Page
    welcome: "हमारे गाँव पताढ़ी में आपका स्वागत है",
    welcomeDesc: "यह वेबसाइट हमारे गाँव के निवासियों के लिए बनाई गई है और यहाँ आप रजिस्टर कर सकते हैं।",
    welcomeDesc2: "अपने विवरण दर्ज करें, निवासियों को खोजें और पंचायत से जुड़ी जानकारी प्राप्त करें।",
    searchResidents: "निवासियों को खोजें",
    registerNow: "रजिस्टर करें",
    objective: "उद्देश्य",
    objectiveText: "इस वेबसाइट का उद्देश्य गाँव के सभी लोगों को डिजिटल सुविधा प्रदान करना है। इसके माध्यम से आप अपने परिवार और गाँव की जानकारी दर्ज कर सकते हैं, पारदर्शी तरीके से विवरण देख सकते हैं और गाँव के कामकाज से जुड़े रह सकते हैं। यह प्रयास गाँव को डिजिटल और आधुनिक बनाने की दिशा में एक छोटा सा कदम है।",
    disclaimer: "⚠️ अस्वीकरण (Disclaimer)",
    disclaimerText: "यह वेबसाइट सभी उपयोगकर्ताओं की मदद के लिए बनाई गई है। कृपया ध्यान दें कि सभी पंजीकृत (Registered) उपयोगकर्ताओं की जानकारी सार्वजनिक रूप से उपलब्ध होगी और कोई भी बिना पंजीकरण के इसे खोज सकता है। यदि आपकी जानकारी लीक होती है, तो इसके लिए वेबसाइट डेवलपर जिम्मेदार नहीं होगा। पंजीकरण से पहले इस बात को ध्यान में रखें।",
    donation: "💰 दान करें (Donation)",
    donationText: "इस वेबसाइट के होस्टिंग और प्रबंधन के लिए सहायता प्रदान करें",
    thankYou: "धन्यवाद!",
    developer: "👨‍💻 डेवलपर (Developer)",
    
    // Login Page
    loginTitle: "लॉगिन",
    mobile: "मोबाइल नंबर",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    
    // Register Page
    registerTitle: "रजिस्टर करें",
    name: "नाम",
    email: "ईमेल",
    aadhaar: "आधार (12 अंक)",
    dateOfBirth: "जन्म तिथि",
    createPassword: "पासवर्ड बनाएं",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    panchayat: "पंचायत",
    village: "गाँव",
    selectVillage: "गाँव चुनें",
    
    // Details Page
    searchTitle: "निवासियों को खोजें",
    searchPlaceholder: "नाम, मोबाइल, आधार से खोजें...",
    search: "खोजें",
    
    // Footer
    footerText: "© 2025 पताढ़ी पंचायत। सर्वाधिकार सुरक्षित।",
    
    // Buttons
    submit: "सबमिट करें",
    cancel: "रद्द करें",
    agree: "मैं सहमत हूँ",
    close: "बंद करें"
  },
  
  en: {
    // Navigation
    home: "Home",
    getDetails: "Get Details",
    gallery: "Gallery",
    profile: "Profile",
    admin: "Admin",
    logout: "Logout",
    register: "Register",
    login: "Login",
    
    // Home Page
    welcome: "Welcome to Our Village Patarhi",
    welcomeDesc: "This website is created for our village residents and you can register here.",
    welcomeDesc2: "Enter your details, search for residents and get information related to the panchayat.",
    searchResidents: "Search Residents",
    registerNow: "Register Now",
    objective: "Objective",
    objectiveText: "The objective of this website is to provide digital facilities to all the people of the village. Through this you can enter your family and village information, view details transparently and stay connected with the work of the village. This effort is a small step towards making the village digital and modern.",
    disclaimer: "⚠️ Disclaimer",
    disclaimerText: "This website is created to help all users. Please note that the information of all registered users will be publicly available and anyone can search it without registration. If your information is leaked, the website developer will not be responsible for it. Keep this in mind before registration.",
    donation: "💰 Donation",
    donationText: "Help with hosting and management of this website",
    thankYou: "Thank You!",
    developer: "👨‍💻 Developer",
    
    // Login Page
    loginTitle: "Login",
    mobile: "Mobile Number",
    password: "Password",
    forgotPassword: "Forgot Password?",
    
    // Register Page
    registerTitle: "Register",
    name: "Name",
    email: "Email",
    aadhaar: "Aadhaar (12 digits)",
    dateOfBirth: "Date of Birth",
    createPassword: "Create Password",
    confirmPassword: "Confirm Password",
    panchayat: "Panchayat",
    village: "Village",
    selectVillage: "Select Village",
    
    // Details Page
    searchTitle: "Search Residents",
    searchPlaceholder: "Search by name, mobile, aadhaar...",
    search: "Search",
    
    // Footer
    footerText: "© 2025 Patarhi Panchayat. All Rights Reserved.",
    
    // Buttons
    submit: "Submit",
    cancel: "Cancel",
    agree: "I Agree",
    close: "Close"
  }
};

// Get current language from localStorage or default to Hindi
let currentLang = localStorage.getItem('language') || 'hi';

// Function to translate page
function translatePage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Update all elements with data-translate attribute
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type !== 'submit') {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Update language button
  const langBtn = document.getElementById('currentLang');
  if (langBtn) {
    langBtn.textContent = lang === 'hi' ? 'हिं' : 'EN';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved language
  translatePage(currentLang);
  
  // Language switcher button
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const newLang = currentLang === 'hi' ? 'en' : 'hi';
      translatePage(newLang);
    });
  }
});
