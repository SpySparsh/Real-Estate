/**
 * translations.js
 *
 * Central translation data store for the bilingual (EN / HI) system.
 *
 * Structure:
 *   translations.<lang>.<section>.<key>
 *
 * Phase 3 — navigation + hero
 * Phase 4 — introduction, vision, portfolioImpact, partners
 * Phase 5 — projects
 * Phase 6 — closingCTA, enquiry, footer
 * Phase 7 — philosophy
 * Phase 8 — audit fixes (vision.imageFallback, projects renderMediaItem fallback)
 *
 * All sections complete.
 */

const translations = {
  en: {
    /* ── Common ────────────────────────────────────────────────────── */
    common: {
      language: 'Language',
      english: 'English',
      hindi: 'Hindi',
    },

    /* ── Navigation ─────────────────────────────────────────────────── */
    navigation: {
      home: 'Home',
      projects: 'Projects',
      about: 'About',
      contact: 'Contact',
      explore: 'Explore',
      close: 'Close',
    },

    /* ── Hero ───────────────────────────────────────────────────────── */
    hero: {
      headlineLines: ['Building Value.', 'Shaping Tomorrow.'],
      label: 'Real Estate Investment & Development',
      scrollIndicator: 'Scroll',
    },

    /* ── Introduction ───────────────────────────────────────────────── */
    introduction: {
      eyebrow: 'Introduction',
      headline: 'See Beyond the Site.',

      // Stage toggle labels
      stagePlanning: 'Planning',
      stageDeveloped: 'Developed',

      // Scale labels — planning stage
      planningScaleValue: 'Value',
      planningScalePotential: 'Potential',
      planningScaleOpportunity: 'Opportunity',
      planningNote: 'Indicative analysis — planning stage',

      // Scale labels — developed stage
      developedScaleValue: 'Value Created',
      developedScaleDevelopment: 'Development',
      developedScaleMarket: 'Market Presence',
      developedNote: 'Indicative analysis — developed stage',
    },

    /* ── Vision ─────────────────────────────────────────────────────── */
    vision: {
      eyebrow: 'Vision & Purpose',
      headlineLines: ['Built on Trust.', 'Driven by Vision.'],
      description:
        'Shri Radhika Developers was founded on the principle that real estate should create lasting value — for investors, for communities, and for the future. We are committed to thoughtful development that balances growth with quality.',
      imageFallback: 'Vision Image',
    },

    /* ── Portfolio Impact ───────────────────────────────────────────── */
    portfolioImpact: {
      eyebrow: 'Portfolio Impact',
      // Stat labels (values/numbers are never translated)
      yearsOfExperience: 'Years of Experience',
      developments: 'Developments',
      acresDeveloped: 'Acres Developed',
      locations: 'Locations',
    },

    /* ── Partners ───────────────────────────────────────────────────── */
    partners: {
      eyebrow: 'Strategic Partners',
      headline: 'Trusted by long-term thinkers.',
      previous: '← Previous',
      next: 'Next →',

      // Partner data keyed by partner id
      // Names are proper nouns and are NOT translated
      p01: {
        role: 'Investment Strategist',
        focus: 'Capital direction & opportunity mapping',
        description:
          'Aarav works with us on identifying the right opportunities, balancing future upside with disciplined execution, and ensuring every decision aligns with long-term value creation.',
        qualities: ['Portfolio view', 'Market fit', 'Risk discipline'],
      },
      p02: {
        role: 'Design & Planning Lead',
        focus: 'Concept direction & community relevance',
        description:
          'Naina leads planning and design conversations that shape how spaces function in real life — ensuring each development is both beautiful and thoughtful for the communities it serves.',
        qualities: ['Place-making', 'Planning insight', 'Design rigor'],
      },
      p03: {
        role: 'Development Partner',
        focus: 'Execution strategy & delivery',
        description:
          'Rohan brings a practical approach to delivery, aligning design intent with build realities and helping keep the vision grounded in strong execution and measurable outcomes.',
        qualities: ['Execution', 'Delivery', 'Operational clarity'],
      },
    },

    /* ── Projects ───────────────────────────────────────────────────── */
    projects: {
      // Section UI
      eyebrow: 'Portfolio',
      heading: 'Selected',
      headingAccent: 'Projects.',

      // Status labels
      statusCompleted: 'Completed',
      statusOngoing: 'Ongoing',
      statusUpcoming: 'Upcoming',

      // Media navigator tab labels
      mediaOverview: 'Overview',
      mediaGallery: 'Gallery',
      mediaFilm: 'Video',
      mediaLocation: 'Location',

      // Placeholder / UI strings
      projectMediaLabel: 'Project Media',
      exploreLabel: 'Explore →',
      galleryPrev: 'Prev',
      galleryNext: 'Next',
      filmLabel: 'Project Film',
      filmComingSoon: 'Coming Soon',
      locationLabel: 'Project Location',
      locationMap: 'Location Map',
      locationComingSoon: 'Map integration coming soon.',

      // Per-project translatable content — keyed by project id (p01, p02, p03, p04)
      // Structural fields (id, images, mediaViews, etc.) stay in siteData.js
      p01: {
        name: 'Project Name',
        category: 'Residential Development',
        location: 'Location',
        status: 'Completed',
        description:
          'A selected residential development designed with a focus on quality living and long-term value creation.',
      },
      p02: {
        name: 'Project Name',
        category: 'Commercial Development',
        location: 'Location',
        status: 'Ongoing',
        description:
          'A commercial development positioned to serve growing demand in an emerging location.',
      },
      p03: {
        name: 'Project Name',
        category: 'Mixed-Use Development',
        location: 'Location',
        status: 'Completed',
        description:
          'An integrated development combining residential and commercial spaces within a thoughtfully planned environment.',
      },
      p04: {
        name: 'Project Name',
        category: 'Residential Development',
        location: 'Location',
        status: 'Upcoming',
        description:
          'An upcoming residential project focused on modern living and sustainable community design.',
      },
    },

    /* ── Philosophy ─────────────────────────────────────────────────── */
    philosophy: {
      // Section-level
      eyebrow: 'OUR PHILOSOPHY',
      intro: 'Where Potential Begins.',

      // Per-stage — keyed by the stable stage.id values used in philosophyStages[]
      // All structural data (icons, backgroundSvg, from positions, number) stays in Philosophy.jsx
      location: {
        title: 'Location',
        statement: 'Every development begins with understanding the place.',
        support: 'Recognising the character, potential and long-term opportunity within a location.',
      },
      vision: {
        title: 'Vision',
        statement: 'Seeing potential before it becomes obvious.',
        support: 'Looking beyond what exists today toward what a place can become.',
      },
      development: {
        title: 'Development',
        statement: 'Turning possibility into something real.',
        support: 'Bringing vision into physical form through precision, purpose and execution.',
      },
      value: {
        title: 'Value',
        statement: 'Creating spaces that hold lasting value.',
        support: 'Developments designed with balance, permanence and long-term relevance in mind.',
      },
    },

    /* ── Closing CTA ────────────────────────────────────────────────── */
    closingCTA: {
      // statementLines maps to closingCTA.statement array (3 lines)
      statementLines: ['The Next', 'Opportunity', 'Starts Here.'],
    },

    /* ── Enquiry ─────────────────────────────────────────────────────── */
    enquiry: {
      eyebrow: 'Enquiry',
      headlineLines: ["Let's Start", 'A Conversation.'],

      // Field labels
      labelName: 'Name *',
      labelPhone: 'Phone *',
      labelEmail: 'Email *',
      labelInterest: 'Interest',
      labelMessage: 'Message',

      // Placeholders
      placeholderName: 'Your name',
      placeholderPhone: 'Your phone number',
      placeholderEmail: 'Your email address',
      placeholderInterestDefault: 'Select an interest',
      placeholderMessage: 'Tell us about your enquiry',

      // Interest option display labels (value= attrs stay as English in siteData)
      interestGeneral: 'General Enquiry',
      interestResidential: 'Residential Project',
      interestCommercial: 'Commercial Project',
      interestInvestment: 'Investment Opportunity',
      interestPartnership: 'Partnership',
      interestOther: 'Other',

      // Submit button
      submitIdle: 'Send Enquiry →',
      submitSending: 'Sending...',

      // Success state
      successHeading: 'Thank you.',
      successBody: 'We have received your enquiry and our team will be in touch with you shortly.',
      successReset: 'Send another message →',

      // Validation errors
      validationNameRequired: 'Name is required',
      validationPhoneRequired: 'Phone is required',
      validationEmailRequired: 'Email is required',
      validationEmailInvalid: 'Please enter a valid email address',

      // Global / submission errors
      errorNotConfigured: 'The enquiry form is not configured yet. Please contact the website administrator.',
      errorGeneric: 'Something went wrong. Please try again later.',
      errorNetwork: 'A network error occurred. Please check your connection and try again.',
    },

    /* ── Footer ─────────────────────────────────────────────────────── */
    footer: {
      // Section column headings
      columnLocation: 'Location',
      columnContact: 'Contact',
      columnSocial: 'Social',

      // Bottom bar — copyright uses siteData footer.copyright which has brand name
      // Translate only the Back to Top button label
      backToTop: 'Back to Top',

      // Fallback text when contact data is empty
      addressFallback: 'Address to be updated',
      emailFallback: 'Email to be updated',
      phoneFallback: 'Phone to be updated',
    },
  },

  /* ════════════════════════════════════════════════════════════════════ */

  hi: {
    /* ── Common ────────────────────────────────────────────────────── */
    common: {
      language: 'भाषा',
      english: 'अंग्रेज़ी',
      hindi: 'हिंदी',
    },

    /* ── Navigation ─────────────────────────────────────────────────── */
    navigation: {
      home: 'होम',
      projects: 'परियोजनाएं',
      about: 'हमारे बारे में',
      contact: 'संपर्क',
      explore: 'देखें',
      close: 'बंद करें',
    },

    /* ── Hero ───────────────────────────────────────────────────────── */
    hero: {
      headlineLines: ['मूल्य निर्माण।', 'कल को आकार देना।'],
      label: 'रियल एस्टेट निवेश एवं विकास',
      scrollIndicator: 'स्क्रॉल करें',
    },

    /* ── Introduction ───────────────────────────────────────────────── */
    introduction: {
      eyebrow: 'परिचय',
      headline: 'स्थान से परे देखें।',

      stagePlanning: 'योजना',
      stageDeveloped: 'विकसित',

      planningScaleValue: 'मूल्य',
      planningScalePotential: 'संभावना',
      planningScaleOpportunity: 'अवसर',
      planningNote: 'संकेतक विश्लेषण — योजना चरण',

      developedScaleValue: 'निर्मित मूल्य',
      developedScaleDevelopment: 'विकास',
      developedScaleMarket: 'बाज़ार उपस्थिति',
      developedNote: 'संकेतक विश्लेषण — विकसित चरण',
    },

    /* ── Vision ─────────────────────────────────────────────────────── */
    vision: {
      eyebrow: 'दृष्टि एवं उद्देश्य',
      headlineLines: ['विश्वास पर निर्मित।', 'दृष्टि से प्रेरित।'],
      description:
        'श्री राधिका डेवलपर्स की स्थापना इस सिद्धांत पर हुई कि रियल एस्टेट को स्थायी मूल्य बनाना चाहिए — निवेशकों के लिए, समुदायों के लिए और भविष्य के लिए। हम ऐसे विकास के प्रति प्रतिबद्ध हैं जो विकास और गुणवत्ता के बीच संतुलन बनाए।',
      imageFallback: 'दृष्टि चित्र',
    },

    /* ── Portfolio Impact ───────────────────────────────────────────── */
    portfolioImpact: {
      eyebrow: 'पोर्टफोलियो प्रभाव',
      yearsOfExperience: 'वर्षों का अनुभव',
      developments: 'विकास परियोजनाएं',
      acresDeveloped: 'एकड़ विकसित',
      locations: 'स्थान',
    },

    /* ── Partners ───────────────────────────────────────────────────── */
    partners: {
      eyebrow: 'रणनीतिक भागीदार',
      headline: 'दीर्घकालिक सोच रखने वालों का विश्वास।',
      previous: '← पिछला',
      next: 'अगला →',

      p01: {
        role: 'निवेश रणनीतिकार',
        focus: 'पूंजी दिशा एवं अवसर मानचित्रण',
        description:
          'आरव हमारे साथ सही अवसरों की पहचान करने, भविष्य की संभावनाओं और अनुशासित क्रियान्वयन के बीच संतुलन बनाने, तथा यह सुनिश्चित करने में काम करते हैं कि हर निर्णय दीर्घकालिक मूल्य निर्माण के अनुरूप हो।',
        qualities: ['पोर्टफोलियो दृष्टि', 'बाज़ार अनुकूलन', 'जोखिम अनुशासन'],
      },
      p02: {
        role: 'डिज़ाइन एवं योजना प्रमुख',
        focus: 'अवधारणा दिशा एवं सामुदायिक प्रासंगिकता',
        description:
          'नैना योजना और डिज़ाइन की बातचीत का नेतृत्व करती हैं जो यह आकार देती हैं कि स्थान वास्तविक जीवन में कैसे कार्य करते हैं — यह सुनिश्चित करते हुए कि प्रत्येक विकास सुंदर और समुदायों के लिए विचारशील हो।',
        qualities: ['स्थान-निर्माण', 'योजना अंतर्दृष्टि', 'डिज़ाइन कठोरता'],
      },
      p03: {
        role: 'विकास भागीदार',
        focus: 'क्रियान्वयन रणनीति एवं डिलीवरी',
        description:
          'रोहन डिलीवरी के लिए एक व्यावहारिक दृष्टिकोण लाते हैं, डिज़ाइन के इरादे को निर्माण वास्तविकताओं के साथ जोड़ते हैं और दृष्टि को मज़बूत क्रियान्वयन और मापनीय परिणामों में स्थापित रखने में मदद करते हैं।',
        qualities: ['क्रियान्वयन', 'डिलीवरी', 'परिचालन स्पष्टता'],
      },
    },

    /* ── Projects ───────────────────────────────────────────────────── */
    projects: {
      // Section UI
      eyebrow: 'पोर्टफोलियो',
      heading: 'चयनित',
      headingAccent: 'परियोजनाएं।',

      // Status labels
      statusCompleted: 'पूर्ण',
      statusOngoing: 'जारी',
      statusUpcoming: 'आगामी',

      // Media navigator tab labels
      mediaOverview: 'अवलोकन',
      mediaGallery: 'गैलरी',
      mediaFilm: 'वीडियो',
      mediaLocation: 'स्थान',

      // Placeholder / UI strings
      projectMediaLabel: 'प्रोजेक्ट मीडिया',
      exploreLabel: 'देखें →',
      galleryPrev: 'पिछला',
      galleryNext: 'अगला',
      filmLabel: 'प्रोजेक्ट फ़िल्म',
      filmComingSoon: 'जल्द आएगा',
      locationLabel: 'प्रोजेक्ट स्थान',
      locationMap: 'स्थान मानचित्र',
      locationComingSoon: 'मानचित्र एकीकरण शीघ्र उपलब्ध होगा।',

      // Per-project translatable content — keyed by project id (p01–p04)
      // Structural fields (id, images, mediaViews, etc.) stay in siteData.js
      p01: {
        name: 'परियोजना का नाम',
        category: 'आवासीय विकास',
        location: 'स्थान',
        status: 'पूर्ण',
        description:
          'गुणवत्तापूर्ण जीवन और दीर्घकालिक मूल्य निर्माण पर केंद्रित एक चयनित आवासीय विकास परियोजना।',
      },
      p02: {
        name: 'परियोजना का नाम',
        category: 'व्यावसायिक विकास',
        location: 'स्थान',
        status: 'जारी',
        description:
          'एक उभरते क्षेत्र में बढ़ती मांग को पूरा करने के लिए स्थापित एक व्यावसायिक विकास परियोजना।',
      },
      p03: {
        name: 'परियोजना का नाम',
        category: 'मिश्रित-उपयोग विकास',
        location: 'स्थान',
        status: 'पूर्ण',
        description:
          'एक सुनियोजित परिवेश में आवासीय और व्यावसायिक स्थानों को एकीकृत करने वाला एक समग्र विकास।',
      },
      p04: {
        name: 'परियोजना का नाम',
        category: 'आवासीय विकास',
        location: 'स्थान',
        status: 'आगामी',
        description:
          'आधुनिक जीवनशैली और टिकाऊ सामुदायिक डिज़ाइन पर केंद्रित एक आगामी आवासीय परियोजना।',
      },
    },

    /* ── Philosophy ─────────────────────────────────────────────────── */
    philosophy: {
      // Section-level
      eyebrow: 'हमारी विचारधारा',
      intro: 'जहाँ संभावना आरंभ होती है।',

      // Per-stage — keyed by the stable stage.id values (location, vision, development, value)
      location: {
        title: 'स्थान',
        statement: 'हर विकास एक स्थान को समझने से शुरू होता है।',
        support: 'किसी स्थान की प्रकृति, संभावना और दीर्घकालिक अवसर को पहचानना।',
      },
      vision: {
        title: 'दृष्टि',
        statement: 'संभावना को स्पष्ट होने से पहले देखना।',
        support: 'आज जो है उससे परे — यह देखना कि कोई स्थान क्या बन सकता है।',
      },
      development: {
        title: 'विकास',
        statement: 'संभावना को वास्तविकता में बदलना।',
        support: 'दृष्टि को सटीकता, उद्देश्य और क्रियान्वयन के माध्यम से भौतिक रूप देना।',
      },
      value: {
        title: 'मूल्य',
        statement: 'ऐसे स्थान बनाना जो स्थायी मूल्य रखें।',
        support: 'संतुलन, स्थायित्व और दीर्घकालिक प्रासंगिकता को ध्यान में रखकर बनाए गए विकास।',
      },
    },

    /* ── Closing CTA ────────────────────────────────────────────────── */
    closingCTA: {
      statementLines: ['अगला', 'अवसर', 'यहाँ से शुरू होता है।'],
    },

    /* ── Enquiry ─────────────────────────────────────────────────────── */
    enquiry: {
      eyebrow: 'पूछताछ',
      headlineLines: ['एक बातचीत', 'शुरू करें।'],

      // Field labels
      labelName: 'नाम *',
      labelPhone: 'फ़ोन *',
      labelEmail: 'ईमेल *',
      labelInterest: 'रुचि',
      labelMessage: 'संदेश',

      // Placeholders
      placeholderName: 'आपका नाम',
      placeholderPhone: 'आपका फ़ोन नंबर',
      placeholderEmail: 'आपका ईमेल पता',
      placeholderInterestDefault: 'रुचि चुनें',
      placeholderMessage: 'अपनी पूछताछ के बारे में बताएं',

      // Interest option display labels — value= attrs always remain English (from siteData)
      interestGeneral: 'सामान्य पूछताछ',
      interestResidential: 'आवासीय परियोजना',
      interestCommercial: 'व्यावसायिक परियोजना',
      interestInvestment: 'निवेश अवसर',
      interestPartnership: 'साझेदारी',
      interestOther: 'अन्य',

      // Submit button
      submitIdle: 'पूछताछ भेजें →',
      submitSending: 'भेजा जा रहा है...',

      // Success state
      successHeading: 'धन्यवाद।',
      successBody: 'हमें आपकी पूछताछ प्राप्त हो गई है और हमारी टीम शीघ्र ही आपसे संपर्क करेगी।',
      successReset: 'एक और संदेश भेजें →',

      // Validation errors
      validationNameRequired: 'नाम आवश्यक है',
      validationPhoneRequired: 'फ़ोन आवश्यक है',
      validationEmailRequired: 'ईमेल आवश्यक है',
      validationEmailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें',

      // Global / submission errors
      errorNotConfigured: 'पूछताछ फ़ॉर्म अभी कॉन्फ़िगर नहीं किया गया है। कृपया वेबसाइट व्यवस्थापक से संपर्क करें।',
      errorGeneric: 'कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।',
      errorNetwork: 'नेटवर्क त्रुटि हुई। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।',
    },

    /* ── Footer ─────────────────────────────────────────────────────── */
    footer: {
      // Section column headings
      columnLocation: 'स्थान',
      columnContact: 'संपर्क',
      columnSocial: 'सोशल',

      // Back to Top button
      backToTop: 'शीर्ष पर जाएं',

      // Fallback text when contact data is empty
      addressFallback: 'पता अपडेट किया जाएगा',
      emailFallback: 'ईमेल अपडेट किया जाएगा',
      phoneFallback: 'फ़ोन अपडेट किया जाएगा',
    },
  },
}

export default translations
