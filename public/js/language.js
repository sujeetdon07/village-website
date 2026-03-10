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
    disclaimerText: "यह वेबसाइट सभी उपयोगकर्ताओं की सहायता के उद्देश्य से बनाई गई है। कृपया ध्यान दें कि सभी पंजीकृत उपयोगकर्ताओं के मोबाइल नंबर वेबसाइट पर प्रदर्शित होंगे, और कोई भी व्यक्ति इन्हें खोज या देख सकता है।",
    donation: "💰 सहायता करे (Donation)",
    donationText: "इस वेबसाइट के होस्टिंग और प्रबंधन के लिए सहायता प्रदान करें",
    thankYou: "धन्यवाद!",
    developer: "👨‍💻 Developer & Maintained By",
    
    // Login Page
    loginTitle: "लॉगिन",
    mobile: "मोबाइल नंबर",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    
    // Register Page
    registerTitle: "रजिस्टर करें",
    name: "नाम",
    mobile: "मोबाइल नंबर",
    email: "ईमेल",
    aadhaar: "आधार (12 अंक)",
    dateOfBirth: "जन्म तिथि",
    gender: "लिंग",
    selectGender: "लिंग चुनें",
    male: "पुरुष",
    female: "महिला",
    createPassword: "पासवर्ड बनाएं",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    enterCaptcha: "कैप्चा दर्ज करें",
    panchayat: "पंचायत",
    village: "गाँव",
    selectVillage: "गाँव चुनें",
    disclaimerTitle: "⚠️ अस्वीकरण (Disclaimer)",
    disclaimerMessage: "यह वेबसाइट सभी उपयोगकर्ताओं की सहायता के उद्देश्य से बनाई गई है। कृपया ध्यान दें कि सभी पंजीकृत उपयोगकर्ताओं के मोबाइल नंबर वेबसाइट पर प्रदर्शित होंगे, और कोई भी व्यक्ति इन्हें खोज या देख सकता है।",
    
    // Details Page
    getDetailsTitle: "विवरण प्राप्त करें",
    searchTitle: "निवासियों को खोजें",
    searchPlaceholder: "नाम टाइप करें...",
    searchButton: "खोजें",
    
    // Profile Page
    yourProfile: "आपकी प्रोफ़ाइल",
    editDetails: "विवरण संपादित करें",
    
    // Enter Details Page
    enterDetailsTitle: "अपना विवरण दर्ज करें",
    fullName: "पूरा नाम",
    fatherHusbandName: "पिता/पति का नाम",
    fatherHusbandMobile: "पिता/पति का मोबाइल",
    ward: "वार्ड",
    selectWard: "वार्ड चुनें",
    saveDetails: "विवरण सहेजें",
    dangerZone: "खतरा क्षेत्र",
    deleteAccount: "मेरा खाता स्थायी रूप से हटाएं",
    deleteWarning: "⚠️ चेतावनी: यह क्रिया पूर्ववत नहीं की जा सकती!",
    confirmDelete: "क्या आप वाकई अपना खाता हटाना चाहते हैं?",
    yesDelete: "हाँ, हटाएं",
    noCancel: "नहीं, रद्द करें",
    
    // Gallery Page
    villageGallery: "गाँव की गैलरी",
    noPhotos: "अभी तक कोई फोटो नहीं।",
    
    // Admin Page
    adminDashboard: "एडमिन डैशबोर्ड",
    uploadPhotos: "फोटो अपलोड करें",
    chooseFile: "फ़ाइल चुनें",
    uploadToCloudinary: "क्लाउडिनरी पर अपलोड करें",
    maxSize: "अधिकतम आकार: 5MB | प्रारूप: JPG, PNG, GIF, WEBP",
    gallery: "गैलरी",
    photos: "फोटो",
    delete: "हटाएं",
    feedback: "फीडबैक",
    latest: "नवीनतम",
    importantContacts: "महत्वपूर्ण संपर्क",
    addNewContact: "नया संपर्क जोड़ें",
    category: "श्रेणी",
    selectCategory: "श्रेणी चुनें",
    addContact: "संपर्क जोड़ें",
    edit: "संपादित करें",
    residents: "निवासी",
    totalResidents: "कुल निवासी",
    searchResidentsPlaceholder: "नाम, मोबाइल, आधार से खोजें...",
    actions: "क्रियाएं",
    
    // Footer
    footerText: "© 2025 पताढ़ी पंचायत। सर्वाधिकार सुरक्षित।",
    
    // Buttons
    submit: "सबमिट करें",
    cancel: "रद्द करें",
    agree: "मैं सहमत हूँ",
    close: "बंद करें",
    save: "सहेजें",
    update: "अपडेट करें"
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
    disclaimerText: "This website is created for the purpose of helping all users. Please note that the mobile numbers of all registered users will be displayed on the website, and anyone can search or view them.",
    donation: "💰 Donation",
    donationText: "Help with hosting and management of this website",
    thankYou: "Thank You!",
    developer: "👨‍💻 Developer & Maintained By",
    
    // Login Page
    loginTitle: "Login",
    mobile: "Mobile Number",
    password: "Password",
    forgotPassword: "Forgot Password?",
    
    // Register Page
    registerTitle: "Register",
    name: "Name",
    mobile: "Mobile Number",
    email: "Email",
    aadhaar: "Aadhaar (12 digits)",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    createPassword: "Create Password",
    confirmPassword: "Confirm Password",
    enterCaptcha: "Enter CAPTCHA",
    panchayat: "Panchayat",
    village: "Village",
    selectVillage: "Select Village",
    disclaimerTitle: "⚠️ Disclaimer",
    disclaimerMessage: "This website is created for the purpose of helping all users. Please note that the mobile numbers of all registered users will be displayed on the website, and anyone can search or view them.",
    
    // Details Page
    getDetailsTitle: "Get Details",
    searchTitle: "Search Residents",
    searchPlaceholder: "Type a name...",
    searchButton: "Search",
    
    // Profile Page
    yourProfile: "Your Profile",
    editDetails: "Edit Details",
    
    // Enter Details Page
    enterDetailsTitle: "Enter Your Details",
    fullName: "Full Name",
    fatherHusbandName: "Father's Name/Husband's Name",
    fatherHusbandMobile: "Father's/Husband's Mobile",
    ward: "Ward",
    selectWard: "Select Ward",
    saveDetails: "Save Details",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete My Account Permanently",
    deleteWarning: "⚠️ Warning: This action cannot be undone!",
    confirmDelete: "Are you sure you want to delete your account?",
    yesDelete: "Yes, Delete",
    noCancel: "No, Cancel",
    
    // Gallery Page
    villageGallery: "Village Gallery",
    noPhotos: "No photos yet.",
    
    // Admin Page
    adminDashboard: "Admin Dashboard",
    uploadPhotos: "Upload Photos to Cloudinary",
    chooseFile: "Choose File",
    uploadToCloudinary: "Upload to Cloudinary",
    maxSize: "Max size: 5MB | Formats: JPG, PNG, GIF, WEBP",
    gallery: "Gallery",
    photos: "Photos",
    delete: "Delete",
    feedback: "Feedback",
    latest: "Latest",
    importantContacts: "Important Contacts",
    addNewContact: "Add New Contact",
    category: "Category",
    selectCategory: "Select Category",
    addContact: "Add Contact",
    edit: "Edit",
    residents: "Residents",
    totalResidents: "Total Residents",
    searchResidentsPlaceholder: "Search by name, mobile, aadhaar...",
    actions: "Actions",
    
    // Footer
    footerText: "© 2025 Patarhi Panchayat. All Rights Reserved.",
    
    // Buttons
    submit: "Submit",
    cancel: "Cancel",
    agree: "I Agree",
    close: "Close",
    save: "Save",
    update: "Update"
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
  
  // Update elements with data-translate-placeholder attribute
  document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
    const key = element.getAttribute('data-translate-placeholder');
    if (translations[lang][key]) {
      element.placeholder = translations[lang][key];
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
