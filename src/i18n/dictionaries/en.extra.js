// Store policies, help pages, cookies and reviews (merged into en.js).
const extra = {
  meta: { adminReviews: { title: "Reviews · Admin" } },

  auth: { welcomeBackName: "Welcome back, {name}!", welcomeAdmin: "Welcome back, admin!" },

  footer: { company: "Company", legal: "Legal", cookieSettings: "Cookie settings", rights: "All rights reserved." },

  cookies: {
    title: "We value your privacy",
    text: "We use cookies to keep you signed in, remember your bag and language, and — with your permission — to understand how the store is used.",
    learnMore: "Cookie policy",
    acceptAll: "Accept all",
    decline: "Decline",
    customize: "Customise",
    settingsTitle: "Cookie preferences",
    settingsText: "Choose which cookies we may use. You can change this at any time from the footer.",
    save: "Save preferences",
    necessary: { title: "Strictly necessary", text: "Sign-in, security, your bag and language. Always on." },
    analytics: { title: "Analytics", text: "Anonymous usage statistics that help us improve the store." },
    marketing: { title: "Marketing", text: "Personalised offers and measuring our campaigns." },
  },

  reviews: {
    title: "Customer Reviews",
    count: { one: "Based on {count} review", other: "Based on {count} reviews" },
    write: "Write a review",
    signIn: "to write a review.",
    rating: "Your rating",
    titleLabel: "Title",
    titlePlaceholder: "Sum it up in a few words",
    body: "Your review",
    bodyPlaceholder: "What did you like? How was the fit and quality?",
    submit: "Post Review",
    thanks: "Thanks for your review!",
    empty: "No reviews yet — be the first to share your thoughts.",
    alreadyReviewed: "You've already reviewed this product. Thank you!",
    deleteTitle: "Delete review?",
    deleteText: "This review will be removed from the product page.",
  },

  validation: { rating: "Please choose a rating.", reviewLong: "Reviews must be 1,000 characters or fewer." },

  errors: {
    tooManyRequests: "Too many attempts. Please wait a moment and try again.",
    alreadyReviewed: "You've already reviewed this product.",
    trackNotFound: "We couldn't find an order with that number and email.",
  },

  admin: {
    nav: { reviews: "Reviews" },
    products: { noCategory: "No category" },
    reviews: { text: "What customers are saying. Remove anything inappropriate.", all: { one: "{count} review", other: "{count} reviews" }, empty: "No reviews yet" },
  },

  pages: {
    lastUpdated: "Last updated {date}",
    trackOrder: {
      title: "Track Your Order",
      description: "Check the status of a Wear Zara order with your order number and email.",
      intro: "Enter the order number from your confirmation (it starts with WZ-) and the email you used at checkout.",
      number: "Order number",
      submit: "Track",
    },
    shipping: {
      title: "Shipping & Delivery",
      description: "Delivery times, costs and how we ship your Wear Zara order.",
      intro: "Every order is packed with care and shipped from our studio. Delivery is free on orders over {amount}.",
      sections: [
        { title: "Delivery costs", body: "Orders over {amount} ship free. Below that, a flat fee of {fee} applies, whatever the size of your order." },
        { title: "Delivery times", body: "Orders placed before 2 pm ship the same working day. Most deliveries arrive within 2–4 business days." },
        { title: "Order tracking", body: "Follow every step from your account under Orders, or use the Track Your Order page with your order number and email." },
        { title: "Cash on delivery", body: "Pay in cash when your parcel arrives — please have the exact amount ready for the courier." },
        { title: "Missed delivery", body: "If you're not home, the courier will call you and try again the next working day." },
      ],
    },
    returns: {
      title: "Returns & Refunds",
      description: "How to return an item and when you'll get your money back.",
      intro: "Not quite right? Return any unworn item within {days} days of delivery for a full refund.",
      sections: [
        { title: "What can be returned", body: "Items must be unworn, unwashed and returned with their original tags. For hygiene reasons swimwear and underwear can only be returned with the hygiene strip in place." },
        { title: "How to return", body: "Contact us with your order number and the items you'd like to return. We'll arrange a free courier collection from your address." },
        { title: "Refunds", body: "Once your return reaches us we check it within 2 days and refund you within 7 days." },
        { title: "Exchanges", body: "Need another size? Mention it when you contact us and we'll send the new size as soon as your return is collected." },
        { title: "Damaged or wrong items", body: "If something arrives damaged or isn't what you ordered, tell us within 48 hours and we'll put it right at no cost to you." },
      ],
    },
    sizeGuide: {
      title: "Size Guide",
      description: "Find your perfect fit with our size charts for women and men.",
      intro: "All measurements are body measurements in centimetres. If you're between sizes, we recommend sizing up.",
      table: { women: "Women", men: "Men", size: "Size", chest: "Chest / Bust (cm)", waist: "Waist (cm)", hips: "Hips (cm)" },
      sections: [
        { title: "Chest / Bust", body: "Measure around the fullest part of your chest, keeping the tape horizontal under your arms." },
        { title: "Waist", body: "Measure around your natural waistline, the narrowest part of your torso." },
        { title: "Hips", body: "Stand with your feet together and measure around the fullest part of your hips." },
        { title: "Still unsure?", body: "Our team is happy to help you choose — email {email} with your measurements." },
      ],
    },
    careers: {
      title: "Careers",
      description: "Join the Wear Zara team.",
      intro: "We're a small team building a better way to shop for fashion. If you love great products and care about the details, we'd like to meet you.",
      openRoles: "Open positions",
      roles: [
        { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote" },
        { title: "Fashion Buyer — Womenswear", team: "Merchandising", location: "London" },
        { title: "Customer Experience Specialist", team: "Support", location: "Lahore" },
        { title: "Content Photographer", team: "Creative", location: "London" },
      ],
      sections: [
        { title: "How we work", body: "Small teams, clear goals and plenty of room to own your work. Most roles can be done remotely." },
        { title: "Benefits", body: "Competitive pay, a generous clothing allowance, flexible hours and 30 days of paid leave." },
        { title: "Don't see your role?", body: "Send your CV and a short note to careers@wearzara.com — we're always happy to hear from great people." },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "How Wear Zara collects, uses and protects your personal data.",
      intro: "Your privacy matters to us. This policy explains what we collect, why, and the choices you have.",
      sections: [
        { title: "What we collect", body: "Account details (name, email, password stored as a secure hash), delivery details you enter at checkout, your orders, bag and wishlist, reviews, and messages you send us." },
        { title: "How we use it", body: "To process and deliver orders, keep your account and bag in sync, answer your questions and — only if you opt in — send offers." },
        { title: "Who we share it with", body: "Only with the couriers and service providers needed to run the store. We never sell your personal data." },
        { title: "How long we keep it", body: "Account data is kept until you delete your account. Deleting your account also deletes your order history." },
        { title: "Your rights", body: "You can view and update your details in your account, delete your account at any time, and contact {email} with any privacy request." },
        { title: "Security", body: "Passwords are hashed with bcrypt, connections are encrypted, and access to customer data is limited to store administrators." },
      ],
    },
    terms: {
      title: "Terms of Service",
      description: "The terms that apply when you use Wear Zara.",
      intro: "By using Wear Zara you agree to these terms. Please read them carefully.",
      sections: [
        { title: "Your account", body: "Keep your password secret and your details accurate. You're responsible for activity on your account." },
        { title: "Orders and prices", body: "Prices are shown in US dollars. An order is confirmed once you receive an order number. We may cancel orders affected by obvious pricing errors." },
        { title: "Payment", body: "Orders are currently paid in cash on delivery. Card payments will be added soon." },
        { title: "Coupons", body: "Coupon codes can't be exchanged for cash, may have a minimum spend and usage limit, and can be withdrawn at any time." },
        { title: "Reviews", body: "Reviews must be honest and respectful. We may remove reviews that are offensive, misleading or unrelated to the product." },
        { title: "Liability", body: "We do our best to keep the store accurate and available, but we can't guarantee it will always be error-free." },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      description: "Which cookies Wear Zara uses and how to control them.",
      intro: "Cookies are small files stored in your browser. Here's how we use them — and how to change your choice.",
      sections: [
        { title: "Strictly necessary", body: "Keep you signed in, protect forms against misuse, and remember your bag, language and theme. These can't be switched off." },
        { title: "Analytics", body: "Help us understand which pages are popular so we can improve the store. Only used if you allow them." },
        { title: "Marketing", body: "Used to show you relevant offers. Only used if you allow them." },
        { title: "Changing your choice", body: "Use \"Cookie settings\" in the footer at any time, or clear cookies in your browser settings." },
      ],
    },
  },
};

export default extra;
