/**
 * MadridMinds site configuration.
 * Edit prices, sessions, and contact here — pages read these values.
 * Leave sessions empty until dates are confirmed (do not invent them).
 */
window.MM_CONFIG = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"]
  },

  contact: {
    email: "ruy@madridminds.com",
    instagram: "https://instagram.com/madridminds",
    instagramHandle: "@madridminds"
  },

  beehiivEmbed:
    "https://subscribe-forms.beehiiv.com/99a27d92-3bee-4026-9c32-33556a386d08",

  pricing: {
    currency: "EUR",
    /** Public sticker — one seat */
    experiencePerPerson: 75,
    /**
     * Personal invite rate. Share /en/book.html?invite=CODE (or ?code=).
     * Soft unlock only — not real security. Change inviteCode anytime.
     */
    invitePerPerson: 55,
    inviteCode: "welcome",
    inviteStorageKey: "mm-invite",
    /** Not sold publicly — ask via mailto if someone wants all three */
    bundlePerPerson: null,
    guestIncluded: false,
    guestAddOn: null,
    note: null,
    // Legacy aliases (public sticker)
    experienceForTwo: 75,
    bundleForTwo: null
  },

  /**
   * Soft-gated Members area (Learn / rules / pieces).
   * Change password here; email the link /en/members.html + this code after booking.
   * Not real security — courtesy gate only.
   */
  members: {
    password: "madridminds",
    storageKey: "mm-members"
  },

  // Consumer duration unpublished until a real length is set.
  // Teams may still say ~90–120 minutes as an approximate range.
  duration: {
    published: false,
    label: null
  },

  /**
   * Open product decisions.
   */
  openDecisions: {
    comeAlone: {
      allowed: true,
      publishedCopy: "Coming alone is normal — we'll seat you with the group."
    },
    bundle: {
      sameGuestRequired: null,
      transferable: null,
      expiry: null
    }
  },

  englishLevelNote: "Comfortable following English",

  /**
   * Future slots. Keep false / empty until real assets exist.
   * nameThePlayer: playful email-capture mini-game (not built)
   * womensEdition: a women's edition of The First Move
   * giftVouchers: gift an evening
   * testimonials: [{ quote, attribution, role }] — Teams page only; stay hidden while empty
   * clientLogos: [{ src, alt, name }] — Teams page only; stay hidden while empty
   */
  features: {
    nameThePlayer: false,
    womensEdition: false,
    giftVouchers: false,
    testimonials: [],
    clientLogos: []
  },

  /**
   * Upcoming evenings. Add objects when dates are confirmed:
   * {
   *   id: "tfm-2026-11-12",
   *   experienceId: "the-first-move",
   *   dateLabel: "Thursday 12 November",
   *   timeLabel: "19:00",
   *   city: "Madrid",
   *   seatsLabel: "Small group",
   *   mailtoSubject: "Book your First Move — 12 November"
   * }
   */
  sessions: [],

  experiences: [
    {
      id: "the-first-move",
      number: "01",
      label: "Begin",
      name: "The First Move",
      tagline: "Your first chess evening.",
      promise: "Chess is easier than you think.",
      href: "the-first-move.html",
      durationKey: "duration",
      cadence: "most-often",
      audience: "Complete beginners",
      nextId: "think-ahead",
      nextCta: "Continue with Think Ahead"
    },
    {
      id: "think-ahead",
      number: "02",
      label: "Think",
      name: "Think Ahead",
      tagline: "Start seeing what good players see.",
      promise: "Start seeing what good players see.",
      href: "think-ahead.html",
      durationKey: "duration",
      cadence: "less-often",
      audience: "You know how the pieces move",
      nextId: "game-plan",
      nextCta: "Continue with Game Plan"
    },
    {
      id: "game-plan",
      number: "03",
      label: "Plan",
      name: "Game Plan",
      tagline: "Start playing with a plan.",
      promise: "Start playing with a plan.",
      href: "game-plan.html",
      durationKey: "duration",
      cadence: "less-often",
      audience: "Beginners who want more purpose",
      nextId: null,
      nextCta: null
    }
  ]
};
